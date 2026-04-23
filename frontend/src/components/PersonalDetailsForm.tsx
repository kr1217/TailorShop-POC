'use client';
import { useForm, Controller, } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Dialog, DialogTitle, DialogContent, 
  DialogActions, Button, TextField, Box, Grid,
  Typography, IconButton, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { api } from '@/services/api';
import { useEffect } from 'react';

interface PersonalDetailsFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  customer: any;
}

import { FormInputs } from '@/types/customer';

// Local specific fields to omit everything else and make it clear it's just for personal info
type PersonalInfoForm = {
  personalInfo: FormInputs['personalInfo'];
};

export default function PersonalDetailsForm({ open, onClose, onSuccess, customer }: PersonalDetailsFormProps) {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm<PersonalInfoForm>({
    defaultValues: {
      personalInfo: {
        name: customer?.personalInfo?.name || '',
        phone: customer?.personalInfo?.phone || '',
        address: customer?.personalInfo?.address || '',
        referralBy: customer?.personalInfo?.referralBy || '',
      }
    }
  });

  // Reset form when customer changes
  useEffect(() => {
    if (customer) {
      reset({
        personalInfo: {
          name: customer.personalInfo?.name || '',
          phone: customer.personalInfo?.phone || '',
          address: customer.personalInfo?.address || '',
          referralBy: customer.personalInfo?.referralBy || '',
        }
      });
    }
  }, [customer, reset]);

  const mutation = useMutation({
    mutationFn: (data: PersonalInfoForm) => api.updateCustomer(customer?.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      onSuccess?.(); // Optional callback if we want to show a toast in parent
      onClose();
    },
    onError: (error: any) => {
      // Error is handled by the Alert component in the UI
    }
  });

  const onSubmit = (data: PersonalInfoForm) => {
    mutation.mutate(data);
  };

  const onInvalid = (errors: any) => {
    // Validation errors are handled by TextField helperText
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableScrollLock={true}>
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: '#2C3E50', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
          Edit Customer Identity
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="body2" sx={{ color: '#607D8B', mb: 3 }}>
          Updating these details will reflect in all historical orders for this customer.
        </Typography>

        {mutation.isError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {(() => {
              const data = (mutation.error as any)?.response?.data;
              if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                return data.errors.map((e: any) => e.message).join(', ');
              }
              return data?.message || "Failed to update identity. Check phone number uniqueness.";
            })()}
          </Alert>
        )}
        <Box component="form" sx={{ mt: 1 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="personalInfo.name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Customer Name"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="personalInfo.phone"
                control={control}
                rules={{ required: 'Phone is required' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Phone Number"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="personalInfo.address"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Postal Address (Optional)"
                    multiline
                    rows={3}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: '#F8F9FA' }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderColor: '#2C3E50', color: '#2C3E50' }}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit(onSubmit, onInvalid)} 
          variant="contained" 
          disabled={mutation.isPending}
          sx={{ bgcolor: '#C29B0B', '&:hover': { bgcolor: '#b08b0a' }, color: '#2C3E50', fontWeight: 800 }}
        >
          {mutation.isPending ? 'Saving...' : 'UPDATE IDENTITY'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
