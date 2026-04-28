import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, ActivityIndicator, useTheme } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { databaseApi } from '../services/db';

const MetricCard = ({ title, value, icon, color, subtitle }: any) => {
  const theme = useTheme();
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '700' }}>{title}</Text>
        </View>
        <Text variant="displaySmall" style={{ color: color || theme.colors.primary, fontWeight: '800', marginVertical: 8 }}>
          {value}
        </Text>
        {subtitle && <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{subtitle}</Text>}
      </Card.Content>
    </Card>
  );
};

export default function DashboardScreen() {
  const theme = useTheme();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: databaseApi.getStats,
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating={true} color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Shop Management <Text style={{ color: theme.colors.secondary }}>| Dashboard</Text>
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Welcome to your workshop management system.
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <MetricCard
          title="TOTAL CUSTOMERS"
          value={stats?.totalCustomers || 0}
          color={theme.colors.primary}
        />
        <MetricCard
          title="ACTIVE JOBS"
          value={stats?.activeOrders || 0}
          color={theme.colors.primary}
        />
        <MetricCard
          title="REVENUE COLLECTED"
          value={`Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`}
          color={theme.colors.secondary}
          subtitle="Total earnings to date"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontWeight: '900',
    color: '#2C3E50',
  },
  subtitle: {
    color: '#607D8B',
    marginTop: 4,
  },
  statsGrid: {
    gap: 16,
  },
  card: {
    borderRadius: 12,
    elevation: 0,
    borderWidth: 1,
    borderColor: 'rgba(44,62,80,0.1)',
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
