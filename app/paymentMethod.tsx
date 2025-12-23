import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// 1. Define Types
type PaymentMethodType = {
  id: string;
  name: string;
  iconLibrary: "Ionicons" | "FontAwesome";
  iconName: string;
};

// 2. Data Source
const paymentMethodsData: PaymentMethodType[] = [
  {
    id: '1',
    name: 'Credit Card Or Debit',
    iconLibrary: 'Ionicons',
    iconName: 'card-outline',
  },
  {
    id: '2',
    name: 'Paypal',
    iconLibrary: 'FontAwesome',
    iconName: 'paypal',
  },
  {
    id: '3',
    name: 'Bank Transfer',
    iconLibrary: 'Ionicons',
    iconName: 'business-outline',
  },
  {
    id: '4',
    name: 'Cash on Delivery',
    iconLibrary: 'Ionicons',
    iconName: 'cash-outline',
  },
];

const PaymentMethod = () => {
  const router = useRouter();
  const [selectedMethodId, setSelectedMethodId] = useState('1');

  const renderItem = ({ item }: { item: PaymentMethodType }) => {
    const isSelected = item.id === selectedMethodId;
    const IconComponent = item.iconLibrary === 'Ionicons' ? Ionicons : FontAwesome;
    
    // Logic: Paypal specific color, others use main blue
    const iconColor = item.name === 'Paypal' ? '#00457C' : '#40BFFF'; 

    return (
      <TouchableOpacity
        style={[
          styles.paymentItem,
          isSelected ? styles.paymentItemActive : null,
        ]}
        onPress={() => setSelectedMethodId(item.id)}
      >
        {/* FIX: Added "as any" to item.iconName to solve the TS error */}
        <IconComponent 
            name={item.iconName as any} 
            size={24} 
            color={iconColor} 
            style={styles.paymentIcon} 
        />
        
        <Text style={[styles.paymentName, isSelected ? styles.paymentNameActive : null]}>
          {item.name}
        </Text>
        
        {/* Blue Checkmark if selected */}
        {isSelected && (
           <Ionicons name="checkmark-circle" size={24} color="#40BFFF" style={{marginLeft: 'auto'}} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#9098B1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      {/* List */}
      <FlatList
        data={paymentMethodsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
            style={styles.confirmButton}
            onPress={() => {
                if (selectedMethodId === '1') {
                    // Credit Card -> go to choose card
                    router.push("/choosePay");
                } else {
                    // Other methods
                    console.log("Processing method:", selectedMethodId);
                }
            }}
        >
            <Text style={styles.confirmButtonText}>Confirm Payment</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBF0FF',
  },
  backButton: {
    paddingRight: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#223263',
  },
  listContainer: {
    paddingBottom: 100, // Space for footer
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 2,
  },
  paymentItemActive: {
    backgroundColor: '#EBF0FF', // Light blue bg when active
  },
  paymentIcon: {
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  paymentName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#223263',
  },
  paymentNameActive: {
    color: '#40BFFF', // Blue text when active
  },
  
  // Footer Button Styles
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EBF0FF',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  confirmButton: {
    backgroundColor: '#40BFFF',
    padding: 16,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#40BFFF',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  confirmButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PaymentMethod;