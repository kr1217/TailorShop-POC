import React, { forwardRef, useState, useEffect } from 'react';
import { Box, Typography, Divider, Grid } from '@mui/material';

export interface ReceiptData {
  personalInfo: {
    name: string;
    phone: string;
  };
  orderDetails: {
    quantity: number;
    items?: { colorCode: string; fabricNote: string }[];
    totalPrice: string;
    advancePayment: string;
    dueDate: string;
  };
}

interface ReceiptViewProps {
  data: ReceiptData;
}

const ReceiptView = forwardRef<HTMLDivElement, ReceiptViewProps>(({ data }, ref) => {
  // Helper to strip symbols (Rs., , ,) and parse safely
  const safeParse = (val: string | number) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const cleaned = String(val).replace(/[^\d.-]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const totalAmount = safeParse(data?.orderDetails?.totalPrice);
  const advanceAmount = safeParse(data?.orderDetails?.advancePayment);
  const balanceAmount = totalAmount - advanceAmount;

  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    // Stable ID generation after mount to prevent hydration mismatch
    const randomId = Math.floor(Math.random() * 90000) + 10000;
    setOrderId(String(randomId));
  }, []);

  const dueDateStr = data?.orderDetails?.dueDate 
    ? new Date(data.orderDetails.dueDate).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Not Set';

  return (
    <Box ref={ref} sx={{ p: 4, width: '100%', maxWidth: '800px', margin: '0 auto', bgcolor: '#FFFFFF', color: '#111' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#2C3E50', mb: 1 }}>
          AL-RIAZ TAILORS (الریاض ٹیلرز)
        </Typography>
        <Typography variant="body1" sx={{ color: '#555' }}>
          Opposite Main Market, Block C
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', mb: 2 }}>
          Tel: 0300-1234567 | Order ID: #{orderId || '.....'}
        </Typography>
        <Divider sx={{ borderBottomWidth: 2, borderColor: '#2C3E50' }} />
      </Box>

      {/* Customer Info */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" sx={{ color: '#777', textTransform: 'uppercase', letterSpacing: 1 }}>Customer Name</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{data?.personalInfo?.name || 'Walk-in Customer'}</Typography>
        </Grid>
        <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
          <Typography variant="caption" sx={{ color: '#777', textTransform: 'uppercase', letterSpacing: 1 }}>Phone</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{data?.personalInfo?.phone || 'N/A'}</Typography>
        </Grid>
      </Grid>

      {/* Order Summary */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#2C3E50', mb: 2 }}>Order Summary</Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, p: 1, bgcolor: '#F8F9FA' }}>
          <Typography variant="body1">Total Garments (سوٹس):</Typography>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>{data?.orderDetails?.quantity || 1} Items</Typography>
        </Box>

        {data?.orderDetails?.items && data.orderDetails.items.length > 0 && (
           <Box sx={{ pl: 2, mb: 2 }}>
             {data.orderDetails.items.map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ mr: 2, width: '60px' }}>Item {idx + 1}:</Typography>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #ccc', bgcolor: item.colorCode || '#fff', mr: 1 }} />
                  <Typography variant="body2" sx={{ color: '#555' }}>
                    {item.fabricNote || 'Standard'}
                  </Typography>
                </Box>
             ))}
           </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, p: 1, bgcolor: '#F8F9FA', borderLeft: '4px solid #C29B0B' }}>
          <Typography variant="body1">Due Date (واپسی):</Typography>
          <Typography variant="body1" sx={{ fontWeight: 800, color: '#c0392b' }}>{dueDateStr}</Typography>
        </Box>
      </Box>

      {/* Payment */}
      <Box sx={{ mb: 6, width: '60%', ml: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1">Total Amount:</Typography>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>Rs. {totalAmount.toLocaleString()}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1">Advance / Deposit:</Typography>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>Rs. {advanceAmount.toLocaleString()}</Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Balance:</Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, color: balanceAmount > 0 ? '#c0392b' : '#27ae60' }}>
            Rs. {balanceAmount.toLocaleString()}
          </Typography>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: 'center', mt: 'auto', pt: 4, borderTop: '1px dashed #ccc' }}>
        <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555' }}>
          &quot;Please bring this receipt at the time of pickup.&quot;
        </Typography>
        <Typography variant="caption" sx={{ color: '#999', display: 'block', mt: 1 }}>
          (وصولی کے وقت یہ رسید لازمی ساتھ لائیں)
        </Typography>
      </Box>
    </Box>
  );
});

ReceiptView.displayName = 'ReceiptView';
export default ReceiptView;
