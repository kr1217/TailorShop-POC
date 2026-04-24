'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  CssBaseline,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People,
  AppRegistration,
  Settings,
  Menu as MenuIcon,
  Logout,
  ContentCut,
  Assignment as AssignmentIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import ErrorBoundary from './ErrorBoundary';

const drawerWidth = 260;

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const prefetchData = (path: string) => {
    if (path === '/orders' || path === '/directory') {
      queryClient.prefetchQuery({
        queryKey: ['customers', 0, 10, ''],
        queryFn: () => api.getCustomers(1, 10)
      });
    }
  };

  const { data: userData } = useQuery({
    queryKey: ['user-profile'],
    queryFn: api.getMe,
    enabled: mounted
  });

  useEffect(() => {
    setMounted(true);
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    router.push('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'New Registration', icon: <AppRegistration />, path: '/customers' },
    { text: 'Order Management', icon: <AssignmentIcon />, path: '/orders' },
    { text: 'Customer Directory', icon: <People />, path: '/directory' }, 
    { text: 'System Backup', icon: <CloudUploadIcon />, path: '/backup' },
    { text: 'Settings', icon: <Settings />, path: '#' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#FFFFFF' }}>
      <Toolbar
        sx={{
          backgroundColor: '#2C3E50',
          color: 'white',
          display: 'flex',
          gap: 1,
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <ContentCut sx={{ color: '#C29B0B' }} />
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5, color: 'white' }}>Al-Riaz Tailors</Typography>
      </Toolbar>
      <List sx={{ flexGrow: 1, p: 2 }}>
        {menuItems.map((item, index) => (
          <ListItem key={item.text + index} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={pathname === item.path}
              onMouseEnter={() => prefetchData(item.path)}
              onClick={() => {
                router.push(item.path);
                setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(44, 62, 80, 0.08)',
                  '& .MuiListItemIcon-root': { color: '#2C3E50' },
                  '& .MuiListItemText-primary': { color: '#2C3E50', fontWeight: 700 },
                  '&:hover': { backgroundColor: 'rgba(44, 62, 80, 0.12)' },
                },
              }}
            >
              <ListItemIcon sx={{ color: '#607D8B', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                slotProps={{ primary: { variant: 'body2', fontWeight: 500 } as any }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(211, 47, 47, 0.05)',
              '& .MuiListItemIcon-root, & .MuiListItemText-primary': { color: '#d32f2f' }
            },
          }}
        >
          <ListItemIcon sx={{ color: '#607D8B', minWidth: 40 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Sign Out" slotProps={{ primary: { variant: 'body2', fontWeight: 600 } as any }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  if (!mounted) return null;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F5F5DC' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid rgba(44,62,80,0.1)',
          color: '#2C3E50'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800 }}>
              Workshop Console
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#607D8B', fontWeight: 600 }}>
              Assalam-o-Alaikum, <Typography component="span" variant="body2" sx={{ color: '#C29B0B', fontWeight: 800 }}>{userData?.username || 'Admin'}</Typography>
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(44,62,80,0.1)' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(44,62,80,0.1)' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#F5F5DC',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </Container>
      </Box>
    </Box>
  );
}
