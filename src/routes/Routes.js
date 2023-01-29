import React, { useContext, useState, useEffect, createContext } from 'react';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { Provider as PaperProvider, DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme } from 'react-native-paper'
import { auth, db } from '../services/firebase'
import { AuthContext } from './AuthProvider';
import "firebase/compat/auth";
import AuthStack from './AuthStack'
import RoutesLinks from './RouteLinks';


export const AuthContextDark = createContext();

const Routes = ({ navigation }) => {
    const { user, setUser } = useContext(AuthContext);
    const [initializing, setInitializing] = useState(true);
    const [isDarkTheme, setIsDarkTheme] = useState(false)

    const CustomDefaultTheme = {
        ...NavigationDefaultTheme,
        ...PaperDefaultTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            ...PaperDefaultTheme.colors,
            primary: "#00B4DB",
            background: '#ffffff',
            text: '#333333'
        }
    }

    const CustomDarkTheme = {
        ...NavigationDarkTheme,
        ...PaperDarkTheme,
        colors: {
            ...NavigationDarkTheme.colors,
            ...PaperDarkTheme.colors,
            primary: "#00B4DB",
            background: '#333333',
            border:'#ffffff',
            text: '#ffffff',
            
           
        }
    }

    const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

    const onAuthStateChanged = (user) => {
        setUser(user);
        if (initializing) setInitializing(false)
    };

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, [])


    if (initializing) return null

    return (
        <PaperProvider theme={theme}>
            <AuthContextDark.Provider
                value={{
                    thoggleTheme: () => {
                        setIsDarkTheme(isDarkTheme => !isDarkTheme) //responsavel por inversao de theme
                    },
                }}
            >
                <NavigationContainer theme={theme}>
                    {user ? <RoutesLinks /> : <AuthStack />}
                </NavigationContainer>
            </AuthContextDark.Provider>
        </PaperProvider>
    )
}

export default Routes;