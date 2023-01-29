import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { windowHeight, windowWidth } from '../util/Dimentions';
import { LinearGradient } from 'expo-linear-gradient';

const FormButton = ({ buttonTitle, ...rest }) => {
  return (
    <TouchableOpacity style={styles.signIn} {...rest}>
    <LinearGradient
      colors={['#00B4DB', '#0083B0']}
      style={styles.signIn}
    >
     
        <Text style={styles.buttonText}>{buttonTitle}</Text>
     
    </LinearGradient>
    </TouchableOpacity>
  );
};

export default FormButton;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 5,
    width: '100%',
    height: windowHeight / 15,
    backgroundColor: '#2e64e5',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    //fontFamily: 'Lato-Regular',
  },
  signIn: {
    width: '100%',
    height: windowHeight / 15,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
});