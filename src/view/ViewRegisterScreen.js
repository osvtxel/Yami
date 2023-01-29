
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet, Alert } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { Avatar } from 'react-native-elements'
import { FONTS, SIZE } from '../constant/themes'
import RBSheet from 'react-native-raw-bottom-sheet';
import {auth,db,storage } from '../services/firebase'
import { Title, } from 'react-native-paper'
import { useTheme } from '@react-navigation/native'
import { Ionicons, MaterialCommunityIcons, FontAwesome, SimpleLineIcons, AntDesign } from '@expo/vector-icons'
import { AuthContext } from '../routes/AuthProvider';
import * as ImagePicker from 'expo-image-picker'
import { Snackbar } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler';



const avatarIni = Platform.OS === 'ios' ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' : 'https://cdn.pixabay.com/photo/2017/03/24/06/49/camera-2170377_960_720.png'
const SignupScreen = ({ navigation }) => {

  const refRBSheetCurrentUser = useRef();
  const theme = useTheme();
  const { colors } = useTheme();
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [visible, setVisible] = useState(false)
  const [textError, setTextError] = useState('')
  const [email, setEmail] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [password, setPassword] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [image, setImage] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null);
  const { register} = useContext(AuthContext);


/**
 * Register expo-token-notifications
 */

  useEffect(() => {
    registerForPushNotificationsAsync()
  }, [])

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
        alert('Erro ao carregar o pushToken!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token) //armazena o token no estado
      //console.log(token);
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






  const confirmarPassword = () => {

    if (password !== confirmPassword) {
      Alert.alert(
        "Palavra Passses diferentes",
        'Erro... As Palavras passes não são iguais, por favor tente novamente!'
      )
      setConfirmPassword(null)
    }
  }


  /**
   * 
   */
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            "Acessar Galeria",
            'Yami precisa da permissao para acessar a Galeria!Pode fazer isso em definições do seu dispositivo!!'
          )
        }
      }
    })();
  }, []);

  /**
 * 
 */
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    refRBSheetCurrentUser.current.close()

    if (!result.cancelled) {
      setImage(result.uri);     
    }
  };
  /**
   * 
   * @returns take image
   */
  const openCameraPickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Acessar Galeria",
        'Yami precisa da permissao para acessar a Camera!Pode fazer isso em definições do seu dispositivo!!'
      )

      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync();
    if (pickerResult.cancelled === true) {
      return;
    }
    setImage(pickerResult.uri);
    
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


        }}>

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
   * Aqui comeca a renderiza;ao principal
   */
  return (
    <ScrollView>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Avatar
          rounded={true}
          onPress={() => refRBSheetCurrentUser.current.open()}
          containerStyle={{ marginBottom: 15, borderColor: colors.primary, borderWidth: 0.5 }}
          source={{
            uri: image ? image : "https://cdn.pixabay.com/photo/2017/03/24/06/49/camera-2170377_960_720.png"
          }}
          size={110}
        />


        {/*  <Text style={styles.text}>Criar Nova Conta</Text>*/}

        <FormInput
          labelValue={firstName}
          onChangeText={(fName) => setFirstName(fName)}
          placeholderText="Digite o Primeiro Nome"
          iconType="account-tie-outline"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect={false}
        />

        <FormInput
          labelValue={lastName}
          onChangeText={(lastname) => setLastName(lastname)}
          placeholderText="Digite o último nome"
          iconType="account-tie-outline"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect={false}
        />
        <FormInput
          labelValue={email}
          onChangeText={(userEmail) => setEmail(userEmail)}
          placeholderText="E-mail"
          iconType="email-outline"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <FormInput
          labelValue={password}
          onChangeText={(userPassword) => setPassword(userPassword)}
          placeholderText="Palavra Passe"
          iconType="lock-outline"
          secureTextEntry={true}
        />

        <FormInput
          labelValue={confirmPassword}
          onChangeText={(userPassword) => setConfirmPassword(userPassword)}
          onEndEditing={confirmarPassword}
          placeholderText="Confirmar Palavra Passe"
          iconType="lock-outline"
          secureTextEntry={true}
        />


        <FormButton
          buttonTitle="Registrar"
          onPress={() => {           
            if (firstName !== null && lastName !== null && email !== null && password !== null && image !== null) {
              register(email, password, firstName, lastName, image, expoPushToken)
            //uplodingPhotoProfile(image)

            } else {
              Alert.alert(
                "Existem Campos Vazios",
                'Por favor carrega a foto de perfil e preencha todos campos e tente novamente!'
              )
            }

          }}
        />

        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          style={{
            backgroundColor: '#ff3333',
            bottom: Platform.OS == 'ios' ? 0 : 5
          }}
          duration={3000}
        >
          {textError}
        </Snackbar>
        <View style={styles.textPrivate}>
          <Text style={[styles.color_textPrivate, { color: colors.text }]}>
            Ao fazer o registro você está de acordo com os nossos{' '}
          </Text>
          <TouchableOpacity onPress={() => alert('Terms Clicked!')}>
            <Text style={[styles.color_textPrivate, { color: colors.primary }]}>
              Termos de serviços
            </Text>
          </TouchableOpacity>
          <Text style={[styles.color_textPrivate, { color: colors.text }]}> e </Text>
          <Text style={[styles.color_textPrivate, { color: colors.primary }]}>
            Política de privacidade
          </Text>
        </View>

        <TouchableOpacity
          style={styles.forgotButton2}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.navButtonText}>
            Tela de Login!
          </Text>
        </TouchableOpacity>

        {bottonSheetForTakePhoto()}
      </View>
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    //backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    //fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
    marginBottom: 10,
  },
  forgotButton2: {
    marginVertical: 2,
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 20
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    //fontFamily: 'Lato-Regular',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    //fontFamily: 'Lato-Regular',
    color: 'grey',
  },
  commandButton: {
    left: 5
  },
});