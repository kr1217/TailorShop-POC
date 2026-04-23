'use client';
import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import CustomerList from '@/components/CustomerList';
import PersonalDetailsForm from '@/components/PersonalDetailsForm';
import { Box, Typography } from '@mui/material';

export default function DirectoryPage() {
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = (customer: any) => {
    setEditingCustomer(customer);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingCustomer(null);
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#2C3E50' }}>
          Customer <Typography component="span" variant="h4" sx={{ color: '#C29B0B', fontWeight: 400 }}>| Directory</Typography>
        </Typography>
        <Typography variant="body1" sx={{ color: '#607D8B' }}>
          Manage customer contact information and identity details.
        </Typography>
      </Box>

      <CustomerList onEdit={handleEdit} variant="directory" />

      {editingCustomer && (
        <PersonalDetailsForm 
          open={modalOpen} 
          onClose={handleClose} 
          customer={editingCustomer} 
        />
      )}
    </MainLayout>
  );
}
