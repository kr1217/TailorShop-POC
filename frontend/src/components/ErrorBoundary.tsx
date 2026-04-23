'use client';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid #FFCDD2', borderRadius: 3, maxWidth: 500 }}>
            <WarningIcon sx={{ fontSize: 60, color: '#d32f2f', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#2C3E50' }}>Something went wrong</Typography>
            <Typography variant="body2" sx={{ color: '#607D8B', mb: 4 }}>
              The application encountered an unexpected error. This has been logged, but please try refreshing the page.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => window.location.reload()}
              sx={{ bgcolor: '#2C3E50', '&:hover': { bgcolor: '#1a252f' } }}
            >
              Refresh Page
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
