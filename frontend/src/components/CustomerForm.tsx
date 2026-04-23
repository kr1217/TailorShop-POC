import { useState, useEffect, useRef } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useReactToPrint } from 'react-to-print';
import { 
  Grid, Typography, Button, 
  Box, Alert, Snackbar
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import ReceiptView from './ReceiptView';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import PersonalInfoSection from './PersonalInfoSection';
import MeasurementSection from './MeasurementSection';
import OrderDetailsSection from './OrderDetailsSection';
import { FormInputs } from '@/types/customer';

interface CustomerFormProps {
  editData?: any;
  clearEdit: () => void;
}

const EMPTY_FORM: FormInputs = {
  personalInfo: { name: '', phone: '', address: '', referralBy: '' },
  measurements: {
    male: { 
      length: '', shoulder: '', sleeve: '', chest: '', waist: '', neck: '', daman: '', shalwarLength: '', pancha: '',
      extra: { collarType: 'Ban', pocketStyle: 'Side Jieb', cuffStyle: 'Gol Bazu', damanStyle: 'Gol', shalwarType: 'Shalwar' }
    },
    female: { 
      top: { bust: '', underBust: '', waist: '', hips: '', shoulderToApex: '', armhole: '', sleeveLength: '', frontNeckDepth: '', backNeckDepth: '' },
      bottom: { highWaist: '', hips: '', fullLength: '', thigh: '' }
    }
  },
  orderDetails: { 
    quantity: 1, 
    items: [{ colorCode: '#2C3E50', fabricNote: '' }], 
    totalPrice: '', 
    advancePayment: '0',
    dueDate: new Date().toISOString().split('T')[0], 
    orderStatus: 'Pending', 
    paymentStatus: false 
  }
};

export default function CustomerForm({ editData, clearEdit }: CustomerFormProps) {
  const queryClient = useQueryClient();
  const [isSearching, setIsSearching] = useState(false);
  const [printData, setPrintData] = useState<FormInputs>(EMPTY_FORM);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { handleSubmit, control, setValue, watch, reset, getValues } = useForm<FormInputs>({
    defaultValues: EMPTY_FORM
  });

  const { fields: itemFields, append, remove } = useFieldArray({
    control,
    name: "orderDetails.items"
  });

  const receiptRef = useRef<HTMLDivElement>(null);
  const handlePrintTrigger = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt-${watch('personalInfo.phone') || 'New'}`
  });

  const handlePrint = () => {
    // Capture current form state to print snapshot
    setPrintData(getValues());
    // Use a tiny timeout to ensure React state updates the ReceiptView before the print dialog opens
    setTimeout(() => {
      handlePrintTrigger();
    }, 100);
  };

  const phoneValue = watch('personalInfo.phone');
  const quantityValue = watch('orderDetails.quantity');

  // Sync item count with quantity
  useEffect(() => {
    const targetCount = parseInt(String(quantityValue)) || 0;
    const currentCount = itemFields.length;

    if (targetCount > currentCount) {
      for (let i = 0; i < targetCount - currentCount; i++) {
        append({ colorCode: '#2C3E50', fabricNote: '' });
      }
    } else if (targetCount < currentCount) {
      for (let i = 0; i < currentCount - targetCount; i++) {
        remove(currentCount - 1 - i);
      }
    }
  }, [quantityValue, itemFields.length, append, remove]);

  // Search-as-you-type logic
  useEffect(() => {
    const searchPhone = async () => {
      if (phoneValue && phoneValue.length >= 10) {
        setIsSearching(true);
        try {
          const customer = await api.getCustomerByPhone(phoneValue);
          if (customer) {
            // Auto-fill form
            reset(customer);
          }
        } catch (err) {
          // If not found, just keep current state
          console.log("Customer not found", err);
        } finally {
          setIsSearching(false);
        }
      }
    };

    const timer = setTimeout(searchPhone, 1000);
    return () => clearTimeout(timer);
  }, [phoneValue, reset]);

  // Sync with editData from props
  useEffect(() => {
    if (editData) {
      reset(editData);
    }
  }, [editData, reset]);

  const mutation = useMutation({
    mutationFn: api.saveCustomer,
    onSuccess: (data) => {
      console.log("Customer saved successfully:", data);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setSuccessMsg(true);
      if (clearEdit) clearEdit();
      // Ensure the receipt has the data we just saved before clearing the form
      setPrintData(getValues());
      reset(EMPTY_FORM);
    },
    onError: (error: any) => {
      console.error("Save failed:", error);
      const data = error.response?.data;
      let msg = data?.message || error.message || 'Failed to save customer';
      if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        msg = data.errors.map((e: any) => e.message).join(', ');
      }
      setErrorMsg(msg);
    }
  });

  const onSubmit = (data: FormInputs) => {
    // CLEAN DATA: Strip Rs. or commas before sending to backend
    const cleanNum = (val: any) => String(val || '0').replace(/[^\d.-]/g, '');

    const submissionData = {
      ...data,
      orderDetails: {
        ...data.orderDetails,
        totalPrice: cleanNum(data.orderDetails.totalPrice),
        advancePayment: cleanNum(data.orderDetails.advancePayment),
        quantity: parseInt(String(data.orderDetails.quantity)) || 1
      }
    };
    console.log("FINAL Submission Data:", submissionData);
    mutation.mutate(submissionData);
  };

  const handleError = (errors: any) => {
    console.error("Validation errors:", errors);
    setErrorMsg("Please fill all required fields correctly.");
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#fff', borderRadius: 1, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }} suppressHydrationWarning>
      <Box component="div">
        <Typography variant="h5" sx={{ mb: 4, color: '#34495E', fontWeight: 600 }}>
          {editData ? 'Update Measurements & Order' : 'Add New Customer'}
        </Typography>

        {mutation.isError && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {(mutation.error as any)?.response?.data?.message || "Failed to save record. Ensure phone number is unique."}
          </Alert>
        )}

        <Grid container spacing={3}>
          {editData && (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ mb: 4, p: 3, bgcolor: '#F8F9FA', borderRadius: 2, borderLeft: '6px solid #2C3E50', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#607D8B', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>Editing Record for:</Typography>
                  <Typography variant="h5" sx={{ color: '#2C3E50', fontWeight: 900 }}>{watch('personalInfo.name')}</Typography>
                  <Typography variant="body2" sx={{ color: '#C29B0B', fontWeight: 700 }}>{watch('personalInfo.phone')}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                   <Typography variant="caption" sx={{ color: '#607D8B', display: 'block' }}>Address (Verified):</Typography>
                   <Typography variant="body2" sx={{ color: '#2C3E50', fontStyle: 'italic' }}>{watch('personalInfo.address') || 'No Address Provided'}</Typography>
                </Box>
              </Box>
            </Grid>
          )}

          {!editData && <PersonalInfoSection control={control} isSearching={isSearching} />}
          
          <MeasurementSection control={control} />
          
          <Grid size={{ xs: 12 }}>
            <OrderDetailsSection control={control} itemFields={itemFields} append={append} remove={remove} />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            size="large" 
            variant="contained" 
            disabled={mutation.isPending}
            onClick={handleSubmit(onSubmit, handleError)}
            sx={{ 
              flexGrow: 1,
              px: 4, 
              py: 1.5, 
              bgcolor: '#2C3E50',
              '&:hover': { bgcolor: '#1a252f' },
              fontSize: '1rem',
              fontWeight: 700,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            {mutation.isPending ? 'Saving...' : (editData ? 'UPDATE RECORD' : 'SAVE CUSTOMER')}
          </Button>
          <Button 
            size="large" 
            variant="contained" 
            onClick={() => handlePrint()}
            disabled={mutation.isPending}
            startIcon={<PrintIcon />}
            sx={{ 
              flexGrow: 1,
              px: 4, 
              bgcolor: '#C29B0B',
              '&:hover': { bgcolor: '#b08b0a' },
              color: '#2C3E50',
              fontWeight: 700,
            }}
          >
            PRINT RECEIPT
          </Button>
          <Button 
            size="large" 
            variant="outlined" 
            onClick={() => {
              reset(EMPTY_FORM);
              if (clearEdit) clearEdit();
            }}
            sx={{ px: 4, color: '#2C3E50', borderColor: '#2C3E50' }}
          >
            CLEAR
          </Button>
        </Box>
      </Box>

      {/* Hidden Print Area */}
      <Box sx={{ display: 'none' }}>
        <ReceiptView ref={receiptRef} data={printData} />
      </Box>

      <Snackbar open={successMsg} autoHideDuration={6000} onClose={() => setSuccessMsg(false)}>
        <Alert onClose={() => setSuccessMsg(false)} severity="success" variant="filled">
          Customer record saved successfully!
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!errorMsg} 
        autoHideDuration={4000} 
        onClose={() => setErrorMsg('')}
      >
        <Alert severity="error" onClose={() => setErrorMsg('')} sx={{ width: '100%', fontWeight: 600 }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
