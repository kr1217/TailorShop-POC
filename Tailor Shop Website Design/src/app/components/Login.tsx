import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { Lock, Person } from '@mui/icons-material';

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: '#F9F9F9',
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
          <Typography
            variant="h4"
            sx={{
              mb: 1,
              color: '#2C3E50',
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: '#5D4037',
            }}
          >
            Login to manage your tailor shop
          </Typography>

          <form onSubmit={handleLogin}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                slotProps={{
                  input: {
                    startAdornment: <Person sx={{ mr: 1, color: '#5D4037' }} />,
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#F9F9F9',
                    '&:hover fieldset': {
                      borderColor: '#D4AF37',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D4AF37',
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                slotProps={{
                  input: {
                    startAdornment: <Lock sx={{ mr: 1, color: '#5D4037' }} />,
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#F9F9F9',
                    '&:hover fieldset': {
                      borderColor: '#D4AF37',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D4AF37',
                    },
                  },
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: '#D4AF37',
                color: '#2C3E50',
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#C19F2D',
                },
              }}
            >
              LOGIN
            </Button>
          </form>

          <Typography
            sx={{
              mt: 3,
              textAlign: 'center',
              color: '#5D4037',
            }}
          >
            Demo credentials: Any username/password
          </Typography>
        </Paper>
      </Box>

      {/* Right Side - Image/Illustration Area */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: '#2C3E50',
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              mb: 2,
            }}
          >
            Tailor Shop
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: '#D4AF37',
              mb: 4,
            }}
          >
            Crafting Excellence
          </Typography>
          <Box
            sx={{
              width: '400px',
              height: '400px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="300"
              height="300"
              viewBox="0 0 300 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="150" cy="150" r="100" fill="#D4AF37" opacity="0.2" />
              <path
                d="M150 80 L180 120 L150 110 L120 120 Z"
                fill="#D4AF37"
              />
              <rect x="130" y="115" width="40" height="80" fill="white" opacity="0.9" />
              <path
                d="M110 140 L110 180 L130 175 L130 145 Z"
                fill="#D4AF37"
              />
              <path
                d="M190 140 L190 180 L170 175 L170 145 Z"
                fill="#D4AF37"
              />
              <circle cx="150" cy="230" r="15" fill="white" opacity="0.8" />
              <line x1="150" y1="195" x2="150" y2="215" stroke="white" strokeWidth="3" opacity="0.8" />
            </svg>
          </Box>
        </Box>

        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: '#D4AF37',
            opacity: 0.1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            backgroundColor: '#5D4037',
            opacity: 0.1,
          }}
        />
      </Box>
    </Box>
  );
}
