'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Box, Typography, Paper, CircularProgress, Alert, Container } from '@mui/material';
import { Lock, Person, ContentCut, ArrowBack } from '@mui/icons-material';
import { api } from '@/services/api';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await api.resetCredentials({ username, password });
      if (response.success) {
        setSuccess('Credentials updated successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5DC', // Cream Latha finish
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Accent bar */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, backgroundColor: '#C29B0B' }} />
          
          <Box sx={{ mb: 4 }}>
            <Link href="/login" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', color: '#607D8B', gap: 0.5, marginBottom: '1.5rem' }}>
              <ArrowBack fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Back to Login</Typography>
            </Link>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
              <ContentCut sx={{ color: '#2C3E50', fontSize: 28 }} />
              <Typography variant="h5" sx={{ color: '#2C3E50', fontWeight: 800 }}>
                Reset Credentials
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#607D8B' }}>
              Update your administrative username and password.
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

          <form onSubmit={handleReset}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="New Username / نیا صارف نام"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter new username"
                slotProps={{
                  input: {
                    startAdornment: <Person sx={{ mr: 1, color: '#2C3E50', opacity: 0.7 }} />,
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                type="password"
                label="New Password / نیا پاس ورڈ"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter new password"
                slotProps={{
                  input: {
                    startAdornment: <Lock sx={{ mr: 1, color: '#2C3E50', opacity: 0.7 }} />,
                  },
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 2,
                backgroundColor: '#2C3E50',
                '&:hover': { backgroundColor: '#1a252f' },
                fontWeight: 700,
                fontSize: '1.1rem',
                borderRadius: 2
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'SAVE CHANGES (محفوظ کریں)'}
            </Button>
          </form>

          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#607D8B' }}>
              Secured Workshop Management Console
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
