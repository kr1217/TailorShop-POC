'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TextField, Button, Box, Typography, Paper, CircularProgress, Checkbox, FormControlLabel, Alert } from '@mui/material';
import { Lock, Person, ContentCut, Straighten } from '@mui/icons-material';
import { api } from '@/services/api';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.login({ username, password });
      if (response.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', response.token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: '#F5F5DC', // Cream Latha finish
      }}
    >
      {/* Left Side - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          backgroundColor: 'white',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: '450px',
            p: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            <ContentCut sx={{ color: '#2C3E50', fontSize: 32 }} />
            <Typography variant="h4" sx={{ color: '#2C3E50', fontWeight: 800 }}>
              Al-Riaz Tailors
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 4, color: '#607D8B' }}>
            Welcome back to your workshop management system.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Username / نام"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                slotProps={{
                  input: {
                    startAdornment: <Person sx={{ mr: 1, color: '#2C3E50', opacity: 0.7 }} />,
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                type="password"
                label="Password / پاس ورڈ"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                slotProps={{
                  input: {
                    startAdornment: <Lock sx={{ mr: 1, color: '#2C3E50', opacity: 0.7 }} />,
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel 
                control={<Checkbox sx={{ color: '#2C3E50', '&.Mui-checked': { color: '#2C3E50' } }} />} 
                label={<Typography variant="body2">Remember Me</Typography>} 
              />
              <Link href="/reset-password" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: '#2C3E50', fontWeight: 600, cursor: 'pointer', '&:hover': { color: '#C29B0B' } }}>
                  Forgot?
                </Typography>
              </Link>
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
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'LOGIN (لاگ ان)'}
            </Button>
          </form>

          <Typography variant="caption" sx={{ mt: 3, display: 'block', textAlign: 'center', color: '#607D8B' }}>
            Powered by CraftMS v1.0
          </Typography>
        </Paper>
      </Box>

      {/* Right Side - Branding Area */}
      <Box
        sx={{
          flex: 1.2,
          backgroundColor: '#2C3E50',
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(135deg, #2C3E50 0%, #1a252f 100%)',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Box sx={{ mb: 4, display: 'inline-flex', p: 3, borderRadius: '50%', border: '4px solid #C29B0B' }}>
            <Straighten sx={{ color: '#C29B0B', fontSize: 80, transform: 'rotate(-45deg)' }} />
          </Box>
          <Typography variant="h2" sx={{ color: 'white', fontWeight: 900, mb: 1, letterSpacing: -1 }}>
            CRAFTED WITH PRECISION
          </Typography>
          <Typography variant="h5" sx={{ color: '#C29B0B', fontWeight: 500, fontStyle: 'italic' }}>
            Pakistan's Premium Tailoring Suite
          </Typography>
        </Box>

        {/* Decorative elements */}
        <Box sx={{ position: 'absolute', top: '10%', right: '5%', opacity: 0.1 }}>
          <ContentCut sx={{ fontSize: 300, color: '#C29B0B', transform: 'rotate(15deg)' }} />
        </Box>
      </Box>
    </Box>
  );
}
