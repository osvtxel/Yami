
import React from 'react';
import { View, TouchableOpacity, Text, Image, StatusBar, StyleSheet, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import ButtonNewSell from '../components/ButtonNewSell';
import logo from '../assents/splash2.png'
import { Avatar, Title, } from 'react-native-paper'
import { Button, Badge, Icon } from 'react-native-elements'
import { useTheme } from '@react-navigation/native'


import ViewHome from '../view/ViewHome';
import ViewCambio from '../view/ViewCambio';
import ViewChat from '../view/ViewChat';
import ViewProfile from '../view/ViewProfile'
import viewSearch from '../view/ViewFavoritos';
import ViewVendasCursos from '../view/ViewVendasCursos'

import ViewEditProfile from '../view/ViewEditProfile';
import ViewFavoritos from '../view/ViewFavoritos';
import ViewNovaVenda from '../view/ViewNovaVenda'
import ViewChatScreen from '../view/ViewChatScreen'
import ViewNotificacoes from '../view/Viewnotification';
import ViewNegociarVendas from '../view/ViewNegociarVendas'
import ViewComprarNota from '../view/ViewComprarNota';
import ViewComprasEmCurso from '../view/ViewComprasCurso';
import ViewComprasEfe from '../view/ViewCompraEfe';
import ViewVendasEfe from '../view/ViewVendasEfe';
import ViewSeaach from '../view/ViewSearch';
import { auth, db } from '../services/firebase';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const screenOptionStyle = {
    headerStyle: {
        backgroundColor: '#00B4DB'
    },
    headerTintColor: "white",
    headerBackTitle: "Voltar",
};


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

/**
 * 
 * @param {*} param0 
 * @returns 
 */

const FeedStack = ({ navigation }) => (
    <Stack.Navigator
        initialRouteName="ViewHome"
        /*screenOptions={screenOptionStyle}*/>
        <Stack.Group screenOptions={screenOptionStyle}>
            <Stack.Screen name="ViewHome" component={ViewHome}
                options={() => {
                    return {
                        title: "Feed de Vendas",
                        headerRight: () => (
                            <View style={{ flexDirection: 'row' }}>
                                <Button
                                    onPress={() => navigation.navigate("ViewSearch")}
                                    type="clear"

                                    icon={<MaterialCommunityIcons name="magnify" size={25} color="white" />} />

                                <Button
                                    onPress={() => navigation.navigate("viewChatLast")}
                                    type="clear"

                                    icon={<Ionicons name="chatbubbles-outline" size={25} color="white" />} />
                            </View>
                        ),
                        headerLeft: () => (
                            <Button
                                onPress={() => navigation.openDrawer()}
                                type="clear"
                                icon={<MaterialCommunityIcons name="menu" size={25} color="white" />} />),

                    }
                }} />





            <Stack.Screen name="favoritos" component={ViewFavoritos}
                options={{
                    title: "Solicitações de Compra"
                }} />
            <Stack.Screen name="vendasCursos" component={ViewVendasCursos}
                options={{
                    title: "Vendas em Curso"
                }} />
            <Stack.Screen name="vendasEfetudas" component={ViewVendasEfe}
                options={{
                    title: "Vendas Efetuadas"
                }} />
            <Stack.Screen name="comprasEfetuadas" component={ViewComprasEfe}
                options={{
                    title: "Compras Efetuadas"
                }} />
            <Stack.Screen name="comprasEmCurso" component={ViewComprasEmCurso}
                options={{
                    title: "Vendas Em Cursos"
                }} />
            <Stack.Screen name="ViewSearch" component={ViewSeaach}
                options={{
                    title: "Vendas Efetuadas"
                }} />
            <Stack.Screen name="profileScreen" component={ViewProfile}
                options={({ route }) => ({
                    title: route.params.user.firstName + '' + route.params.user.lastname,
                })} />


        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="viewSell" component={ViewNovaVenda}

                options={{

                    headerShown: false
                }} />
            <Stack.Screen name="viewNegociar" component={ViewNegociarVendas}
                options={{
                    headerShown: false
                }} />
            <Stack.Screen name="viewComprar" component={ViewComprarNota}
                options={{
                    headerShown: false
                }} />


        </Stack.Group>
    </Stack.Navigator>
)

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const CambioDiario = ({ navigation }) => (

    <Stack.Navigator
        screenOptions={screenOptionStyle}>

        <Stack.Screen name="Cambio Diário" component={ViewCambio}
            options={() => {
                return {
                    title: "Câmbio Diário",
                    headerLeft: () => (
                        <Button
                            onPress={() => navigation.toggleDrawer()}
                            type="clear"
                            icon={<MaterialCommunityIcons name="menu" size={25} color="white" />} />)

                }
            }} />
    </Stack.Navigator>

)

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const SearchStack = ({ navigation }) => (
    <Stack.Navigator>
        <Stack.Screen name="search" component={ViewSeaach}
            options={({ route }) => {

                return {
                    title: "",

                }
            }}

        />
    </Stack.Navigator>
)

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const ProfileStack = ({ navigation }) => (
    <Stack.Navigator
        screenOptions={screenOptionStyle}>

        <Stack.Screen name="profileScreen" component={ViewProfile}
            options={({ route }) => {
                return {
                    title: "Meu Perfil",
                    headerRight: () => (
                        <Button
                            onPress={() => navigation.navigate("editProfile", { route })}
                            type="clear"

                            icon={<MaterialCommunityIcons name="account-edit-outline" size={25} color="white" />} />),
                    headerLeft: () => (
                        <Button
                            onPress={() => navigation.toggleDrawer()}
                            type="clear"
                            icon={<MaterialCommunityIcons name="menu" size={25} color="white" />} />)

                }
            }}
        />

        <Stack.Screen name="editProfile" component={ViewEditProfile}
            options={{
                title: "Editar o Perfil",
            }} />
        <Stack.Screen name="vendasEfe" component={ViewVendasEfe}
            options={{
                title: "Vendas Efetuadas",
                headerRight: () => (
                    <Button
                        onPress={() => navigation.goBack()}
                        type="clear"

                        icon={<MaterialCommunityIcons name="check" size={25} color="white" />} />)
            }} />
        <Stack.Screen name="vendasCurso" component={ViewVendasCursos}
            options={{
                title: "Vendas em Curso",
                headerRight: () => (
                    <Button
                        onPress={() => navigation.goBack()}
                        type="clear"

                        icon={<MaterialCommunityIcons name="check" size={25} color="white" />} />)
            }} />
        <Stack.Screen name="ViewChatScreen" component={ViewChatScreen}
            options={({ route }) => ({
                title: LogoTitle(route.params.user) //route.params.user.nameSeller
            })} />
    </Stack.Navigator>
)

/**
 * 
 * @param {*} param0 
 * @returns 
 */

const AppStack = ({ navigation }) => {

    const UidUser = auth.currentUser.uid
    const getTabBarVisibility = (route) => {
        const routeName = route.state
            ? route.state.routes[route.state.index].name
            : '';

        if (routeName === 'chat' || routeName === 'viewSell' || routeName === 'viewNegociar' || routeName === 'editProfile') {
            return false;
        }
        return true;
    };

    return (
        <Tab.Navigator initialRouteName="ViewHome"
            backBehavior='history'
            tabBarOptions={{
                style: {
                    position: 'absolute',
                    backgroundColor: 'white',
                    borderTopColor: 'transparent',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                },
                keyboardHidesTabBar: true,
                activeTintColor: "#42a5f5",
                showLabel: false,
                tabStyle: {
                    paddingBottom: 5,
                    paddingTop: 5,


                }
            }}
        >
            <Tab.Screen name="home" component={FeedStack}
                options={({ route }) => ({

                    //header: () => null,
                    tabBarLabel: 'Yame',
                    headerShown: false,
                    tabBarVisible: getTabBarVisibility(route),
                    tabBarIcon: ({ size, color }) => (
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Image
                                source={logo}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: color

                                }}
                            />
                        </View>

                    )
                })}
            />
            <Tab.Screen name="cambio" component={CambioDiario}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Câmbio',
                    tabBarIcon: ({ size, color }) => (
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <MaterialCommunityIcons name="currency-usd" color={color} size={size} />
                        </View>

                    )
                }}
            />
            <Tab.Screen name="novo" component={viewSearch}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ size, color }) => (
                        <ButtonNewSell
                            size={size} color={color} navigation={navigation}
                        />
                    ),

                }}
            />

            <Tab.Screen name="searchScreen" component={SearchStack}
                options={({ route }) => ({
                    headerShown: false,
                    tabBarVisible: getTabBarVisibility(route),
                    tabBarLabel: 'Procurar',
                    tabBarIcon: ({ size, color }) => (
                        <MaterialCommunityIcons name="bell-outline" color={color} size={size} />
                    )
                })}
            />
            <Tab.Screen name="profile" component={ProfileStack}
                options={({ route }) => ({
                    headerShown: false,
                    tabBarVisible: getTabBarVisibility(route),
                    tabBarLabel: 'Perfil',
                    tabBarIcon: ({ size, color }) => (
                        <MaterialCommunityIcons name="account-circle-outline" color={color} size={size} />
                    )
                })}
            />
        </Tab.Navigator>
    )
}

export default AppStack;
