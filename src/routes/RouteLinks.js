import React, { useContext, useState, useEffect, createContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Avatar, Title, } from 'react-native-paper'
import { Text, View } from 'react-native';
import DrawerStack from './DrawerNavigator'
import ViewChatScreen from '../view/ViewChatScreen'
import ViewChat from '../view/ViewChat';
import PhoneVerifications from '../accountVerifications/PhoneVerifications'
import BiPassaportTake from '../accountVerifications/BiPassaportTake'
import ImageDocument from '../accountVerifications/ImageDocument'
import DocVerifications from '../accountVerifications/DocVerifications'
import TakePhoto from '../accountVerifications/ViewTakePhoto'
import TelaFinal from '../accountVerifications/TelaFinal'



function LogoTitle(route) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Avatar.Image
                source={{
                    uri: route.imageUser ? route.imageUser : route.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                }}
                size={30}
            />
            <Title style={{ fontSize: 16, marginLeft: 5, }}>{route.firstName ? route.firstName + ' ' + route.lastname : route.name}</Title>
        </View>

    );
}

const screenOptionStyle = {
    headerStyle: {
        backgroundColor: '#00B4DB'
    },
    headerTintColor: "white",
    headerBackTitle: "Voltar",
};


export const AuthContextDark = createContext();
const Stack = createStackNavigator();
const RoutesLinks = ({ navigation }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(false)



    return (
        <Stack.Navigator screenOptions={
            screenOptionStyle}
        >
            <Stack.Group>
                <Stack.Screen options={{ headerShown: false }} name="DrawerStack" component={DrawerStack} />
                <Stack.Screen name="viewChatLast" component={ViewChat}
                    options={{
                        title: "Minhas Conversas",
                        tabBarVisible: false
                    }} />
                <Stack.Screen name="ViewChatScreen" component={ViewChatScreen}
                    options={({ route }) => ({
                        title: LogoTitle(route.params.user) //route.params.user.nameSeller
                    })} />
                
            </Stack.Group>

            <Stack.Group>
                <Stack.Screen name="biPassport" component={BiPassaportTake}

                    options={{

                        headerShown: false
                    }} />
                <Stack.Screen name="imageDocument" component={ImageDocument}
                    options={{
                        headerShown: false
                    }} />
                <Stack.Screen name="phoneVer" component={PhoneVerifications}
                    options={{
                        headerShown: false
                    }} />
                <Stack.Screen name="doclVer" component={DocVerifications}
                    options={{
                        headerShown: false
                    }} />
                <Stack.Screen name="takePhoto" component={TakePhoto}
                    options={{
                        headerShown: false
                    }} />
                <Stack.Screen name="finalVer" component={TelaFinal}
                    options={{
                        headerShown: false
                    }} />


            </Stack.Group>
        </Stack.Navigator >
    )
}

export default RoutesLinks;