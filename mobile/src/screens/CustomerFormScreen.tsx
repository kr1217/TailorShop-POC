import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { 
  TextInput, Button, Text, List, Divider, 
  SegmentedButtons, useTheme, Card, IconButton,
  Portal, Snackbar
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { databaseApi } from '../services/db';
import { printToFile } from '../services/receipt';
import { FormInputs } from '../types/customer';

const EMPTY_FORM: FormInputs = {
  personalInfo: { name: '', phone: '', address: '', referralBy: '' },
  measurements: {
    male: { 
      length: '', shoulder: '', sleeve: '', chest: '', waist: '', neck: '', daman: '', shalwarLength: '', pancha: '',
      extra: { collarType: 'Ban', pocketStyle: 'Side Jieb', cuffStyle: 'Gol Bazu', damanStyle: 'Gol', shalwarType: 'Shalwar' }
    },
    female: { 
      top: { bust: '', underBust: '', waist: '', hips: '', shoulderToApex: '', armhole: '', sleeveLength: '', frontNeckDepth: '', backNeckDepth: '' },
      bottom: { highWaist: '', hips: '', fullLength: '', thigh: '' }
    }
  },
  orderDetails: { 
    quantity: 1, 
    items: [{ colorCode: '#2C3E50', fabricNote: '' }], 
    totalPrice: '', 
    advancePayment: '0',
    dueDate: new Date().toISOString().split('T')[0], 
    orderStatus: 'Pending', 
    paymentStatus: false 
  }
};

export default function CustomerFormScreen({ navigation, route }: any) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const editData = route.params?.editData;
  
  const [successMsg, setSuccessMsg] = useState(false);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [isSearching, setIsSearching] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { handleSubmit, control, setValue, watch, reset, getValues } = useForm<FormInputs>({
    defaultValues: editData || EMPTY_FORM
  });

  const { fields: itemFields, append, remove } = useFieldArray({
    control,
    name: "orderDetails.items"
  });

  const phoneValue = watch('personalInfo.phone');
  const quantityValue = watch('orderDetails.quantity');

  // Sync items with quantity
  useEffect(() => {
    const targetCount = parseInt(String(quantityValue)) || 0;
    const currentCount = itemFields.length;
    if (targetCount > currentCount) {
      for (let i = 0; i < targetCount - currentCount; i++) {
        append({ colorCode: '#2C3E50', fabricNote: '' });
      }
    } else if (targetCount < currentCount) {
      for (let i = 0; i < currentCount - targetCount; i++) {
        remove(currentCount - 1 - i);
      }
    }
  }, [quantityValue, itemFields.length]);

  // Search by phone logic
  useEffect(() => {
    if (!editData && phoneValue && phoneValue.length >= 11) {
      const search = async () => {
        setIsSearching(true);
        try {
          const customer = await databaseApi.getCustomerByPhone(phoneValue);
          if (customer) {
            reset(customer);
            Alert.alert("Customer Found", `Loading details for ${customer.personalInfo.name}`);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsSearching(false);
        }
      };
      search();
    }
  }, [phoneValue]);

  const mutation = useMutation({
    mutationFn: (data: FormInputs) => databaseApi.saveCustomer(data, route.params?.customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setSuccessMsg(true);
      if (editData) {
        navigation.goBack();
      } else {
        reset(EMPTY_FORM);
      }
    },
    onError: (error: any) => {
      Alert.alert("Save Failed", error.message || "An error occurred while saving.");
    }
  });

  const onSubmit = (data: FormInputs) => {
    mutation.mutate(data);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>Personal Details / کسٹمر کی تفصیلات</Text>
          <Controller
            control={control}
            name="personalInfo.phone"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Phone Number / فون نمبر"
                value={value}
                onChangeText={onChange}
                keyboardType="phone-pad"
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="phone" />}
              />
            )}
          />
          <Controller
            control={control}
            name="personalInfo.name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Full Name / نام"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="account" />}
              />
            )}
          />
          <Controller
            control={control}
            name="personalInfo.address"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Address / پتہ"
                value={value}
                onChangeText={onChange}
                mode="outlined"
                multiline
                numberOfLines={2}
                style={styles.input}
              />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>Measurements / ناپ</Text>
          <SegmentedButtons
            value={gender}
            onValueChange={setGender as any}
            buttons={[
              { value: 'male', label: 'Male (مردانہ)' },
              { value: 'female', label: 'Female (زنانہ)' },
            ]}
            style={styles.segment}
          />

          {gender === 'male' ? (
            <View style={styles.grid}>
              {[
                { name: 'length', label: 'Length / لمبائی' },
                { name: 'shoulder', label: 'Shoulder / تیرا' },
                { name: 'sleeve', label: 'Sleeve / بازو' },
                { name: 'chest', label: 'Chest / چھاتی' },
                { name: 'waist', label: 'Waist / کمر' },
                { name: 'neck', label: 'Neck / کالر' },
                { name: 'daman', label: 'Daman / گھیرا' },
                { name: 'shalwarLength', label: 'Shalwar / شلوار' },
                { name: 'pancha', label: 'Pancha / پائنچہ' },
              ].map((m) => (
                <Controller
                  key={m.name}
                  control={control}
                  name={`measurements.male.${m.name}` as any}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label={m.label}
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      mode="outlined"
                      style={styles.gridInput}
                    />
                  )}
                />
              ))}
            </View>
          ) : (
            <View>
              <Text variant="labelLarge" style={{ marginVertical: 8 }}>Top / قمیض</Text>
              <View style={styles.grid}>
                {['bust', 'underBust', 'waist', 'hips', 'shoulderToApex', 'armhole', 'sleeveLength', 'frontNeckDepth', 'backNeckDepth'].map((m) => (
                   <Controller
                    key={m}
                    control={control}
                    name={`measurements.female.top.${m}` as any}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        label={m.replace(/([A-Z])/g, ' $1').trim()}
                        value={value}
                        onChangeText={onChange}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.gridInput}
                      />
                    )}
                  />
                ))}
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>Order Details / آرڈر کی تفصیلات</Text>
          <View style={styles.row}>
            <Controller
              control={control}
              name="orderDetails.quantity"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Quantity / سوٹس"
                  value={String(value)}
                  onChangeText={(val) => onChange(parseInt(val) || 0)}
                  keyboardType="numeric"
                  mode="outlined"
                  style={[styles.input, { flex: 1, marginRight: 8 }]}
                />
              )}
            />
            <Controller
              control={control}
              name="orderDetails.totalPrice"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Total Price / کل قیمت"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  mode="outlined"
                  style={[styles.input, { flex: 1 }]}
                  left={<TextInput.Affix text="Rs." />}
                />
              )}
            />
          </View>
          <Controller
            control={control}
            name="orderDetails.dueDate"
            render={({ field: { onChange, value } }) => {
              const displayDate = value ? new Date(value) : new Date();
              const isValidDate = !isNaN(displayDate.getTime());
              
              return (
                <View>
                  <TextInput
                    label="Due Date / واپسی کی تاریخ"
                    value={isValidDate ? displayDate.toLocaleDateString('en-PK') : 'Select Date'}
                    mode="outlined"
                    style={styles.input}
                    editable={false}
                    right={<TextInput.Icon icon="calendar" onPress={() => setShowDatePicker(true)} />}
                    onPressIn={() => setShowDatePicker(true)}
                  />
                  {showDatePicker && (
                    <DateTimePicker
                      value={isValidDate ? displayDate : new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          onChange(selectedDate.toISOString().split('T')[0]);
                        }
                      }}
                    />
                  )}
                </View>
              );
            }}
          />
        </Card.Content>
      </Card>

      <Button 
        mode="contained" 
        onPress={handleSubmit(onSubmit)} 
        loading={mutation.isPending}
        style={styles.submitBtn}
        labelStyle={styles.submitBtnLabel}
      >
        {editData ? 'UPDATE RECORD' : 'SAVE CUSTOMER'}
      </Button>

      <Button 
        mode="outlined" 
        icon="printer"
        onPress={async () => {
          try {
            await printToFile(getValues(), route.params?.customerId ? `#${route.params.customerId}` : "New");
          } catch (e) {
            Alert.alert("Print Error", "Failed to generate receipt.");
          }
        }} 
        style={[styles.submitBtn, { marginTop: 12, borderColor: theme.colors.secondary, borderWidth: 2 }]}
        textColor={theme.colors.secondary}
      >
        PRINT RECEIPT
      </Button>

      {editData && (
        <Button 
          mode="text" 
          icon="delete"
          onPress={() => {
            Alert.alert(
              "Delete Customer",
              "Are you sure you want to permanently delete this customer and all their orders?",
              [
                { text: "Cancel", style: "cancel" },
                { 
                  text: "Delete", 
                  style: "destructive",
                  onPress: async () => {
                    await databaseApi.deleteCustomer(route.params!.customerId!);
                    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
                    queryClient.invalidateQueries({ queryKey: ['customers'] });
                    navigation.goBack();
                  }
                }
              ]
            );
          }} 
          style={{ marginTop: 24 }}
          textColor="red"
        >
          DELETE CUSTOMER
        </Button>
      )}
      
      <View style={{ height: 40 }} />

      <Snackbar
        visible={successMsg}
        onDismiss={() => setSuccessMsg(false)}
        duration={3000}
        style={{ backgroundColor: 'green' }}
      >
        Record saved successfully!
      </Snackbar>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  segment: {
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridInput: {
    width: '48%',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
  },
  submitBtn: {
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#2C3E50',
  },
  submitBtnLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});
