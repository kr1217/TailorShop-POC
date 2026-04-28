import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, List, useTheme, ActivityIndicator } from 'react-native-paper';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { databaseApi } from '../services/db';

export default function SettingsScreen() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const handleBackup = async () => {
    setLoading(true);
    try {
      const dbPath = await databaseApi.backupDB();
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(dbPath, {
          dialogTitle: 'Backup Database',
          mimeType: 'application/x-sqlite3',
        });
      } else {
        Alert.alert('Sharing not available', 'Could not open sharing dialog.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Backup Failed', 'An error occurred while creating backup.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    Alert.alert(
      "Confirm Restore",
      "This will overwrite your current data with the backup file. The app will need to be restarted. Proceed?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Restore", 
          onPress: async () => {
            setLoading(true);
            try {
              const result = await DocumentPicker.getDocumentAsync({
                type: 'application/x-sqlite3',
                copyToCacheDirectory: true,
              });

              if (!result.canceled && result.assets && result.assets[0]) {
                await databaseApi.restoreDB(result.assets[0].uri);
                Alert.alert("Success", "Data restored. Please restart the app manually to apply changes.");
              }
            } catch (error) {
              console.error(error);
              Alert.alert('Restore Failed', 'An error occurred while restoring data.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineSmall" style={styles.title}>System Settings / ترتیبات</Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <List.Item
            title="Backup Data / بیک اپ"
            description="Export your database to Google Drive or Email"
            left={props => <List.Icon {...props} icon="cloud-upload" />}
            onPress={handleBackup}
          />
          <Divider />
          <List.Item
            title="Restore Data / بحال کریں"
            description="Import a previously saved database file"
            left={props => <List.Icon {...props} icon="cloud-download" />}
            onPress={handleRestore}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>App Version: 1.0.0 (Offline Mode)</Text>
          <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>Database: Local SQLite</Text>
        </Card.Content>
      </Card>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator animating={true} size="large" />
          <Text style={{ marginTop: 16 }}>Processing...</Text>
        </View>
      )}
    </View>
  );
}

const Divider = () => <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginVertical: 8 }} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontWeight: '900',
    color: '#2C3E50',
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
