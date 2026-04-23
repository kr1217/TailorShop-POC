'use client';
import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, CircularProgress, IconButton, TextField, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import { api } from '@/services/api';

interface CustomerListProps {
  onEdit: (customer: any) => void;
  onPrint?: (customer: any) => void;
  variant?: 'orders' | 'directory';
}

export default function CustomerList({ onEdit, onPrint, variant = 'orders' }: CustomerListProps) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['customers', paginationModel.page, paginationModel.pageSize, debouncedSearch],
    queryFn: () => api.getCustomers(paginationModel.page + 1, paginationModel.pageSize, debouncedSearch),
    placeholderData: (previousData) => previousData,
  });

  // Extract raw rows from paginated response
  const rows = useMemo(() => data?.data || [], [data]);
  const rowCount = data?.pagination?.total || 0;

  const deleteMutation = useMutation({
    mutationFn: api.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteMutation.mutate(id);
    }
  };

  // Server-side filtering is now used, so we can just use rows directly.

  const columns: GridColDef[] = variant === 'orders' ? [
    { field: 'name', headerName: 'Customer Name', flex: 1, minWidth: 160, valueGetter: (_value: any, row: any) => row.personalInfo?.name ?? '—' },
    { field: 'phone', headerName: 'Phone', width: 140, valueGetter: (_value: any, row: any) => row.personalInfo?.phone ?? '—' },
    { field: 'address', headerName: 'Address', flex: 1, minWidth: 180, valueGetter: (_value: any, row: any) => row.personalInfo?.address ?? '—' },
    { field: 'quantity', headerName: 'Qty', width: 70, valueGetter: (_value: any, row: any) => row.orderDetails?.quantity ?? 1 },
    { 
      field: 'items', 
      headerName: 'Colors', 
      width: 120, 
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', height: '100%' }}>
          {params.row.orderDetails?.items?.map((item: any, idx: number) => (
            <Box 
              key={idx} 
              sx={{ 
                width: 20, 
                height: 20, 
                borderRadius: '50%', 
                bgcolor: item.colorCode || '#ccc',
                border: '2px solid #fff',
                boxShadow: '0 0 0 1px #ddd'
              }} 
            />
          ))}
          {(!params.row.orderDetails?.items || params.row.orderDetails.items.length === 0) && '-'}
        </Box>
      )
    },
    { 
      field: 'price', 
      headerName: 'Total Price', 
      width: 110, 
      valueGetter: (_value: any, row: any) => `Rs. ${row.orderDetails?.totalPrice || 0}`
    },
    // Individual measurement columns with Urdu translations
    {
      field: 'm_length',
      width: 90,
      sortable: false,
      renderHeader: () => (
        <Box sx={{ lineHeight: 1.3, textAlign: 'center' }}>
          <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#546E7A', textTransform: 'uppercase' }}>Length</Box>
          <Box sx={{ fontSize: '0.65rem', color: '#C29B0B', fontFamily: 'Noto Nastaliq Urdu, sans-serif' }}>لمبائی</Box>
        </Box>
      ),
      valueGetter: (_value: any, row: any) => row.measurements?.male?.length ? `${row.measurements.male.length}"` : '—',
    },
    {
      field: 'm_shoulder',
      width: 90,
      sortable: false,
      renderHeader: () => (
        <Box sx={{ lineHeight: 1.3, textAlign: 'center' }}>
          <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#546E7A', textTransform: 'uppercase' }}>Shoulder</Box>
          <Box sx={{ fontSize: '0.65rem', color: '#C29B0B', fontFamily: 'Noto Nastaliq Urdu, sans-serif' }}>تیرا</Box>
        </Box>
      ),
      valueGetter: (_value: any, row: any) => row.measurements?.male?.shoulder ? `${row.measurements.male.shoulder}"` : '—',
    },
    {
      field: 'm_sleeve',
      width: 85,
      sortable: false,
      renderHeader: () => (
        <Box sx={{ lineHeight: 1.3, textAlign: 'center' }}>
          <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#546E7A', textTransform: 'uppercase' }}>Sleeve</Box>
          <Box sx={{ fontSize: '0.65rem', color: '#C29B0B', fontFamily: 'Noto Nastaliq Urdu, sans-serif' }}>بازو</Box>
        </Box>
      ),
      valueGetter: (_value: any, row: any) => row.measurements?.male?.sleeve ? `${row.measurements.male.sleeve}"` : '—',
    },
    {
      field: 'm_chest',
      width: 80,
      sortable: false,
      renderHeader: () => (
        <Box sx={{ lineHeight: 1.3, textAlign: 'center' }}>
          <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#546E7A', textTransform: 'uppercase' }}>Chest</Box>
          <Box sx={{ fontSize: '0.65rem', color: '#C29B0B', fontFamily: 'Noto Nastaliq Urdu, sans-serif' }}>چھاتی</Box>
        </Box>
      ),
      valueGetter: (_value: any, row: any) => row.measurements?.male?.chest ? `${row.measurements.male.chest}"` : '—',
    },
    {
      field: 'm_waist',
      width: 80,
      sortable: false,
      renderHeader: () => (
        <Box sx={{ lineHeight: 1.3, textAlign: 'center' }}>
          <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#546E7A', textTransform: 'uppercase' }}>Waist</Box>
          <Box sx={{ fontSize: '0.65rem', color: '#C29B0B', fontFamily: 'Noto Nastaliq Urdu, sans-serif' }}>کمر</Box>
        </Box>
      ),
      valueGetter: (_value: any, row: any) => row.measurements?.male?.waist ? `${row.measurements.male.waist}"` : '—',
    },
    {
      field: 'm_neck',
      width: 75,
      sortable: false,
      renderHeader: () => (
        <Box sx={{ lineHeight: 1.3, textAlign: 'center' }}>
          <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#546E7A', textTransform: 'uppercase' }}>Neck</Box>
          <Box sx={{ fontSize: '0.65rem', color: '#C29B0B', fontFamily: 'Noto Nastaliq Urdu, sans-serif' }}>گلا</Box>
        </Box>
      ),
      valueGetter: (_value: any, row: any) => row.measurements?.male?.neck ? `${row.measurements.male.neck}"` : '—',
    },
    {
      field: 'm_daman',
      width: 85,
      sortable: false,
      renderHeader: () => (
        <Box sx={{ lineHeight: 1.3, textAlign: 'center' }}>
          <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#546E7A', textTransform: 'uppercase' }}>Daman</Box>
          <Box sx={{ fontSize: '0.65rem', color: '#C29B0B', fontFamily: 'Noto Nastaliq Urdu, sans-serif' }}>گھیرا</Box>
        </Box>
      ),
      valueGetter: (_value: any, row: any) => row.measurements?.male?.daman ? `${row.measurements.male.daman}"` : '—',
    },
    {
      field: 'm_shalwar',
      width: 95,
      sortable: false,
      renderHeader: () => (
        <Box sx={{ lineHeight: 1.3, textAlign: 'center' }}>
          <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#546E7A', textTransform: 'uppercase' }}>Shalwar</Box>
          <Box sx={{ fontSize: '0.65rem', color: '#C29B0B', fontFamily: 'Noto Nastaliq Urdu, sans-serif' }}>شلوار</Box>
        </Box>
      ),
      valueGetter: (_value: any, row: any) => row.measurements?.male?.shalwarLength ? `${row.measurements.male.shalwarLength}"` : '—',
    },
    {
      field: 'm_pancha',
      width: 80,
      sortable: false,
      renderHeader: () => (
        <Box sx={{ lineHeight: 1.3, textAlign: 'center' }}>
          <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#546E7A', textTransform: 'uppercase' }}>Pancha</Box>
          <Box sx={{ fontSize: '0.65rem', color: '#C29B0B', fontFamily: 'Noto Nastaliq Urdu, sans-serif' }}>پانچہ</Box>
        </Box>
      ),
      valueGetter: (_value: any, row: any) => row.measurements?.male?.pancha ? `${row.measurements.male.pancha}"` : '—',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', height: '100%' }}>
          <IconButton onClick={() => onEdit(params.row)} sx={{ color: '#2C3E50' }} size="small" title="Edit Order">
            <EditIcon fontSize="small" />
          </IconButton>
          {onPrint && (
            <IconButton onClick={() => onPrint(params.row)} sx={{ color: '#C29B0B' }} size="small" title="Print Receipt">
              <PrintIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton onClick={() => handleDelete(params.row.id)} sx={{ color: '#c0392b' }} size="small" title="Delete Order">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ] : [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 200, valueGetter: (_value: any, row: any) => row.personalInfo?.name ?? '—' },
    { field: 'phone', headerName: 'Phone Number', width: 180, valueGetter: (_value: any, row: any) => row.personalInfo?.phone ?? '—' },
    { field: 'address', headerName: 'Address', flex: 2, minWidth: 280, valueGetter: (_value: any, row: any) => row.personalInfo?.address ?? '—' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
          <IconButton onClick={() => onEdit(params.row)} sx={{ color: '#2C3E50' }} size="small" title="Edit Personal Info">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} sx={{ color: '#c0392b' }} size="small" title="Delete Customer">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (isLoading && !isPlaceholderData) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#fff', p: 3, borderRadius: 1, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#34495E', fontWeight: 600 }}>
          {variant === 'orders' ? 'Recent Orders' : 'Customer Directory'}
        </Typography>
        <TextField
          size="small"
          placeholder="Search name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: '#90A4AE' }} />
                </InputAdornment>
              ),
            }
          }}
          sx={{ width: 300 }}
        />
      </Box>
      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          paginationMode="server"
          rowCount={rowCount}
          loading={isLoading}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          autoHeight
          slots={{
            noRowsOverlay: () => (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 1, color: '#90A4AE', py: 6 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>No customers found</Typography>
                <Typography variant="body2">Add a new customer via the Registration page.</Typography>
              </Box>
            ),
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
            '& .MuiDataGrid-columnHeader:focus': { outline: 'none' },
            '& .MuiDataGrid-columnHeader': {
              bgcolor: '#F8F9FA',
              color: '#546E7A',
              fontWeight: 700,
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: 1,
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: 'rgba(44,62,80,0.03)',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #F0F0F0',
              color: '#37474F',
            },
          }}
        />
      </Box>
    </Box>
  );
}
