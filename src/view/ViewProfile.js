
import React, { useContext, useState, useEffect, useRef } from 'react'
import { FlatList, StatusBar, Image, View, StyleSheet, TouchableOpacity, Platform, RefreshControl, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { FONTS, SIZE } from '../constant/themes'
import { useTheme } from '@react-navigation/native'
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Ionicons, MaterialCommunityIcons, FontAwesome, SimpleLineIcons, AntDesign } from '@expo/vector-icons'
import { Avatar, Button } from 'react-native-elements';
import { auth, db, storage } from '../services/firebase'
import moment from 'moment'
import { LinearGradient } from 'expo-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import ViewMoreText from 'react-native-view-more-text'
import NumberFormat from 'react-number-format'
import * as ImagePicker from 'expo-image-picker'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  Title,
  Caption,
  Text,
  Card,
  Snackbar
}
  from 'react-native-paper'
import MoedaList from '../data/ListaMoedas'
import ViewNotidicatio from './Viewnotification'


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const PHONE_ICON = Platform.OS === 'android' ? 'cellphone-android' : 'cellphone-iphone'
const MORE_ICON = Platform.OS === 'android' ? 'dots-vertical' : 'dots-horizontal'
const optionIcon = Platform.OS === 'android' ? 'dots-vertical' : 'dots-horizontal'
const Tab = createMaterialTopTabNavigator();

