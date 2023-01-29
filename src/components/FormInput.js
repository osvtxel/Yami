import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Platform ,Text} from 'react-native';
import { windowHeight, windowWidth } from '../util/Dimentions';
import { useTheme } from '@react-navigation/native'
import {MaterialCommunityIcons} from '@expo/vector-icons'


const FormInput = ({maxLenght,phoneCode,phoneVer,onPressIn,autoFocus,editable ,labelValue, placeholderText, iconType, onPress, secureTextEntry,onEndEditing, ...rest }) => {

  const theme = useTheme();
  const { colors } = useTheme();
  return (
    <View style={[styles.inputContainer, {backgroundColor:colors.background, borderColor:theme.dark ? colors.text :colors.primary}]}>
       { phoneVer ? <View style={[styles.iconStyleRight,{borderColor:theme.dark ? colors.text:colors.primary}]}>
       <Text style={{paddingRight:20}}> {phoneCode} </Text>
      </View> : null}   
      <TextInput
        value={labelValue}
        style={[styles.input, {color:colors.text}]}
        numberOfLines={1}
        editable={editable}
        autoFocus={autoFocus}
        onPressIn={onPressIn}
        maxLength={maxLenght}
        returnKeyLabel='OK'
        returnKeyType='done'
        onEndEditing={onEndEditing}
        secureTextEntry={secureTextEntry}
        placeholder={placeholderText}
        placeholderTextColor="#666"
        {...rest}
      />
      
       <View style={[styles.iconStyle,{borderColor:theme.dark ? colors.text:colors.primary}]}>
        <MaterialCommunityIcons name={iconType} size={25} color={colors.text} onPress={onPress}/>
      </View>

    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: '100%',
    height: windowHeight / 15,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  iconStyle: {
    padding: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    width: 50,
  },
  iconStyleRight: {
    padding: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    width: 70,
    
  },
  input: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    //fontFamily: 'Lato-Regular', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    width: windowWidth / 1.5,
    height: windowHeight / 15,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
});