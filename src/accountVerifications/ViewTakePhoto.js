
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet, Alert, ImageBackground, Dimensions } from 'react-native';
import FormButton from '../components/FormButton';
import { Avatar, Accessory } from 'react-native-elements'
import { Title, } from 'react-native-paper'
import { useTheme } from '@react-navigation/native'
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector'
import CameraOverlay from '../components/CameraOverflow';
import { auth, db, storage } from '../services/firebase'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import Spinner from 'react-native-loading-spinner-overlay';




const avatarIni = Platform.OS === 'ios' ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' : 'https://cdn.pixabay.com/photo/2017/03/24/06/49/camera-2170377_960_720.png'
const TakePhotoScreen = ({ route, navigation }) => {

  const refRBSheetCurrentUser = useRef();
  const theme = useTheme();
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isDetected, setIsDetected] = useState(false)
  const [isActivated, setIsActivated] = useState(false)
  const UidUser = auth.currentUser.uid
  const [hasPermission, setHasPermission] = useState(null);
  const [faceDetected, setFaceDetected] = useState([]);
  const [image, setImage] = useState(null)
  const [text, setText] = useState(null)
  const [textActivated, setTextActivated] = useState(true)
  let camera = Camera;

  useEffect(() => {
    userMessage()
  }, []);

  const userMessage = ()=>{ setTimeout(() => {
    setTextActivated(false)
  }, 6000);
}

  useEffect(() => {
    (async () => {
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

  /**
     * 
     * @param {Updating Photo Verification} imageUpdating 
     * @returns 
     */
  const updatePhotoProfile = async (imageUpdating) => {
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
      userPhotoVerication: imgUrl
    })
      .catch((error) => {
        alert('Temos probelmas em atualizar a foto, verifique a tua conexão, por favor');
      });
  }

  const fazerFotos = async () => {
    if (camera) {
      let photo = await camera.takePictureAsync();
      setImage(photo.uri)
      updatePhotoProfile(photo.uri)
    }
  }
  const handleFacesDetected = ({ faces }) => {
    if (faces.length > 0) {
      setFaceDetected(faces)
      faces.map(face => {
        console.log(face.yawAngle)
        console.log("roll=" + face.rollAngle)
        if (face.yawAngle >= -5 && face.rollAngle >= -1) {
          setIsDetected(true)
          userMessage()
        } else if (face.yawAngle < -5 || face.rollAngle < -1) {
          setTextActivated(true)
        }

      })
    } else {
      setIsDetected(false)
      setTextActivated(true)
      console.log('No face Detected')
    }

  };

  function renderImageBackground() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={colors.background} barStyle={theme.dark ? 'default' : 'dark-content'} />
        <ImageBackground source={{ uri: image }} resizeMode="cover" style={styles.image}>
          <View style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'flex-end', marginHorizontal: 10, marginVertical: 10 }}>
            <FormButton
              buttonTitle="CONTINUAR"
              onPress={() => setIsActivated(false)}
            />
            <FormButton
              buttonTitle="NOVA FOTO"
              onPress={() => {
                setImage(null)

              }}
            />
          </View>
        </ImageBackground>
      </View>
    )

  }
  const faceDetetorFucn = () => {
    return (
      image ? renderImageBackground() :
        <View style={styles.container2}>
          <Camera style={styles.camera} type={Camera.Constants.Type.front}
            ref={ref => camera = ref}
            onFacesDetected={handleFacesDetected}
            faceDetectorSettings={{
              mode: FaceDetector.Constants.Mode.fast,
              detectLandmarks: FaceDetector.Constants.Landmarks.none,
              runClassifications: FaceDetector.Constants.Classifications.all,
              minDetectionInterval: 1000,
              tracking: true,
            }}

          >
          </Camera>
          <CameraOverlay conditions={'tela2'} />
          <View style={styles.cameraElements}>
            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', }}>

              <TouchableOpacity onPress={() => setIsActivated(false)}>
                <MaterialCommunityIcons name='close' color={'white'} size={30} />
              </TouchableOpacity>
            </View>
           
            {isDetected ? <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => fazerFotos()}>
                <View style={{ width: 60, height: 60, backgroundColor: 'transparent', borderColor: 'white', borderRadius: 30, borderWidth: 4 }}></View>
              </TouchableOpacity>
            </View> : null}
            
          </View>
          {textActivated ? <View style={{flex:1, alignContent: 'center',justifyContent: 'center',alignSelf:'center', flexDirection: 'row', position:'absolute' }}>
              <Title style={{fontSize:30, color:'#b61827', fontWeight:'bold'}}>Centralize o rosto!</Title>
            </View>: null}
        </View>
    )

  };


  /**
   * Aqui comeca a renderiza;ao principal
   */
  return (
    isActivated ? faceDetetorFucn() :
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Spinner
          visible={isLoading}
          textContent={'Aguarde...'}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={{ borderBottomWidth: 0.5, width: '100%', alignItems: 'center', marginBottom: 30 }}>
          <Title style={{ color: colors.text, justifyContent: 'center', fontSize: 18, }}>Faça uma Selfie, Por favor</Title>
        </View>
        <Avatar
          rounded={true}

          onPress={() => {
            setImage(null)
            setIsActivated(true)
          }}
          containerStyle={{ marginVertical: 15, borderColor: colors.primary, borderWidth: 1 }}
          source={{
            uri: image ? image : "https://cdn.pixabay.com/photo/2017/03/24/06/49/camera-2170377_960_720.png"
          }}
          size={120}
        >
          <Avatar.Accessory name={image ? "edit" : "plus"}
            style={{ borderWidth: 1, borderColor: '#80cbc4', backgroundColor: 'white' }}
            type="antdesign"
            size={30}

            color={'#80cbc4'}
            onPress={() => {
              setImage(null)
              setIsActivated(true)
            }} />
        </Avatar>

        <View style={{ flex: 1, justifyContent: 'flex-end', width: '100%', marginVertical: 20, paddingHorizontal: 20, }}>
          {image ? <FormButton
            buttonTitle="CONTINUAR"
            onPress={() => {
              navigation.navigate("imageDocument")
            }}
          /> : null}
          <FormButton
            buttonTitle="VOLTAR"
            onPress={() => {
              navigation.navigate("biPassport")

            }}
          />
        </View>

      </View>

  );
};

export default TakePhotoScreen;

const styles = StyleSheet.create({
  container: {
    //backgroundColor: '#f9fafd',
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
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
  spinnerTextStyle: {
    color: '#FFF'
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

  }
});