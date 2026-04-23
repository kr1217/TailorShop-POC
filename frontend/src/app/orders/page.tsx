'use client';
import { useState, useRef, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import CustomerList from '@/components/CustomerList';
import CustomerForm from '@/components/CustomerForm';
import ReceiptView from '@/components/ReceiptView';
import { useReactToPrint } from 'react-to-print';
import { Box, Typography, Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function OrdersPage() {
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [printData, setPrintData] = useState<any>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrintTrigger = useReactToPrint({
    contentRef: receiptRef,
  });

  const handleEdit = (customer: any) => {
    setEditingOrder(customer);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingOrder(null);
  };

  const handlePrintRequest = (customer: any) => {
    setPrintData(customer);
  };

  // Trigger print after state update and render
  useEffect(() => {
    if (printData) {
      handlePrintTrigger();
      // We keep the data until next print to avoid flickering if needed, 
      // but react-to-print is synchronous in its trigger.
    }
  }, [printData, handlePrintTrigger]);

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#2C3E50' }}>
          Order <Typography component="span" variant="h4" sx={{ color: '#C29B0B', fontWeight: 400 }}>| Management</Typography>
        </Typography>
        <Typography variant="body1" sx={{ color: '#607D8B' }}>
          Track measurements, fabric details, and order status for workshop processing.
        </Typography>
      </Box>

      <CustomerList onEdit={handleEdit} onPrint={handlePrintRequest} variant="orders" />

      {/* Editing Modal */}
      <Dialog 
        open={modalOpen} 
        onClose={handleClose} 
        maxWidth="lg" 
        fullWidth
        scroll="paper"
        slotProps={{
          paper: {
            sx: { borderRadius: 3, bgcolor: '#F5F5DC' }
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 20,
              top: 20,
              zIndex: 10,
              bgcolor: 'rgba(44,62,80,0.1)',
              '&:hover': { bgcolor: 'rgba(44,62,80,0.2)' }
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent sx={{ p: 0 }}>
            {editingOrder && (
              <CustomerForm 
                editData={editingOrder} 
                clearEdit={handleClose} 
              />
            )}
          </DialogContent>
        </Box>
      </Dialog>

      {/* Hidden Print Area */}
      <Box sx={{ display: 'none' }}>
        {printData && <ReceiptView ref={receiptRef} data={printData} />}
      </Box>
    </MainLayout>
  );
}
