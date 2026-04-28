import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { 
  Searchbar, List, Avatar, Text, 
  useTheme, FAB, ActivityIndicator, Divider 
} from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { databaseApi } from '../services/db';

export default function CustomerListScreen({ navigation }: any) {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['customers', page, search],
    queryFn: () => databaseApi.getCustomers(page, 20, search),
  });

  const renderItem = ({ item }: any) => (
    <List.Item
      title={item.name}
      description={item.phone}
      left={props => (
        <Avatar.Text 
          {...props} 
          size={44} 
          label={item.name.substring(0, 2).toUpperCase()} 
          style={{ backgroundColor: theme.colors.primary }}
        />
      )}
      right={props => <List.Icon {...props} icon="chevron-right" />}
      onPress={async () => {
        const fullData = await databaseApi.getCustomerById(item.id);
        if (fullData) {
          navigation.navigate('CustomerForm', { editData: fullData, customerId: item.id });
        }
      }}
      style={styles.listItem}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Searchbar
        placeholder="Search Customers / تلاش کریں"
        onChangeText={setSearch}
        value={search}
        style={styles.searchBar}
      />

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator animating={true} color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={data?.customers || []}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={() => <Divider />}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text variant="bodyLarge" style={{ color: '#607D8B' }}>No customers found.</Text>
            </View>
          }
        />
      )}

      <FAB
        icon="plus"
        label="New Customer"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#fff"
        onPress={() => navigation.navigate('CustomerForm')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 16,
    elevation: 2,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  listItem: {
    backgroundColor: '#fff',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
