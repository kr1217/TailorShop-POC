import React from 'react';
import { FormInputs } from '@/types/customer';
import { Control, Controller, UseFieldArrayAppend, UseFieldArrayRemove } from 'react-hook-form';
import { Typography, TextField, Box, IconButton, Divider, Stack, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface OrderDetailsSectionProps {
  control: Control<FormInputs>;
  itemFields: any[];
  append: UseFieldArrayAppend<FormInputs, "orderDetails.items">;
  remove: UseFieldArrayRemove;
}

export default function OrderDetailsSection({ control, itemFields, append, remove }: OrderDetailsSectionProps) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h5" sx={{ mt: 2, mb: 1, color: '#34495E', fontWeight: 600 }}>
          Order Details
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Controller
          name="orderDetails.quantity"
          control={control}
          render={({ field }) => (
            <TextField 
              {...field} 
              value={field.value ?? 1} 
              type="number" 
              fullWidth 
              label="Number of Items" 
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                field.onChange(val);
                // Sync occurs in parent useEffect, or we can handle it here
              }}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Controller
          name="orderDetails.totalPrice"
          control={control}
          render={({ field }) => <TextField {...field} value={field.value ?? ''} fullWidth label="Total Price (Rs)" />}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Controller
          name="orderDetails.advancePayment"
          control={control}
          render={({ field }) => <TextField {...field} value={field.value ?? ''} fullWidth label="Advance Payment (پیشگی رقم)" />}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="orderDetails.dueDate"
          control={control}
          render={({ field }) => (
            <TextField {...field} value={field.value ?? ''} type="date" fullWidth label="Delivery / Due Date" slotProps={{ inputLabel: { shrink: true } }} />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="orderDetails.orderStatus"
          control={control}
          render={({ field }) => (
            <TextField {...field} select fullWidth label="Order Status" slotProps={{ select: { native: true } }}>
              {['Pending', 'In-Progress', 'Completed', 'Delivered'].map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </TextField>
          )}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" sx={{ color: '#607D8B', fontWeight: 700 }}>ITEM SPECIFICS (COLORS & FABRIC)</Typography>
        </Divider>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Stack spacing={2}>
          {itemFields.map((item, index) => (
            <Box key={item.id} sx={{ p: 2, border: '1px solid #E0E0E0', borderRadius: 2, bgcolor: '#FAFAFA' }}>
              <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Controller
                    name={`orderDetails.items.${index}.colorCode`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="color"
                        fullWidth
                        label={`Item #${index + 1} Color`}
                        sx={{ height: 56 }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 8 }}>
                  <Controller
                    name={`orderDetails.items.${index}.fabricNote`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ''}
                        fullWidth
                        label="Fabric Note (e.g., Silk, Cotton, Pattern)"
                        placeholder="Describe the fabric or add code..."
                        slotProps={{
                          input: {
                            endAdornment: (
                              <IconButton onClick={() => remove(index)} color="error" size="small" disabled={itemFields.length <= 1}>
                                <DeleteIcon />
                              </IconButton>
                            )
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
}
