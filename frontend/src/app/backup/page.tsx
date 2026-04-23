'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MainLayout from '@/components/MainLayout';
import { 
  Box, Typography, Paper, Button, CircularProgress, Alert, 
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Grid, Divider
} from '@mui/material';
import {
  CloudUpload,
  Storage,
  CalendarToday,
  Description
} from '@mui/icons-material';
import { api } from '@/services/api';

export default function BackupPage() {
  const queryClient = useQueryClient();
  const { data: backupInfo, isLoading } = useQuery({
    queryKey: ['backup-info'],
    queryFn: api.getBackupInfo
  });

  const [backupLoading, setBackupLoading] = useState(false);
  const [backupStatus, setBackupStatus] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleManualBackup = async (force = false) => {
    setBackupLoading(true);
    setBackupStatus(null);
    setConfirmOpen(false);
    
    try {
      const response = await api.manualBackup(force);
      
      if (response.status === 'no_change' && !force) {
        setConfirmOpen(true);
        setBackupLoading(false);
        return;
      }

      setBackupStatus({ type: 'success', message: response.message });
      // Invalidate the query to fetch the latest backup info
      queryClient.invalidateQueries({ queryKey: ['backup-info'] });
    } catch (err: any) {
      setBackupStatus({ type: 'error', message: err.response?.data?.error || 'Failed to start backup.' });
    } finally {
      setBackupLoading(false);
      setTimeout(() => setBackupStatus(prev => prev?.type === 'error' ? prev : null), 5000);
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return 'Unknown';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No backups yet';
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (isLoading) {
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#2C3E50', mb: 1 }}>
          System <Typography component="span" variant="h4" sx={{ color: '#C29B0B', fontWeight: 400 }}>| Backup</Typography>
        </Typography>
        <Typography variant="body1" sx={{ color: '#607D8B' }}>
          Manage your data backups and view historical backup information.
        </Typography>
      </Box>

      {backupStatus && (
        <Alert 
          severity={backupStatus.type} 
          sx={{ mb: 4, borderRadius: 2 }}
          onClose={() => setBackupStatus(null)}
        >
          {backupStatus.message}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid rgba(44,62,80,0.1)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2C3E50' }}>
                Latest Backup Information
              </Typography>
              <Button
                variant="contained"
                startIcon={backupLoading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
                onClick={() => handleManualBackup()}
                disabled={backupLoading}
                sx={{
                  bgcolor: '#2C3E50',
                  color: 'white',
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                  '&:hover': { bgcolor: '#34495E' }
                }}
              >
                {backupLoading ? 'Backing up...' : 'Trigger Manual Backup'}
              </Button>
            </Box>
            
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <CalendarToday sx={{ color: '#C29B0B', mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#607D8B', fontWeight: 600, textTransform: 'uppercase' }}>
                      Date & Time
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', fontWeight: 700, mt: 0.5 }}>
                      {formatDate(backupInfo?.lastBackupAt)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Storage sx={{ color: '#C29B0B', mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#607D8B', fontWeight: 600, textTransform: 'uppercase' }}>
                      File Size
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', fontWeight: 700, mt: 0.5 }}>
                      {formatSize(backupInfo?.lastBackupSize)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Description sx={{ color: '#C29B0B', mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#607D8B', fontWeight: 600, textTransform: 'uppercase' }}>
                      File Name
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#2C3E50', fontWeight: 700, mt: 0.5, wordBreak: 'break-all' }}>
                      {backupInfo?.lastBackupName || 'Unknown'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid rgba(44,62,80,0.1)', height: '100%', bgcolor: 'rgba(194, 155, 11, 0.05)' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#2C3E50', mb: 2 }}>
              Automated Backups
            </Typography>
            <Typography variant="body2" sx={{ color: '#2C3E50', mb: 2, lineHeight: 1.6 }}>
              The system is configured to automatically backup your database to Google Drive <strong>every Sunday at 12:00 PM</strong>.
            </Typography>
            <Typography variant="body2" sx={{ color: '#2C3E50', lineHeight: 1.6 }}>
              If no changes have been made to the database since the last backup, the automated system will skip uploading to save storage space.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#2C3E50' }}>
          Latest Version Already Backed Up
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            The latest version of the database is already backed up. Are you sure you want to backup your data anyway?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#F8F9FA' }}>
          <Button 
            onClick={() => {
              setConfirmOpen(false);
              setBackupStatus({ type: 'info', message: 'Backup was cancelled.' });
              setTimeout(() => setBackupStatus(null), 3000);
            }} 
            variant="outlined" 
            sx={{ color: '#2C3E50', borderColor: '#2C3E50' }}
          >
            No, Cancel
          </Button>
          <Button 
            onClick={() => handleManualBackup(true)} 
            variant="contained" 
            autoFocus
            sx={{ bgcolor: '#C29B0B', color: '#2C3E50', fontWeight: 800, '&:hover': { bgcolor: '#b08b0a' } }}
          >
            Yes, Backup Anyway
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}
