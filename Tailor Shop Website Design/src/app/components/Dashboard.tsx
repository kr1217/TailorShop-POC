import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  People,
  ShoppingBag,
  AttachMoney,
  Pending,
  Warning,
  Schedule,
} from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

function MetricCard({ title, value, icon, color, subtitle }: MetricCardProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -10,
          right: -10,
          opacity: 0.1,
          fontSize: '100px',
          color: color,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="body2" sx={{ color: '#5D4037', mb: 1 }}>
          {title}
        </Typography>
        <Typography
          variant="h3"
          sx={{
            color: color,
            mb: subtitle ? 1 : 0,
          }}
        >
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: '#5D4037', opacity: 0.8 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

export function Dashboard() {
  const metrics = {
    totalCustomers: 156,
    totalOrders: 342,
    totalRevenue: 45280,
    pendingOrders: 23,
    pastDueOrders: 5,
    nearingDueOrders: 12,
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#2C3E50' }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Total Customers"
            value={metrics.totalCustomers}
            icon={<People sx={{ fontSize: 'inherit' }} />}
            color="#2C3E50"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Total Orders"
            value={metrics.totalOrders}
            icon={<ShoppingBag sx={{ fontSize: 'inherit' }} />}
            color="#5D4037"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Total Revenue"
            value={`$${metrics.totalRevenue.toLocaleString()}`}
            icon={<AttachMoney sx={{ fontSize: 'inherit' }} />}
            color="#D4AF37"
            subtitle="This month"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Pending Orders"
            value={metrics.pendingOrders}
            icon={<Pending sx={{ fontSize: 'inherit' }} />}
            color="#3498DB"
            subtitle="In progress"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Orders Past Due"
            value={metrics.pastDueOrders}
            icon={<Warning sx={{ fontSize: 'inherit' }} />}
            color="#C0392B"
            subtitle="Requires attention"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Nearing Due Date"
            value={metrics.nearingDueOrders}
            icon={<Schedule sx={{ fontSize: 'inherit' }} />}
            color="#E67E22"
            subtitle="Due within 3 days"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#2C3E50' }}>
              Recent Activity
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { customer: 'John Smith', action: 'New order placed', time: '2 hours ago' },
                { customer: 'Sarah Johnson', action: 'Measurement updated', time: '5 hours ago' },
                { customer: 'Michael Brown', action: 'Order completed', time: '1 day ago' },
                { customer: 'Emily Davis', action: 'Payment received', time: '2 days ago' },
              ].map((activity, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    backgroundColor: '#F9F9F9',
                    borderRadius: 1,
                    borderLeft: '4px solid #D4AF37',
                  }}
                >
                  <Typography sx={{ color: '#2C3E50' }}>
                    {activity.customer}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#5D4037' }}>
                    {activity.action}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#5D4037', opacity: 0.7 }}>
                    {activity.time}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#2C3E50' }}>
              Quick Stats
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#5D4037' }}>
                    Order Completion Rate
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#2C3E50' }}>
                    94%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 8,
                    backgroundColor: '#F9F9F9',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: '94%',
                      height: '100%',
                      backgroundColor: '#D4AF37',
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#5D4037' }}>
                    Customer Satisfaction
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#2C3E50' }}>
                    98%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 8,
                    backgroundColor: '#F9F9F9',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: '98%',
                      height: '100%',
                      backgroundColor: '#2C3E50',
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#5D4037' }}>
                    On-Time Delivery
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#2C3E50' }}>
                    87%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 8,
                    backgroundColor: '#F9F9F9',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: '87%',
                      height: '100%',
                      backgroundColor: '#5D4037',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
