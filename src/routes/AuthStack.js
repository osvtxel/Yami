import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack'
import {Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FontAwesome} from '@expo/vector-icons'
import { useTheme } from '@react-navigation/native'
import ViewHome from '../view/ViewHome'
import ViewLoginScreen from '../view/ViewLoginScreen'
import ViewRegisterScreen from '../view/ViewRegisterScreen'
import ViewForgotPassword from '../view/ViewForgotPAssword'




const screenOptionStyle = {
  headerStyle: {
      backgroundColor: '#00B4DB'
  },
  //headerTintColor: "white",
  headerBackTitle: "Voltar",
};


const Stack = createStackNavigator()

 const  AuthStack = ({}) => {
    const [isFirstLaunch, setIsFirstLaunch] = useState(true)
    const theme = useTheme();
    const { colors } = useTheme();
    let routeName;

    useEffect(() => {
        AsyncStorage.setItem('alreadyLaunched').then((value) => {
            if (value === null) {
                AsyncStorage.setItem('alreadyLaunched', 'true');
                setIsFirstLaunch(true);
            } else {
                setIsFirstLaunch(false)
            }
        });
    }, [])

    if (isFirstLaunch === null) {
        return null; 
        } else if (isFirstLaunch === true) {
        routeName = 'Login';
    } else {
        routeName = 'Onboarding';
    }

    return (
      <>
      <StatusBar backgroundColor={colors.background} barStyle={theme.dark ? 'default' : 'dark-content'} />
      <Stack.Navigator initialRouteName = {routeName}
        screenOptions={
          screenOptionStyle}
      >

         <Stack.Screen name="Onboarding" component={ViewHome}
                options={{ headerShown:false }}
            />
            <Stack.Screen name="Login" component={ViewLoginScreen} 
                options={{header: () => null}}
            />
            <Stack.Screen name="resetPassword" component={ViewForgotPassword} 
                 options={({navigation}) => ({
                    title: 'Recuperar Palavra Passe',
                    headerStyle: {
                      backgroundColor: colors.background,
                      elevation: 0,
                    },
                  
                  })}
            />
            <Stack.Screen name="Signup" component={ViewRegisterScreen}
                 options={({navigation}) => ({
                    title: 'Criar Nova Conta',
                    headerStyle: {
                      backgroundColor: colors.background,
                      elevation: 0,
                    },
                  
                  })}
                />
      </Stack.Navigator>
      </>
    );
  }
  export default AuthStack;