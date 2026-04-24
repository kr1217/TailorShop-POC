'use client';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/MainLayout';
import { 
  Grid, Paper, Typography, Box, Alert, AlertTitle, 
  Stack, Button, CircularProgress, Divider, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import {
  People,
  ShoppingBag,
  AttachMoney,
  Pending,
  Warning,
  Schedule,
  CheckCircle,
  AccountBalanceWallet
} from '@mui/icons-material';
import { useState } from 'react';
import { api } from '@/services/api';

interface MetricCardProps {
  title: string;
  urduTitle: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

function MetricCard({ title, urduTitle, value, icon, color, subtitle }: MetricCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(44,62,80,0.1)',
        borderRadius: 3,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(44,62,80,0.08)',
          borderColor: color,
        },
      }}
    >
      <Box sx={{ 
        position: 'absolute', top: -10, right: -10, opacity: 0.1, 
        fontSize: '90px', color: color 
      }}>
        {icon}
      </Box>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="body2" sx={{ color: '#607D8B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ color: color, fontWeight: 700, fontFamily: 'Noto Nastaliq Urdu, sans-serif' }}>
            {urduTitle}
          </Typography>
        </Box>
        <Typography variant="h3" sx={{ color: '#2C3E50', fontWeight: 800, mb: subtitle ? 1 : 0 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: color, fontWeight: 600, mt: 1 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: api.getStats
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['dashboard-alerts'],
    queryFn: api.getAlerts
  });

  const { data: userData } = useQuery({
    queryKey: ['user-profile'],
    queryFn: api.getMe
  });

  if (statsLoading || alertsLoading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress color="primary" sx={{ color: '#2C3E50' }} />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#2C3E50' }}>
            Shop Management <Typography component="span" variant="h4" sx={{ color: '#C29B0B', fontWeight: 400 }}>| Dashboard</Typography>
          </Typography>
          <Typography variant="body1" sx={{ color: '#607D8B' }}>
            Welcome back, {userData?.username || 'Admin'}. Here is the status of your workshop today.
          </Typography>
        </Box>
      </Box>

      {/* Notification Center (Alert Hierarchy) */}
      <Stack spacing={2} sx={{ mb: 4 }}>
        {alerts?.urgent?.length > 0 && (
          <Alert 
            severity="error" 
            variant="filled"
            action={<Button color="inherit" size="small" onClick={() => window.location.href='/orders'}>VIEW ORDERS</Button>}
            sx={{ borderRadius: 2, bgcolor: '#c0392b' }}
          >
            <AlertTitle sx={{ fontWeight: 700 }}>CRITICAL: {alerts.urgent.length} Orders Overdue!</AlertTitle>
            {alerts.urgent.map((a: any) => a.personalInfo.name).join(', ')} were due before today.
          </Alert>
        )}
        {alerts?.warning?.length > 0 && (
          <Alert severity="warning" variant="outlined" sx={{ borderRadius: 2, borderWidth: 2, borderColor: '#C29B0B', color: '#2C3E50' }}>
            <AlertTitle sx={{ fontWeight: 700 }}>Upcoming Deadlines</AlertTitle>
            You have {alerts.warning.length} items to deliver by tomorrow.
          </Alert>
        )}
      </Stack>

      {/* Stats Grid */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <MetricCard
            title="Total Customers"
            urduTitle="کل کسٹمرز"
            value={stats?.totalCustomers || 0}
            icon={<People sx={{ fontSize: 'inherit' }} />}
            color="#2C3E50"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <MetricCard
            title="Revenue Collected"
            urduTitle="کل آمدنی"
            value={`Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`}
            icon={<AccountBalanceWallet sx={{ fontSize: 'inherit' }} />}
            color="#C29B0B"
            subtitle="Total earnings to date"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <MetricCard
            title="Active Jobs"
            urduTitle="جاری آرڈرز"
            value={stats?.activeOrders || 0}
            icon={<Pending sx={{ fontSize: 'inherit' }} />}
            color="#2C3E50"
            subtitle="In production"
          />
        </Grid>
      </Grid>

      {/* Footer Branding */}
      <Box sx={{ mt: 10, textAlign: 'center', opacity: 0.5 }}>
        <Typography variant="caption" sx={{ color: '#2C3E50', fontWeight: 600, letterSpacing: 1 }}>
          AL-RIAZ TAILORS | MANAGEMENT CONSOLE
        </Typography>
      </Box>
    </MainLayout>
  );
}