export default ({ route, navigation }) => {

  const refRBSheetCurrentUser = useRef();
  const [expoPushToken, setExpoPushToken] = useState('');
  const refRBSheet = useRef();
  const [postId, setPostId] = useState()
  const refRBSheet1 = useRef();
  const [firstnomeUsuario, setFirstNomeUsuario] = useState('')
  const [lastnomeUsuario, setLastNomeUsuario] = useState('')
  const [usuarioAvatar, setUsuarioAvatar] = useState('')
  const theme = useTheme();
  const { colors } = useTheme();
  const [selectedImage, setSelectedImage] = useState('');
  const refRBSheetNegociar = useRef();


  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [visible, setVisible] = useState(false)
  const [textError, setTextError] = useState('')
  const [snackColor, setSnackColor] = useState(false)
  const UidUser = auth.currentUser.uid
  const [isFetching, setIsFetching] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [moedas, setMoedas] = useState(MoedaList)
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [thousandSeparator, setThousandSeparator] = useState(' ')
  const [listSell, setListSell] = useState([])
  const [image, setImage] = useState('');
  const [urlimage, setUrlImage] = useState('');
  const [isLikesFirebase, setIsLikesFirebase] = useState([])
  const [isLikes, setIsLikes] = useState({
    likes: [],
    likedPosts: []
  })
  const [data, setData] = useState({
    firstNome: '',
    midleNome: '',
    lastNome: '',
    telefone: '',
    address: '',
    email: '',
    phoneCode: '',
    localTrabalho: '',
    nVendas: '',
    nLikers: '',
    followers: '',
    expoPushToken: '',
    city: '',
    profissao: '',
    perfilVerification:true,
    country: '',
    imageUrl: '',

  });


  /**
   * Register expo-token-notifications
   */
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  //sendPushNotifications
  async function sendPushNotification(expoPushToken, first, last, imageAvatar) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Yame',
      body: first + ' ' + last + ' Gostou de ti!',
      data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }
  //registrar o token do usuario
  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }


  /***
   * Funcoes para ver mais e menos os comentarios...
   */
  function renderViewMore(onPress) {
    return (
      <Text onPress={onPress} style={{ color: colors.primary }}>Ler mais</Text>
    )
  }

  function renderViewLess(onPress) {
    return (
      <Text onPress={onPress} style={{ color: colors.primary }}>Ler menos</Text>
    )
  }

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {

          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    refRBSheetCurrentUser.current.close()

    if (!result.cancelled) {
      setSelectedImage(result.uri);
      updatePhotoProfile(result.uri)
    }
  };
  /**
   * 
   * @returns take image
   */
  const openCameraPickerAsync = async () => {

    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permitir o Acesso a camera!");
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync();
    if (pickerResult.cancelled === true) {
      return;
    }
    refRBSheetCurrentUser.current.close()
    setSelectedImage(pickerResult.uri);
    updatePhotoProfile(pickerResult.uri)

  }

  /**
    * 
    * @param {Updating Photo Profile} imageUpdating 
    * @returns 
    */
  const updatePhotoProfile = async (imageUpdating) => {
    var photoProfileUpdate = db.collection("Users").doc(UidUser);
    const uploadUri = imageUpdating;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    const response = await fetch(uploadUri);
    const blob = await response.blob();
    var ref = storage.ref().child('photos/profile' + `${auth.currentUser.uid}` + '/' + 'profile' + `${filename}`);
    const snapshot = await ref.put(blob);
    let imgUrl = await snapshot.ref.getDownloadURL();

    // Set the "capital" field of the city 'DC'
    return photoProfileUpdate.update({
      userImg: imgUrl
    })
      .then(() => {
        onToggleSnackBar(),
          setTextError('Foto atualizada com com sucesso!')
      })
      .catch((error) => {
        onToggleSnackBar(),
          setSnackColor(true)
        setTextError('Erro ao atualizar a foto de perfil, tente mais tarde!')
      });
  }

  const removeFavorits = () => {
    const postkey = postId.id
    const favRef = db.collection('VendasAll').doc(postkey)
    favRef.delete().then(() => {
      takeSellsFromFirebase()
      onToggleSnackBar(),
        setTextError('Venda removida com sucesso!.')
    }
    )
  }
  /**
  * Confirmacao de deletar venda
  * @param {*} user 
  */
  function confirmUserdelete() {
    Alert.alert('Excluir Venda', 'Deseja Excluir essa Venda ?', [
      {
        text: 'Sim',
        onPress: () => {
          refRBSheet.current.close()
          removeFavorits()
        }
      },
      {
        text: 'Não',
        onPress: () => refRBSheet.current.close()
      }
    ])
  }

  const refreshingData = () => {
    takeSellsFromFirebase()
  }
  /***
   * UseEffect to take data from firebase
   */
  useEffect(() => {
    takeSellsFromFirebase()
  }, [])

  console.log(UidUser)
  /***
   * Pegar as vendas todas
   */
  const takeSellsFromFirebase = async () => {
    setIsLoading(true)
    try {
      await db.collection("VendasAll").where("userUId", "==", route.params ? route.params.user.userUId : UidUser)
        .get()
        .then((querySnapshot) => {
          try {
            db.collection("Users").doc(route.params ? route.params.user.userUId : UidUser)
              .get()
              .then((doc) => {
                setData({
                  ...data,
                  firstNome: doc.data().firstName,
                  midleNome: doc.data().midleName,
                  expoPushToken: doc.data().expoPushToken,
                  lastNome: doc.data().lastname,
                  telefone: doc.data().telefone,
                  phoneCode: doc.data().phoneCode,
                  profissao: doc.data().profissao,
                  perfilVerification: doc.data().perfilVerification,
                  localTrabalho: doc.data().localTrabalho,
                  nLikers: doc.data().nLikers,
                  nVendas: doc.data().nVendas,
                  address: doc.data().address,
                  followers: doc.data().followers,
                  country: doc.data().country,
                  city: doc.data().city,
                  email: doc.data().email,
                  imageUrl: doc.data().userImg


                })
                // doc.data() is never undefined for query doc snapshots
                setIsLoading(false)
                setIsFetching(false)
                //console.log(doc.id, " => ", doc.data());
              })
              .catch((error) => {
                console.log("Error getting documents: ", error);
              });

          } catch (error) {

          }
          let temp = [];
          querySnapshot.forEach((doc) => {
            let SellDetails = {};
            SellDetails = doc.data();

            SellDetails['id'] = doc.id;
            temp.push(SellDetails);
            setListSell(temp)
            setIsLoading(false)
            setIsFetching(false)
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", listSell);
          });

        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });

    } catch (error) {

    }
  }
  /**
     * 
     */
  const footerRender = () => {
    try {
      if (isFetchingMore) {
        return (
          <ActivityIndicator color={colors.text} />
        )
      } else {
        return null
      }
    } catch (error) {

    }

  }
  /**
     * 
     */
  const loadingData = () => {
    try {
      if (isLoading) {
        return (
          <View style={{ justifyContent: "center" }}>
            <ActivityIndicator style={{ justifyContent: 'center' }} color={colors.text} />

          </View>
        )
      } else {
        return null
      }
    } catch (error) {

    }

  }




  function AboutScreen() {
    return (
      <ScrollView>
        <View style={{ ...styles.section2 }}>
          {data.country ? <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderColor: colors.text, width: '95%', marginBottom: 10 }}>
            <MaterialCommunityIcons
              name="map-marker-radius-outline"
              color={colors.text}
              size={20} />
            <Text style={{ fontSize: 15, marginLeft: 10, marginBottom: 10 }}>{data.address ? data.address + ',' + data.country : data.country}</Text>
          </View> : null}

          {data.city ? <View style={{ flexDirection: 'row', marginTop: 10, borderColor: colors.text, borderBottomWidth: 0.5, width: '95%', marginBottom: 10 }}>
            <MaterialCommunityIcons
              name="home-city-outline"
              color={colors.text}
              size={20} />
            <Text style={{ fontSize: 15, marginLeft: 10, marginBottom: 10 }}>
              {data.city + ',' + data.country}
            </Text>
          </View> : null}

          {data.telefone ? <View style={{ flexDirection: 'row', marginTop: 10, borderColor: colors.text, borderBottomWidth: 0.5, width: '95%', marginBottom: 10 }}>
            <MaterialCommunityIcons
              name={PHONE_ICON}
              color={colors.text}
              size={20} />
            <Text style={{ fontSize: 15, marginLeft: 10, marginBottom: 10 }}>
              {data.phoneCode + ' ' + data.telefone}
            </Text>
          </View> : null}

          {data.email ? <View style={{ flexDirection: 'row', marginTop: 10, borderColor: colors.text, borderBottomWidth: 0.5, width: '95%', marginBottom: 10 }}>
            <MaterialCommunityIcons
              name="email-outline"
              color={colors.text}
              size={20} />
            <Text style={{ fontSize: 15, marginLeft: 10, marginBottom: 10 }}>
              {data.email}
            </Text>
          </View> : null}
          {data.profissao ? <View style={{ flexDirection: 'row', marginTop: 10, borderColor: colors.text, borderBottomWidth: 0.5, width: '95%', marginBottom: 10 }}>
            <MaterialCommunityIcons
              name="email-outline"
              color={colors.text}
              size={20} />
            <Text style={{ fontSize: 15, marginLeft: 10, marginBottom: 10 }}>
              {data.profissao}
            </Text>
          </View> : null}

          {data.localTrabalho ? <View style={{ flexDirection: 'row', marginTop: 10, borderColor: colors.text, marginBottom: 10, borderBottomWidth: 0.5, width: '95%' }}>
            <SimpleLineIcons
              name="graduation"
              color={colors.text}
              size={20} />
            <Text style={{ fontSize: 15, marginLeft: 10, marginBottom: 10 }}>
              {data.localTrabalho}
            </Text>
          </View> : null}

          <View style={{ flexDirection: 'row', marginTop: 10, }}>
            <MaterialCommunityIcons
              name="heart-outline"
              color={colors.text}
              size={20} />
            <Text style={{ fontSize: 15, marginLeft: 10, marginBottom: 10, borderBottomWidth: 0.5, borderColor: colors.text }}>
              Vendas Favoritas
            </Text>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <MaterialCommunityIcons
              name="clock-time-five-outline"
              color={colors.text}
              size={20} />
            <Text style={{ fontSize: 15, marginLeft: 10, marginBottom: 10, borderBottomWidth: 0.5, borderColor: colors.text }}>
              Vendas por Confirmar
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  function MySellScreen() {
    /**
         * Card View das vendas Todas
         * @param {} param0 
         * @returns 
         */
    const cardView = ({ item, index }) => (
      <Card elevation={3} key={index} style={{ marginTop: 5, color: colors.card }}>
        <Card.Title titleStyle={{ fontSize: 16 }} subtitleStyle={{ fontSize: 12 }} title={item.firstName + ' ' + item.midleName + ' ' + item.lastname} subtitle={moment(item.dataPubl).locale('pt').fromNow(false) + " • " + item.countryUser} left={props =>
          <Avatar
            rounded={true}
            containerStyle={{
              marginBottom: 0, borderWidth: 1,
              borderColor: colors.card,
            }}
            source={{
              uri: data.imageUrl ? data.imageUrl : item.imageUser
            }}
            size={40}
          >
          </Avatar>} right={() => <MaterialCommunityIcons name={MORE_ICON} size={24} color={colors.text} onPress={() => {
            setPostId(item)
            UidUser === item.userUId ? refRBSheet.current.open() : refRBSheet1.current.open()
          }} />} />
        <Card.Content >
          <ViewMoreText
            numberOfLines={3}
            renderViewMore={renderViewMore}
            renderViewLess={renderViewLess}
            textStyle={{ textAlign: 'auto' }}
          >
            <Text style={{ marginBottom: 10 }}>
              {item.comentar}
            </Text>
          </ViewMoreText>

          <View style={{ ...styles.viewLinha }}></View>
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ backgroundColor: colors.background, ...styles.viewValor }}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={{ alignSelf: 'center', color: colors.text }}>Valor</Text>
                  <View style={{ backgroundColor: colors.text, ...styles.viewLinha }}></View>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginLeft: 5 }}>
                    <Image
                      source={moedas[item.imageUrlFrom].avatarUrl
                      }
                      style={styles.imageStyle}

                    />
                    <NumberFormat renderText={text => <Text style={{ marginLeft: 8, marginTop: 2, color: colors.text }}>{text}</Text>} value={item.valorFrom}
                      displayType={'text'} thousandSeparator={thousandSeparator} decimalSeparator={','} prefix={item.simbolysFrom + ' '} />

                  </View>
                </View>

              </View>
              <View style={{ backgroundColor: colors.background, ...styles.viewValor }}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={{ alignSelf: 'center', color: colors.text }}>Preço</Text>
                  <View style={{ backgroundColor: colors.text, ...styles.viewLinha }}></View>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginLeft: 5 }}>
                    <Image
                      source={moedas[item.imageUrlTo].avatarUrl}
                      style={styles.imageStyle}

                    />

                    <NumberFormat renderText={text => <Text style={{ marginLeft: 8, marginTop: 2, color: colors.text }}>{text}</Text>} value={item.valorTo}
                      displayType={'text'} thousandSeparator={thousandSeparator} decimalSeparator={','} prefix={item.simbolysTo + ' '} />

                  </View>

                </View>

              </View>
            </View>
            <View style={{ backgroundColor: colors.text, ...styles.viewLinha }}></View>

            <View style={{ flexDirection: 'row', marginBottom: 0, justifyContent: 'space-around' }}>
              <TouchableOpacity>
                <FontAwesome id={index}
                  name={isLikes.likedPosts.indexOf(item.id) > -1 ? 'heart' : 'heart-o' && isLikesFirebase.indexOf(item.id) > -1 ? 'heart' : 'heart-o'} size={20}
                  color={isLikes.likedPosts.indexOf(item.id) > -1 ? "red" : colors.text}
                  onPress={() => {
                    const userKey = UidUser
                    const postkey = item.id
                    const favRef = db.collection('favoritos').doc(userKey).collection('MeusFavoritos').doc(postkey);
                    const favRefLikes = db.collection('PostLikes').doc(userKey);


                    if (isLikes.likedPosts.indexOf(item.id) === -1) {
                      setIsLikes({
                        likedPosts: [...isLikes.likedPosts, item.id]
                      })
                      favRef.set({
                        id: postkey,
                        nome: item.nameSeller,
                        description: item.comentar,
                        location: item.countryUser,
                        valorFrom: item.valorFrom,
                        createdAt: item.dataPubl,
                        symbolFrom: item.simbolysFrom,
                        valorTo: item.valorTo,
                        symbolTo: item.simbolysTo,
                      }).then(() => {

                        favRefLikes.set({
                          likedPosts: isLikes.likedPosts
                        })
                        onToggleSnackBar(),
                          setTextError("Venda adicionada nos favoritos!")
                      });




                    } else {
                      let index = isLikes.likedPosts.indexOf(item.id);
                      setIsLikes({
                        likedPosts: isLikes.likedPosts.splice(index, 1)
                      })
                      setIsLikes({
                        likedPosts: isLikes.likedPosts
                      })
                      favRef.delete().then(() => {
                        onToggleSnackBar(),
                          setTextError("Venda foi removidas nos favoritos!")
                        updateLikedsPost(userKey, isLikes.likedPosts)

                      })

                    }
                  }} />
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row' }}>
                <AntDesign style={{ marginTop: 0 }} name="retweet" size={20} color={colors.text} />
                <Text style={{ fontSize: 13, marginLeft: 5, marginRight: 5 }}></Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
                //setUserSell(item)
                refRBSheetNegociar.current.open()
                BotoomSheetNegociarVendas(item)
              }   /*navigation.navigate('viewNegociar', { user: item })*/}>
                <FontAwesome name="handshake-o" size={20} color={colors.text} />
                <Text style={{ fontSize: 13, marginLeft: 5 }}></Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card.Content>
      </Card>

    )


    return (
      <View style={{ flex: 1, justifyContent: 'center', height: "100%" }}>
        <FlatList
          data={listSell}
          ListEmptyComponent={() => SellEmpty()}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refreshingData}
            />
          }
          renderItem={cardView}
        />

      </View>
    );
  }


  function MyTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Sobre" component={AboutScreen} />
        <Tab.Screen name="Minhas Vendas" component={MySellScreen} />
        <Tab.Screen name="Galeria" component={ViewNotidicatio} />
      </Tab.Navigator>
    );
  }


  function SellEmpty() {
    return (
      <View style={{ alignItems: 'center', flexDirection: 'column', marginTop: 20 }}>
        <Image
          source={require('../assents/triste.png')}
          style={styles.logo}
        />
        <Text>Infelizmente não tens nenhuma venda publicada,</Text>
        <Text>Quando publicares nós mostraremos aqui!!</Text>
      </View>
    )
  }
  /** 
     * renderizar o botton sheet  
    */
  function bottomSheetOptionsNoUser() {
    return (
      <RBSheet
        ref={refRBSheet1}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{

          wrapper: {
            backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'
          },
          container: {
            backgroundColor: colors.background,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10
          }


        }}
      >
        <View style={{ alignItems: 'center' }}>
          <Title style={{ color: colors.text }}>Opções</Title>
        </View>
        <View style={{ flexDirection: 'row', margin: 5, marginLeft: 20 }}>
          <MaterialCommunityIcons name='chat-outline' size={24} color={colors.text} onPress={() => refRBSheet1.current.close()} />
          <TouchableOpacity style={styles.commandButton} onPress={() => {
            refRBSheet1.current.close()
            navigation.navigate('ViewChatScreen', { user: postId })
          }}>
            <Text style={{ ...FONTS.h3, marginLeft: 5, color: colors.text }}>
              Enviar Mensagem
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', margin: 5, marginLeft: 20 }}>
          <FontAwesome name='handshake-o' size={20} color={colors.text} onPress={() => refRBSheet1.current.close()} />
          <TouchableOpacity style={styles.commandButton} onPress={() => {
            refRBSheet1.current.close()
            navigation.navigate('viewNegociar', { user: postId })

          }
          }>
            <Text style={{ ...FONTS.h3, marginLeft: 5, color: colors.text }}>
              Negociar a venda
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', margin: 5, marginLeft: 20 }}>
          <MaterialCommunityIcons name='share-outline' size={24} color={colors.text} onPress={() => refRBSheet1.current.close()} />
          <TouchableOpacity style={styles.commandButton} onPress={() => {
            refRBSheet1.current.close()
            funcaoShare()
          }
          }>
            <Text style={{ ...FONTS.h3, marginLeft: 5, color: colors.text }}>
              Partilhar a venda com ...
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', margin: 5, marginLeft: 20 }}>
          <MaterialCommunityIcons name='flag-variant-outline' size={24} color={colors.text} onPress={() => refRBSheet1.current.close()} />
          <TouchableOpacity style={styles.commandButton} onPress={() => refRBSheet1.current.close()}>
            <Text style={{ ...FONTS.h3, marginLeft: 5, color: colors.text }}>
              Denunciar a venda
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', margin: 5, marginLeft: 20 }}>
          <MaterialCommunityIcons name='close' size={24} color={colors.text} onPress={() => refRBSheet1.current.close()} />
          <TouchableOpacity style={styles.commandButton} onPress={() => refRBSheet1.current.close()}>
            <Text style={{ ...FONTS.h3, color: colors.text }}>
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    )
  }



  /**
   * 
   * @returns 
   */
  function bottomSheetOptionsCurrenteUser() {
    return (
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'
          },
          container: {
            backgroundColor: colors.background,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10
          }

        }}
      >
        <View style={{ alignItems: 'center' }}>
          <Title style={{ color: colors.text }}>Opções</Title>
        </View>
        <View style={{ flexDirection: 'row', margin: 5, marginLeft: 20 }}>
          <MaterialCommunityIcons name='delete-variant' size={24} color={colors.text} onPress={confirmUserdelete} />
          <TouchableOpacity style={styles.commandButton} onPress={confirmUserdelete}>
            <Text style={{ ...FONTS.h3, marginLeft: 5, color: colors.text }}>
              Apagar a venda
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', margin: 5, marginLeft: 20 }}>
          <FontAwesome name='edit' size={24} color={colors.text} onPress={() => {
            refRBSheet.current.close()
            navigation.navigate('viewSell', { user: postId })

          }} />
          <TouchableOpacity style={styles.commandButton} onPress={() => {
            refRBSheet.current.close()
            navigation.navigate('viewSell', { user: postId })

          }}>
            <Text style={{ ...FONTS.h3, marginLeft: 5, color: colors.text }}>
              Editar a venda
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', margin: 5, marginLeft: 20 }}>
          <MaterialCommunityIcons name='share-outline' size={24} color={colors.text} onPress={() => {
            refRBSheet.current.close()
            funcaoShare()
          }} />
          <TouchableOpacity style={styles.commandButton} onPress={() => {
            refRBSheet.current.close()
            funcaoShare()
          }}>
            <Text style={{ ...FONTS.h3, marginLeft: 5, color: colors.text }}>
              Partilhar a venda com ...
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', margin: 5, marginLeft: 20 }}>
          <MaterialCommunityIcons name='close' size={24} color={colors.text} onPress={() => refRBSheet.current.close()} />
          <TouchableOpacity style={styles.commandButton} onPress={() => refRBSheet.current.close()}>
            <Text style={{ ...FONTS.h3, color: colors.text }}>
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    )
  }



  /**Render Header Profile */
  function bottonSheetForTakePhoto() {
    return (
      <RBSheet
        ref={refRBSheetCurrentUser}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'
          },
          container: {
            backgroundColor: colors.background,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            height: 170
          }


        }}
      >

        <View style={{ alignItems: 'center' }}>
          <Title styl={{ color: colors.text, }}>Mudar foto de Perfil</Title>
        </View>
        <View style={{ flexDirection: 'row', margin: 5, marginLeft: 20 }}>
          <MaterialCommunityIcons name='camera-outline' size={24} color={colors.text} onPress={openCameraPickerAsync
          } />
          <TouchableOpacity style={styles.commandButton} onPress={
            openCameraPickerAsync
          }>
            <Text style={{ color: colors.text, ...FONTS.h3 }}>
              Usar a Câmera
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', margin: 5, marginLeft: 20 }}>
          <MaterialCommunityIcons name='folder-image' size={24} color={colors.text} onPress={pickImage} />
          <TouchableOpacity style={styles.commandButton} onPress={pickImage}>
            <Text style={{ color: colors.text, ...FONTS.h3 }}>
              Escolher na Galeria
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', margin: 5, marginLeft: 20 }}>
          <MaterialCommunityIcons name='close' size={24} color={colors.text} onPress={() => refRBSheetCurrentUser.current.close()} />
          <TouchableOpacity style={styles.commandButton} onPress={() => refRBSheetCurrentUser.current.close()}>
            <Text style={{ ...FONTS.h3 }}>
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>


    )
  }
  /**
    * 
    * @returns 
    */
  function renderHeaderPrtofile() {
    return (

      <View style={{
        flex: 1,
        backgroundColor: colors.border,
      }}>

        <View style={{
          height: 320, backgroundColor: colors.background
        }}>

          <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
            <Avatar
              rounded={true}
              resizeMode={'cover'}
              onPress={() => refRBSheetCurrentUser.current.open()}
              containerStyle={{
                marginBottom: 0, borderWidth: 4,
                borderColor: data.perfilVerification ? "#00e676":"red",
               
                
              }}
              source={{
                uri: selectedImage ? selectedImage : data.imageUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
              }}

              size={110}
            >
              <Avatar.Accessory name={data.perfilVerification ? 'done-all':"close"}
               style={{backgroundColor:'white'}}
                type="materialCommunityIcons"
                size={30}
                color={data.perfilVerification ? "#00e676":'red'}
                onPress={() => refRBSheetCurrentUser.current.open()} />
            </Avatar>
            <View style={{ flexDirection: 'column', marginLeft: 15, alignItems: 'center', marginBottom: 10 }}>
              <Title style={{ color: colors.text, ...styles.title }}>{data.midleNome ? data.firstNome + ' ' + data.midleNome + ' ' + data.lastNome : data.firstNome + ' ' + data.lastNome}</Title>
              <Caption style={{ color: colors.text, ...styles.caption }}>{data.city ? data.city + ',' + data.country : data.country}</Caption>
            </View>
          </View>

          <View style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.background }}>
            <View style={{
              flex: 1, flexDirection: 'column', alignItems: 'center'
            }}>
              <Title style={{ color: colors.text }}>{data.nVendas ? data.nVendas : 0}</Title>
              <Text style={{ color: colors.text, fontFamily: 'material-community' }}>Vendas</Text>
            </View>


            <View style={{ backgroundColor: colors.text, ...styles.viewLinha5 }}></View>
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
              <Title style={{ ...FONTS.h2, color: colors.text }}>{data.nLikers ? data.nLikers : 0}</Title>
              <Text style={{ color: colors.text }}>Gostos</Text>

            </View>
            <View style={{ backgroundColor: colors.text, ...styles.viewLinha5 }}></View>
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
              <Title style={{ ...FONTS.h2, color: colors.text }}>{data.followers ? data.followers : 0}</Title>
              <Text style={{ color: colors.text }}>Seguidores</Text>

            </View>

          </View>

          {route.params ? <View style={styles.section}>
            <View style={{ marginRight: 5 }}>
              <Button
                icon={
                  <Ionicons name="chatbubble-ellipses-outline" size={25} color={'white'} />
                }
                title=" Messagem"
                containerStyle={{ borderRadius: 10, borderColor: colors.primary }}
                onPress={() => navigation.navigate('ViewChatScreen', { user: route.params.user })}

              />
            </View>

            <View style={{ width: 250 }}>
              <Button
                icon={
                  <AntDesign style={{ marginRight: 10 }} name="like2" size={22} color="white" />
                }
                title="Gostar"
                containerStyle={{ borderRadius: 10, borderColor: colors.primary }}
                onPress={async () => {
                  db.collection("Users").doc(UidUser)
                    .get()
                    .then((doc) => {
                      setFirstNomeUsuario(doc.data().firstName)
                      setLastNomeUsuario(doc.data().lastname)
                      setUsuarioAvatar(doc.data().userImg)
                    })
                  await sendPushNotification(expoPushToken, firstnomeUsuario, lastnomeUsuario, usuarioAvatar);
                }}
              />
            </View>
          </View> : <View style={styles.editarPerfil}>
            <View style={{ width: '100%' }}>
              <Button
                icon={
                  <MaterialCommunityIcons style={{ marginRight: 10 }} name="account-edit-outline" size={25} color="white" />
                }
                title="Editar o Perfil"
                containerStyle={{ borderRadius: 10, borderColor: colors.primary }}
                onPress={() => navigation.navigate("editProfile")}
              />
            </View>
          </View>}
        </View>

        {MyTabs()}
      </View>


    )
  }


  return (

    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.primary} barStyle={theme.dark ? 'default' : 'light-content'} />
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        style={{
          backgroundColor: snackColor ? '#FF0000' : colors.background,
          bottom: 50
        }}
        duration={2000}
      >
        {textError}
      </Snackbar>
      {loadingData()}
      {renderHeaderPrtofile()}
      {bottonSheetForTakePhoto()}
      {bottomSheetOptionsNoUser()}
      {bottomSheetOptionsCurrenteUser()}

    </View>

  );
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  title: {
    fontSize: 20,
    marginTop: 3,
    fontWeight: 'bold',

  },
  backgroundHeader: {
    paddingLeft: 10,
    //backgroundColor: '#42a5f5',
    height: 240,

  },
  touchText: {
    fontSize: 15,
    marginTop: 3,
    color: "black"
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    marginBottom: 15,

  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    //marginLeft: 15,
    margin: 10,
    marginTop: 15,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  editarPerfil: {
    //marginLeft: 15,
    margin: 10,
    marginTop: 15,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  section2: {
    flexDirection: 'column',
    marginLeft: 15,
    marginTop: 10,
  },
  sectionForHeaederProfile: {
    backgroundColor: "white",
    height: 170,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 3,
    shadowRadius: 2,
    elevation: 2
  },
  viewLinha: {
    height: 0.5,
    width: '100%',
    opacity: 0.5,
    //backgroundColor: colors.greyish,
    marginTop: 0,
    marginBottom: 10

  },
  viewLinha3: {
    height: 2,
    width: '100%',
    marginTop: 10

  },
  viewLinha2: {
    height: 0.5,
    width: '10%',
    marginTop: 12,
    transform: [
      { rotate: "90deg" }
    ]

  },
  viewLinha5: {
    height: 0.5,
    width: '10%',
    marginTop: 25,
    opacity: 2,
    transform: [
      { rotate: "90deg" }
    ]

  },
  viewLinha4: {
    height: 1,
    width: '20%',
    marginTop: 45,
    transform: [
      { rotate: "90deg" }
    ]

  },
  viewScroll: {
    padding: 10,
    flexDirection: "row",
    backgroundColor: "black",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: 20

  },

  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  btnCancelar: {
    borderRadius: 7,
    borderColor: "black",
  },
  panel: {
    padding: 20,
    paddingTop: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    //elevation: 5,
    //shadowOpacity: 0.4,
  },
  commandButton: {
    left: 5
  },
  viewValor: {
    width: 150,
    height: 70,
    borderRadius: 5,
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.4,
    elevation: 5,
  },
  imageStyle: {
    height: 25,
    width: 25,

    resizeMode: 'stretch',

  },
  logo: {
    height: 50,
    width: 50,
    alignSelf: "center",
    resizeMode: 'cover',
  }


})
