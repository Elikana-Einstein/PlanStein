import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const SendLoading = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color="#ffffff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3a3c5d',
    // Keeping it a perfect circle often looks better for send buttons
    width: 44, 
    height: 44,
    borderRadius: 22, 
    alignItems: 'center',
    justifyContent: 'center',
    // Optional: add a slight shadow for depth
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});

export default SendLoading;