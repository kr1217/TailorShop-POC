import { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography } from '@mui/material';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  chest: string;
  waist: string;
  shoulder: string;
  sleeve: string;
  neck: string;
  inseam: string;
}

interface CustomerFormProps {
  onSubmit: (customer: Omit<Customer, 'id'>) => void;
  initialData?: Customer;
  onCancel?: () => void;
}

export function CustomerForm({ onSubmit, initialData, onCancel }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    chest: initialData?.chest || '',
    waist: initialData?.waist || '',
    shoulder: initialData?.shoulder || '',
    sleeve: initialData?.sleeve || '',
    neck: initialData?.neck || '',
    inseam: initialData?.inseam || '',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      setFormData({
        name: '',
        phone: '',
        address: '',
        chest: '',
        waist: '',
        shoulder: '',
        sleeve: '',
        neck: '',
        inseam: '',
      });
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 4, backgroundColor: 'white' }}>
      <Typography variant="h5" sx={{ mb: 3, color: '#2C3E50' }}>
        {initialData ? 'Edit Customer' : 'Add New Customer'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Customer Name"
              value={formData.name}
              onChange={handleChange('name')}
              required
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange('phone')}
              required
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={formData.address}
              onChange={handleChange('address')}
              multiline
              rows={2}
              required
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#5D4037' }}>
              Measurements (in inches)
            </Typography>
          </Grid>

          <Grid item xs={6} md={4}>
            <TextField
              fullWidth
              label="Chest"
              value={formData.chest}
              onChange={handleChange('chest')}
              required
              type="number"
              inputProps={{ step: '0.1' }}
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField
              fullWidth
              label="Waist"
              value={formData.waist}
              onChange={handleChange('waist')}
              required
              type="number"
              inputProps={{ step: '0.1' }}
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField
              fullWidth
              label="Shoulder"
              value={formData.shoulder}
              onChange={handleChange('shoulder')}
              required
              type="number"
              inputProps={{ step: '0.1' }}
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField
              fullWidth
              label="Sleeve"
              value={formData.sleeve}
              onChange={handleChange('sleeve')}
              required
              type="number"
              inputProps={{ step: '0.1' }}
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField
              fullWidth
              label="Neck"
              value={formData.neck}
              onChange={handleChange('neck')}
              required
              type="number"
              inputProps={{ step: '0.1' }}
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField
              fullWidth
              label="Inseam"
              value={formData.inseam}
              onChange={handleChange('inseam')}
              required
              type="number"
              inputProps={{ step: '0.1' }}
              sx={{ backgroundColor: 'white' }}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#D4AF37',
                color: '#2C3E50',
                mr: 2,
                '&:hover': {
                  backgroundColor: '#C19F2D',
                },
              }}
            >
              {initialData ? 'Update Customer' : 'Add Customer'}
            </Button>
            {initialData && onCancel && (
              <Button
                variant="outlined"
                onClick={onCancel}
                sx={{
                  borderColor: '#2C3E50',
                  color: '#2C3E50',
                }}
              >
                Cancel
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
