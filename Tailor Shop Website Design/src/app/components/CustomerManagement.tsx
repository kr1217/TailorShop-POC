import { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { CustomerForm, Customer } from './CustomerForm';
import { CustomerList } from './CustomerList';

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    phone: '+1 234-567-8901',
    address: '123 Main Street, New York, NY 10001',
    chest: '42',
    waist: '34',
    shoulder: '18',
    sleeve: '34',
    neck: '16',
    inseam: '32',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    phone: '+1 234-567-8902',
    address: '456 Oak Avenue, Brooklyn, NY 11201',
    chest: '36',
    waist: '28',
    shoulder: '15',
    sleeve: '32',
    neck: '14',
    inseam: '30',
  },
];

export function CustomerManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const handleAddCustomer = (customerData: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
    };
    setCustomers([...customers, newCustomer]);
    setActiveTab(1);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setActiveTab(0);
  };

  const handleUpdateCustomer = (customerData: Omit<Customer, 'id'>) => {
    if (editingCustomer) {
      setCustomers(
        customers.map((c) =>
          c.id === editingCustomer.id ? { ...customerData, id: editingCustomer.id } : c
        )
      );
      setEditingCustomer(null);
      setActiveTab(1);
    }
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter((c) => c.id !== id));
  };

  const handleCancelEdit = () => {
    setEditingCustomer(null);
  };

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => {
          setActiveTab(newValue);
          if (newValue === 0) {
            setEditingCustomer(null);
          }
        }}
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            color: '#5D4037',
          },
          '& .Mui-selected': {
            color: '#2C3E50 !important',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#D4AF37',
          },
        }}
      >
        <Tab label="Add Customer" />
        <Tab label="Customer List" />
      </Tabs>

      {activeTab === 0 && (
        <CustomerForm
          onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer}
          initialData={editingCustomer || undefined}
          onCancel={editingCustomer ? handleCancelEdit : undefined}
        />
      )}
      {activeTab === 1 && (
        <CustomerList
          customers={customers}
          onEdit={handleEditCustomer}
          onDelete={handleDeleteCustomer}
        />
      )}
    </Box>
  );
}
