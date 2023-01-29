import React, { useContext, useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet, Alert, TextInput, StatusBar, ImageBackground, Dimensions, Image } from 'react-native';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import { Avatar, Accessory } from 'react-native-elements'
import { Title, } from 'react-native-paper'
import { auth, db, storage } from '../services/firebase'
import { useTheme } from '@react-navigation/native'
import Spinner from 'react-native-loading-spinner-overlay';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker'
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'
import { AuthContext } from '../routes/AuthProvider';




const avatarIni = Platform.OS === 'ios' ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' : 'https://cdn.pixabay.com/photo/2017/03/24/06/49/camera-2170377_960_720.png'
const DocImageFunc = ({ route, navigation }) => {

  const theme = useTheme();
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false)
  const [imageFront, setImageFront] = useState(null)
  const [imageBack, setImageBack] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isActivated, setIsActivated] = useState(false)
  const [documentNumber, setDocumentNumber] = useState('')
  const [image, setImage] = useState(null)
  const [userPhotoVer, setUserPhotoVer] = useState('')
  const [hasPermission, setHasPermission] = useState(null);
  const [text, setText] = useState(null);
  const [type, setType] = useState('');
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.auto);
  let camera = Camera;
  const UidUser = auth.currentUser.uid




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
    //refRBSheetCurrentUser.current.close()

    if (!result.cancelled) {
      if (type === 'frontal') {
        setImageFront(result.uri)
        setImage(result.uri)
        updatePhotoProfile(result.uri)
      } else {
        setImageBack(result.uri)
        setImage(result.uri)
        updatePhotoProfile(result.uri)
      }
    }
  };


  useLayoutEffect(() => {
    takeUser()
  }, [])
  /***
   * Pegar dados do usuario
   */
  const takeUser = async () => {
    try {
      setIsLoading(true)
      await
        db.collection("UserVerifications").doc(UidUser)
          .get()
          .then((doc) => {
            setDocumentNumber(doc.data().docNumber)
          }).then(() => {
            setIsLoading(false)
          })
          .catch((error) => {
            alert('Problemas em carregar os dados, verifique a tua conexão, por favor');

          });

    } catch (error) {

    }
  }


  /**
   * para pegar a permisao de acesso a camera
   */
  useEffect(() => {(async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Yame precisa de acesso câmera para ler o  código</Text>;
  }
  if (hasPermission === false) {
    return <Text>Não existe acesso a câmera</Text>;
  }

  const fazerFotos = async () => {
    if (camera) {
      let photo = await camera.takePictureAsync();
      if (type === 'frontal') {
        setImageFront(photo.uri)
        setImage(photo.uri)
        //updatePhotoProfileFront(photo.uri)
      } else {
        setImageBack(photo.uri)
        setImage(photo.uri)
        //updatePhotoProfileBack(photo.uri)
      }

    }
  }

/**
     * 
     * @param {Updating Photo Verification} imageUpdating 
     * @returns 
     */
 const updatePhotoProfileFront = async (imageUpdating) => {
  var photoProfileUpdate = db.collection("UserVerifications").doc(UidUser);
  const uploadUri = imageUpdating;
  let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

  // Add timestamp to File Name
  const extension = filename.split('.').pop();
  const name = filename.split('.').slice(0, -1).join('.');
  filename = name + Date.now() + '.' + extension;

  const response = await fetch(uploadUri);
  const blob = await response.blob();
  var ref = storage.ref().child('photos/verications' + `${auth.currentUser.uid}` + '/' + 'verification' + `${filename}`);
  const snapshot = await ref.put(blob);
  let imgUrl = await snapshot.ref.getDownloadURL();

  // Set the "capital" field of the city 'DC'
  return photoProfileUpdate.update({
    docFrontalImage: imgUrl
  })
    .catch((error) => {
      alert('Temos probelmas em atualizar a foto, verifique a tua conexão, por favor');
    });
}

/**
     * 
     * @param {Updating Photo Verification} imageUpdating 
     * @returns 
     */
 const updatePhotoProfileBack = async (imageUpdating) => {
  var photoProfileUpdate = db.collection("UserVerifications").doc(UidUser);
  const uploadUri = imageUpdating;
  let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

  // Add timestamp to File Name
  const extension = filename.split('.').pop();
  const name = filename.split('.').slice(0, -1).join('.');
  filename = name + Date.now() + '.' + extension;

  const response = await fetch(uploadUri);
  const blob = await response.blob();
  var ref = storage.ref().child('photos/verications' + `${auth.currentUser.uid}` + '/' + 'verification' + `${filename}`);
  const snapshot = await ref.put(blob);
  let imgUrl = await snapshot.ref.getDownloadURL();

  // Set the "capital" field of the city 'DC'
  return photoProfileUpdate.update({
    docTraseiraImage: imgUrl
  })
    .catch((error) => {
      alert('Temos probelmas em atualizar a foto, verifique a tua conexão, por favor');
    });
}



 /**
  * 
  * @returns 
  */
  function renderImageBackground() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={colors.background} barStyle={theme.dark ? 'default' : 'dark-content'} />
        <ImageBackground source={{ uri: image }} resizeMode="cover" style={styles.image}>
          <View style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'flex-end', marginHorizontal: 10, marginVertical: 10 }}>
            <FormButton
              buttonTitle="CONTINUAR"
              onPress={() => {
                setIsActivated(false)

              }}
            />
            <FormButton
              buttonTitle="NOVA FOTO"
              onPress={() => {
                setImage(null)
                setText(null)
              }}
            />
          </View>
        </ImageBackground>
      </View>
    )

  }

  const cameraOPen = () => {
    return (
      image ? renderImageBackground() :
        <View style={styles.container2}>
          <Camera style={styles.camera} type={'back'}
            ref={ref => camera = ref}
            flashMode={flashMode}
          >
          </Camera>
          <View style={styles.cameraElements}>
            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', }}>

              <TouchableOpacity onPress={() => setIsActivated(false)}>
                <MaterialCommunityIcons name='close' color={colors.background} size={30} />
              </TouchableOpacity>
            </View>



            <View style={{ alignContent: 'flex-end', justifyContent: 'space-between', flexDirection: 'row' }}>
              <TouchableOpacity style={{ marginTop: 30 }} onPress={() => pickImage()}>
                <FontAwesome name='file-photo-o' color={colors.background} size={30} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => fazerFotos()}>
                <View style={{ width: 60, height: 60, backgroundColor: 'transparent', borderColor: 'white', borderRadius: 30, borderWidth: 4 }}></View>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginTop: 30 }} onPress={() => {
                setFlashMode(
                  flashMode === Camera.Constants.FlashMode.auto || Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.on ? Camera.Constants.FlashMode.off : Camera.Constants.FlashMode.auto
                );


              }}>
                <MaterialCommunityIcons name={flashMode === Camera.Constants.FlashMode.auto ? 'flash-auto' : flashMode === Camera.Constants.FlashMode.on ? 'flash' : 'flash-off'} color={colors.background} size={30} />
              </TouchableOpacity>

            </View>
          </View>
        </View>

    )
  }

  /**
   * Aqui comeca a renderiza;ao principal
   */
  return (
    isActivated ? cameraOPen() :
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar backgroundColor={colors.background} barStyle={theme.dark ? 'default' : 'dark-content'} />
        <View style={{ borderBottomWidth: 0.3, width: '100%', alignItems: 'center', marginBottom: 30 }}>
          <Spinner
            visible={isLoading}
            textContent={'Aguarde...'}
            textStyle={styles.spinnerTextStyle}
          />
          <Title style={{ color: colors.text, justifyContent: 'center', fontSize: 18, }}>Escaneie o documento, Por favor</Title>
        </View>

        <View style={{ backgroundColor: colors.background, borderColor: colors.primary, ...styles.input }}>
          <TextInput
            keyboardType='decimal-pad'
            style={{ padding: 10 }}
            editable={false}
            placeholder='Digite o valor'
            placeholderTextColor='grey'
            style={{ paddingHorizontal: 10, color: colors.text, fontSize: 18 }}
            value={'№: ' + documentNumber}
          >
          </TextInput>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 50 }}>

          <Avatar
            rounded={true}
            onPress={() => {
              setIsActivated(true)
              setType('frontal')
              setImage(null)
            }}
            containerStyle={{ marginVertical: 15, borderColor: colors.primary, borderWidth: 1 }}
            source={{
              uri: imageFront ? imageFront : 'https://cdn.pixabay.com/photo/2017/03/24/06/49/camera-2170377_960_720.png'
            }}
            size={120}
          >
            <Avatar.Accessory name={"plus"}
              style={{ borderWidth: 1, borderColor: '#80cbc4', backgroundColor: 'white' }}
              type="antdesign"
              size={30}

              color={'#80cbc4'}
              onPress={() => {
                setIsActivated(true)
                setType('frontal')
                setImage(null)
              }} />
          </Avatar>
          <Avatar
            rounded={true}
            onPress={() => {
              setIsActivated(true)
              setType('traseira')
              setImage(null)
            }}
            containerStyle={{ marginVertical: 15, borderColor: colors.primary, borderWidth: 1 }}
            source={{
              uri: imageBack ? imageBack : "https://cdn.pixabay.com/photo/2017/03/24/06/49/camera-2170377_960_720.png"
            }}
            size={120}
          >
            <Avatar.Accessory name={"plus"}
              style={{ borderWidth: 1, borderColor: '#80cbc4', backgroundColor: 'white' }}
              type="antdesign"
              size={30}

              color={'#80cbc4'}
              onPress={() => {
                setIsActivated(true)
                setType('traseira')
                setImage(null)

              }} />
          </Avatar>
        </View>
        <View style={{ marginLeft: 0, alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
          <Text style={{ fontSize: 18 }}>Parte Frontal</Text>
          <Text style={{ fontSize: 18 }}>Parte Traseira</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end', width: '90%', alignSelf: 'center', marginVertical: 20 }}>
          {imageBack && imageFront ? <FormButton
            buttonTitle="CONTINUAR"
            onPress={() => {
              navigation.navigate("doclVer")
              setIsActivated(false)

            }}
          /> : null}
          <FormButton
            buttonTitle="VOLTAR"
            onPress={() => {
              navigation.navigate("takePhoto")

            }}
          />
        </View>

      </View>

  );
};

export default DocImageFunc;

const styles = StyleSheet.create({
  container: {
    //backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'center',
    paddingHorizontal: 0,
    marginVertical: 20
  },
  text: {
    color: "white",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0"
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
  spinnerTextStyle: {
    color: '#FFF'
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
  input: {
    flexDirection: 'row',
    //backgroundColor: '#fff',
    borderWidth: 1,
    alignSelf: 'center',
    height: 45,
    width: '90%',
    borderRadius: 8,
    marginBottom: 15,

  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginVertical: 20
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'black',
    alignSelf: 'center'
  },
  camera: {
    position: 'absolute',
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  cameraElements: {
    zIndex: 2,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20
  },
  smartphoneImage: {
    width: 50,
    resizeMode: 'contain'
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  text2: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",

  },
  logo: {
    height: 50,
    width: 50,
    alignSelf: "center",
    resizeMode: 'cover',
  },
});