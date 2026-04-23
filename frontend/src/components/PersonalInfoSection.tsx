import React from 'react';
import { FormInputs } from '@/types/customer';
import { Control, Controller } from 'react-hook-form';
import { Typography, TextField, CircularProgress, InputAdornment, Grid } from '@mui/material';

interface PersonalInfoSectionProps {
  control: Control<FormInputs>;
  isSearching: boolean;
}

export default function PersonalInfoSection({ control, isSearching }: PersonalInfoSectionProps) {
  return (
    <>
      <Grid size={{ xs: 12, md: 4 }}>
        <Controller
          name="personalInfo.name"
          control={control}
          rules={{ required: 'Name is required' }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              value={field.value ?? ''}
              fullWidth
              label="Customer Name *"
              error={!!fieldState.error}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Controller
          name="personalInfo.phone"
          control={control}
          rules={{ required: 'Phone is required for searching' }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              value={field.value ?? ''}
              fullWidth
              label="Phone Number *"
              error={!!fieldState.error}
              slotProps={{
                input: {
                  endAdornment: isSearching ? <InputAdornment position="end"><CircularProgress size={20} /></InputAdornment> : null,
                },
              }}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Controller
          name="personalInfo.address"
          control={control}
          render={({ field, fieldState }) => (
            <TextField 
              {...field} 
              value={field.value ?? ''} 
              fullWidth 
              label="Address" 
              error={!!fieldState.error}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="personalInfo.referralBy"
          control={control}
          render={({ field }) => (
            <TextField {...field} value={field.value ?? ''} fullWidth label="Referred By (Optional)" />
          )}
        />
      </Grid>
    </>
  );
}
