// @refresh reset
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { GiftedChat, Send, Bubble, SystemMessage } from 'react-native-gifted-chat'
import * as Notifications from 'expo-notifications';
import { Alert, FlatList, View, StyleSheet, RefreshControl, Text, ActivityIndicator } from 'react-native'
import { auth, db } from '../services/firebase'
import { useTheme } from '@react-navigation/native'
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'
import ViewChat from './ViewChat';





Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge:false,
  }),
});

export default ({ route, navigation }) => {
  const theme = useTheme();
  const { colors } = useTheme();
  const [messages, setMessages] = useState([]);
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const { user } = route.params;
  const [isTiping, setIsTiping] = useState(false)
  const [dataUsers, setDataUsers] = useState([]);
  const currentUser = auth.currentUser.uid
  const currentUserEmail = auth.currentUser.email
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
    imageUrl: '',

  });

  useEffect(() => {

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

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications
async function sendPushNotification(expoPushToken, text) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: data.firstNome + ' ' + data.lastNome,
    body: text,
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



  useLayoutEffect(() => {
    takeUserFromFirebase()
  }, [])

  /***
   * Pegar as vendas todas
   */
  const takeUserFromFirebase = async () => {
    try {
      await db.collection("Users").doc(currentUser)
        .get()
        .then((doc) => {
          setData({
            ...data,
            firstNome: doc.data().firstName,
            midleNome: doc.data().midleName,
            lastNome: doc.data().lastname,
            imageUrl: doc.data().userImg
          })
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
        })
        .catch((error) => {
          Alert.alert(
            "Erro de Conexão",
            'Erro... Alguma coisa deu errado, tente mais tarde!'
          )

        });

    } catch (error) {

    }
  }


  async function handleSend(messages) {
    const text = messages[0].text;
    await sendPushNotification(user.expoPushToken, text);
    console.log(user.expoPushToken)

    db.collection('Conversas')
    .doc(currentUser)
    .collection(user.userUId ? user.userUId : user._id)
    .add({
      text,
      createdAt: new Date().getTime(),
      user: {
        _id: currentUser,
        email: currentUserEmail,
        avatar: data.imageUrl
      }
    }).then(() => {
      db
        .collection('Last-messages')
        .doc(currentUser)
        .collection('Vendedores')
        .doc(user.userUId ? user.userUId : user._id)
        .set(
          {
            latestMessage: {
              text,
              createdAt: new Date().getTime()
            },
            user: {
              _id: user.userUId ? user.userUId : user._id,
              name: user.userUId ? user.firstName + ' ' +user.lastname: user.name,
              avatar:user.userUId ? user.imageUser: user.avatar
            }
          },
          { merge: true }
        );
    }).catch((error) => {
      console.log("Error getting documents: ", error);
    });;

  await db.collection('Conversas')
    .doc(user.userUId ? user.userUId : user._id)
    .collection(currentUser)
    .add({
      text,
      createdAt: new Date().getTime(),
      user: {
        _id: currentUser,
        email: currentUserEmail,
        avatar:data.imageUrl
      }
    }).then(() => {
      db
        .collection('Last-messages')
        .doc(user.userUId ? user.userUId :user._id)
        .collection('Vendedores')
        .doc(currentUser)
        .set(
          {
            latestMessage: {
              text,
              createdAt: new Date().getTime()
            },
            user: {
              _id: currentUser,
              email: currentUserEmail,
              name: data.firstNome + ' ' +data.lastNome,
              avatar: data.imageUrl
            }
          },
          { merge: true }
        );
    }).catch((error) => {
      console.log("Error getting documents: ", error);
    });
  }

  
  const isTipingF = ()=>{
    setIsTiping(!isTiping)
  }
  /***
   *Take messages from firebase 
   */
  useEffect(() => {

    const messagesListener =
      db
        .collection('Conversas')
        .doc(currentUser)
        .collection(user.userUId ? user.userUId : user._id)
        .orderBy('createdAt', 'desc')
        .onSnapshot(querySnapshot => {
          const messages = querySnapshot.docs.map(doc => {
            const firebaseData = doc.data();

            const data = {
              _id: doc.id,
              text: '',
              createdAt: new Date().getTime(),
              ...firebaseData
            };

            if (!firebaseData.system) {
              data.user = {
                ...firebaseData.user,
                name: firebaseData.user.email
              };
            }

            return data;
          });
          setMessages(messages);
        });


    // Stop listening for updates whenever the component unmounts
    return () => messagesListener();
  }, []);



  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            style={{ marginBottom: 5, marginRight: 5 }}
            size={32}
            color={colors.primary}
          />
        </View>
      </Send>
    );
  };

  function renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={colors.text} />
      </View>
    );
  }
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: theme.dark ? '#00867d' : '#00B4DB'
          },
          left: {
            backgroundColor: theme.dark ? '#eceff1' : '#8d8d8d'
          }
        }}
        textStyle={{
          right: {
            color: theme.dark ? 'black' : 'white'
          },
          left: {
            color: theme.dark ? 'black' : 'white'
          }
        }}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return (
      <FontAwesome name='angle-double-down' size={22} color='#333' />
    );
  }

  function renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={{ backgroundColor: colors.background, ...styles.systemMessageWrapper }}
        textStyle={{ color: colors.text, ...styles.systemMessageText }}
      />
    );
  }
  return (
    <GiftedChat
      messages={messages}
      isTyping={true}
      showAvatarForEveryMessage={true}
      showUserAvatar
      onSend={handleSend}
      user={{
        _id: currentUser
      }}
      renderBubble={renderBubble}
      alwaysShowSend
      renderSend={renderSend}
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
      placeholder='Escreva uma messangem...'
      renderLoading={renderLoading}
      renderSystemMessage={renderSystemMessage}
    />
  )
}

const styles = StyleSheet.create({
  // rest remains same
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  systemMessageWrapper: {
    //backgroundColor: '#6646ee',
    borderRadius: 4,
    padding: 5
  },
  systemMessageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold'
  }
});