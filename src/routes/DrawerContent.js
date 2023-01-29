import React, { useState, useEffect, useContext } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import logo from '../assents/splash2.png'
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer'
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
}
    from 'react-native-paper'
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import { auth, db } from '../services/firebase'
import { AuthContextDark } from './Routes';
import { AuthContext } from './AuthProvider';



const colors = {
    id: 1,
    themeColor: "#42a5f5",
    white: "#fff",
    background: "#f4f6fc",
    greyish: "#a4a4a4",
    tint: "#2b49c3",
    orange: "#FF6347"
  };

export function DrawerContent(props) {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const { logout} = useContext(AuthContext);
    const {thoggleTheme} = useContext(AuthContextDark);
    const [image, setImage] = useState('');
    const paperTheme = useTheme();
    const [data, setData] = useState({
        firstNome: '',
        midleNome: '',
        lastNome: '',
        telefone: '',
        address: '',
        email: '',
        phoneCode: '',
        localTrabalho: '',
        city: '',
        profissao: '',
        country: '',
        imageUrl:'',
    
      });


      /***
   * UseEffect to take data from firebase
   */
  useEffect(() => {
    takeUser()
  }, [])
  const UidUser = auth.currentUser.uid
  /***
   * Pegar dados do usuario
   */
  const takeUser = async () => {
    try {
      await
            db.collection("Users").doc(UidUser)
              .get()
              .then((doc) => {
                setData({
                  ...data,
                  firstNome: doc.data().firstName,
                  midleNome:doc.data().midleName,
                  lastNome: doc.data().lastname,
                  country:doc.data().country,
                  city:doc.data().city,
                  email:doc.data().email,
                  imageUrl: doc.data().userImg
                })
                
              })
              .catch((error) => {
                console.log("Error getting documents: ", error);
              });
 
    } catch (error) {

    }
  }

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 15 }}>
                            <Avatar.Image
                                source={{
                                    uri:data.imageUrl 
                                }}
                                size={50}
                            />
                            <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: 15 }}>
                                <Title style={styles.title}>{data.midleNome ? data.firstNome + ' '+ data.midleNome + ' ' + data.lastNome: data.firstNome +' '+ data.lastNome}</Title>
                                <Caption style={styles.caption}>{data.country ? data.city + ','+data.country : data.email}</Caption>
                            </View>
                        </View>

                    </View>
                    <View style={styles.viewLinha}></View>
                    <Drawer.Section title="Principais" style={styles.drawerSection}>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Image
                                    source={logo}
                                    resizeMode='contain'
                                    style={{
                                        width: 25,
                                        height: 25,
                                        tintColor: color

                                    }} />
                            )}
                            label="Feed de Vendas"
                            onPress={() => { props.navigation.navigate('home') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <MaterialCommunityIcons name="currency-usd" color={color} size={25} />
                            )}
                            label="Câmbio Diário"
                            onPress={() => { props.navigation.navigate('cambio') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <AntDesign
                                    name="swap"
                                    color={color}
                                    size={size} />
                            )}
                            label="Solicitações de Vendas"
                            onPress={() => { props.navigation.navigate('favoritos') }}
                        />


                    </Drawer.Section>
                    <Drawer.Section title="Minhas Vendas">

                        <DrawerItem
                            icon={({ color, size }) => (
                                <MaterialCommunityIcons
                                    name="autorenew"
                                    color={color}
                                    size={size} />
                            )}
                            label="Vendas em Curso"
                            onPress={() => { props.navigation.navigate('vendasCursos') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <MaterialCommunityIcons
                                    name="check-all"
                                    color={color}
                                    size={size} />
                            )}
                            label="Vendas Efetuadas"
                            onPress={() => { props.navigation.navigate('vendasEfetudas') }}
                        />

                    </Drawer.Section>
                    <Drawer.Section  title="Minhas Compras">

                        <DrawerItem
                            icon={({ color, size }) => (
                                <MaterialCommunityIcons
                                    name="autorenew"
                                    color={color}
                                    size={size} />
                            )}
                            label="Compras em Curso"
                            onPress={() => { props.navigation.navigate('comprasEmCurso')}}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <MaterialCommunityIcons
                                    name="check-all"
                                    color={color}
                                    size={size} />
                            )}
                            label="Compras Efetuadas"
                            onPress={() => { props.navigation.navigate('comprasEfetuadas') }}
                        />

                    </Drawer.Section>

                    <Drawer.Section title="Preferências">
                        <TouchableRipple onPress={() => {thoggleTheme()} }>
                            <View style={styles.preference}>
                                <Text>Modo Escuro</Text>
                                <View pointerEvents="none">
                                    <Switch value={paperTheme.dark} />
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    icon={({ color, size }) => (
                        <MaterialCommunityIcons
                            name="exit-to-app"
                            color={color}
                            size={size} />
                    )}
                    label="Sair"
                    onPress={() => logout()}
                >

                </DrawerItem>
            </Drawer.Section>
        </View>
    )

}


const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        alignItems:'center',
        
       
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    viewLinha: {
        height: 0.5,
        width: '100%',
        backgroundColor: colors.greyish,
        marginTop: 10

    },
});