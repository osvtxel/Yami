
import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';



 export default function HomeScreen() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <StatusBar backgroundColor="#00B4DB" barStyle="default" />
        <Text>VEndas em vendasCursos</Text>
      </View>
    );
  }