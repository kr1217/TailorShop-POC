'use client';
import CustomerForm from '@/components/CustomerForm';
import MainLayout from '@/components/MainLayout';
import { Box, Typography } from '@mui/material';

export default function CustomersPage() {
  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#2C3E50' }}>
          New <Typography component="span" variant="h4" sx={{ color: '#C29B0B', fontWeight: 400 }}>| Registration</Typography>
        </Typography>
        <Typography variant="body1" sx={{ color: '#607D8B' }}>
          Register a new customer and capture their initial measurements and order details.
        </Typography>
      </Box>

      <Box sx={{ mt: 2 }}>
        <CustomerForm clearEdit={() => {}} />
      </Box>
    </MainLayout>
  );
}
