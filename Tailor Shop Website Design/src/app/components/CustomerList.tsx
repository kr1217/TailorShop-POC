import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Edit, Delete, Search } from '@mui/icons-material';
import { Customer } from './CustomerForm';

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export function CustomerList({ customers, onEdit, onDelete }: CustomerListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (id: string) => {
    setCustomerToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (customerToDelete) {
      onDelete(customerToDelete);
    }
    setDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, backgroundColor: 'white' }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ color: '#2C3E50' }}>
          Customer List
        </Typography>
        <TextField
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: '300px',
            backgroundColor: 'white',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#2C3E50',
              },
            },
          }}
          slotProps={{
            input: {
              startAdornment: <Search sx={{ mr: 1, color: '#5D4037' }} />,
            },
          }}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#2C3E50' }}>
              <TableCell sx={{ color: 'white' }}>Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Phone</TableCell>
              <TableCell sx={{ color: 'white' }}>Address</TableCell>
              <TableCell sx={{ color: 'white' }}>Chest</TableCell>
              <TableCell sx={{ color: 'white' }}>Waist</TableCell>
              <TableCell sx={{ color: 'white' }}>Shoulder</TableCell>
              <TableCell sx={{ color: 'white' }}>Sleeve</TableCell>
              <TableCell sx={{ color: 'white' }}>Neck</TableCell>
              <TableCell sx={{ color: 'white' }}>Inseam</TableCell>
              <TableCell sx={{ color: 'white' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <Typography color="textSecondary">
                    {searchTerm ? 'No customers found matching your search.' : 'No customers yet. Add your first customer above!'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow
                  key={customer.id}
                  sx={{
                    '&:hover': { backgroundColor: '#F9F9F9' },
                  }}
                >
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>{customer.chest}"</TableCell>
                  <TableCell>{customer.waist}"</TableCell>
                  <TableCell>{customer.shoulder}"</TableCell>
                  <TableCell>{customer.sleeve}"</TableCell>
                  <TableCell>{customer.neck}"</TableCell>
                  <TableCell>{customer.inseam}"</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => onEdit(customer)}
                      sx={{
                        color: '#D4AF37',
                        '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.1)' },
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(customer.id)}
                      sx={{
                        color: '#C0392B',
                        '&:hover': { backgroundColor: 'rgba(192, 57, 43, 0.1)' },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ color: '#2C3E50' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this customer? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#2C3E50' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            sx={{
              backgroundColor: '#C0392B',
              color: 'white',
              '&:hover': { backgroundColor: '#A03025' },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
