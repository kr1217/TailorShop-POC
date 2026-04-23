import React, { useState } from 'react';
import { FormInputs } from '@/types/customer';
import { Control, Controller } from 'react-hook-form';
import { Typography, TextField, Tabs, Tab, Box, Grid } from '@mui/material';

interface MeasurementSectionProps {
  control: Control<FormInputs>;
}

export default function MeasurementSection({ control }: MeasurementSectionProps) {
  const [tab, setTab] = useState(0);

  return (
    <Grid size={{ xs: 12 }}>
      <Typography variant="h5" sx={{ mt: 2, mb: 1, color: '#8B4513', fontWeight: 500 }}>
        Measurements (in inches)
      </Typography>
      <Tabs 
        value={tab} 
        onChange={(_, v) => setTab(v)}
        indicatorColor="primary"
        textColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="Mardana (Men's)" />
        {/* <Tab label="Zanana (Women's)" disabled /> */}
      </Tabs>

      {tab === 0 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ color: '#2C3E50', fontSize: '1.1rem', borderBottom: 2, borderColor: '#C29B0B', pb: 1, mb: 2 }}>
              Mardana Measurements (Inches)
            </Typography>
          </Grid>
          
          {[
            { id: 'length', label: 'Length / لمبائی' },
            { id: 'shoulder', label: 'Shoulder / تیرا' },
            { id: 'sleeve', label: 'Sleeve / بازو' },
            { id: 'chest', label: 'Chest / چھاتی' },
            { id: 'waist', label: 'Waist / کمر' },
            { id: 'neck', label: 'Neck / ہالا/گلا' },
            { id: 'daman', label: 'Daman / گھیرا' },
            { id: 'shalwarLength', label: 'Shalwar Length / شلوار لمبائی' },
            { id: 'pancha', label: 'Ankle (Pancha) / پانچہ' },
          ].map((field) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`male-${field.id}`}>
              <Controller
                name={`measurements.male.${field.id}` as any}
                control={control}
                render={({ field: inputField }) => (
                  <TextField 
                    {...inputField} 
                    value={inputField.value ?? ''} 
                    fullWidth 
                    label={field.label}
                    placeholder="00.0"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
          ))}

          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ color: '#2C3E50', fontSize: '1rem', mt: 3, mb: 2, bgcolor: 'rgba(44,62,80,0.05)', p: 1, borderRadius: 1 }}>
              Additional Specifications (Zaroori Tafseelaat)
            </Typography>
          </Grid>

          {[
            { id: 'collarType', label: 'Collar Style / گلا', options: ['Kollar', 'Ban', 'Gala'] },
            { id: 'pocketStyle', label: 'Pocket Style / جیب', options: ['Side Jieb', 'Front Jieb', 'Both', 'None'] },
            { id: 'cuffStyle', label: 'Cuff Style / بازو پٹی', options: ['Cuff (Button)', 'Gol Bazu (Open)', 'Elastic'] },
            { id: 'damanStyle', label: 'Daman Style / گھیرا', options: ['Gol (Round)', 'Chauras (Square)'] },
            { id: 'shalwarType', label: 'Shalwar Type / شلوار', options: ['Shalwar', 'Pajama', 'Trouser'] },
          ].map((spec) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`male-extra-${spec.id}`}>
              <Controller
                name={`measurements.male.extra.${spec.id}` as any}
                control={control}
                render={({ field: selectField }) => (
                  <TextField
                    {...selectField}
                    select
                    fullWidth
                    label={spec.label}
                    slotProps={{ select: { native: true } }}
                    value={selectField.value ?? spec.options?.[0]}
                  >
                    {spec.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Grid>
  );
}
