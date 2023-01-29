import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, Text, Image, Alert, SafeAreaView, TextInput, TouchableWithoutFeedback, StatusBar, Keyboard } from 'react-native';
import { useTheme } from '@react-navigation/native'
import FormButton from "../components/FormButton";
import Countries from "../data/Countries";
import { windowHeight, windowWidth } from '../util/Dimentions';
import { auth, db, storage } from '../services/firebase'
import OptionComponent from '../components/OptionComponent/index';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import SelectEditProfile from '../components/SelectEditProfile/index';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'
import { Title } from "react-native-paper";





const TakeDocument = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [countries, setCountries] = useState(Countries)
  const [sucessMsg, setSucessMsg] = useState(false)
  const [sucessMsgTel, setSucessMsgTel] = useState('')
  const [maxLenght, setMaxLenght] = useState(0)
  const [maxLenght2, setMaxLenght2] = useState(0)
  const [selectedDocumet, setSelectedDocument] = useState(null);
  const [data, setData] = useState({
    code: '',
    name: '',
    telefone: '',
  })
  const [nameDocumet, setNameDocument] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [placeholder, setPlaceholder] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEnded, setIsEnded] = useState(false)
  const theme = useTheme();
  const { colors } = useTheme();
  const UidUser = auth.currentUser.uid

  /**
   * 
   * @param {*} bIndetidade 
   */
  async function verificarDocumentosBI(bIndetidade) {
    try {
      setIsLoading(true)
      const result = await axios.get('https://angolaapi.herokuapp.com/api/v1/validate/bi/' + `${bIndetidade}`);
      setSucessMsg(true)
      setIsLoading(false)

    } catch (error) {
      setSucessMsg(false)
      setIsLoading(false)
      alert("Número do BI inválido!")

    }


  }
  /**
   * 
   * @param {*} passaporte 
   */
  async function verificarDocumentosPassaport(passaporte) {
    try {
      setIsLoading(true)
      const result = await axios.get('https://angolaapi.herokuapp.com/api/v1/validate/passport/' + `${passaporte}`);
      setSucessMsg(true)
      setIsLoading(false)
    } catch (error) {
      setSucessMsg(false)
      setIsLoading(false)
      alert("Número do Passaporte inválido!")
    }
  }

  /***
   * Atualizar
   */
  const updateUserVer = () => {
    var ProfileUpdate = db.collection("UserVerifications").doc(UidUser);
    return ProfileUpdate.update({
      presentCountry: selectedCountry,
      docNumber: documentType,
      docType: nameDocumet,
      phoneCode: data.code
    })

  }
  /***
   * Atualizar
   */
  const updateUser = () => {
    var ProfileUpdate = db.collection("Users").doc(UidUser);
    return ProfileUpdate.update({
      country: selectedCountry,
     
    })

  }


  /**
   * return principal
   */
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ backgroundColor: colors.background, ...styles.container }}>
        <StatusBar backgroundColor={colors.background} barStyle={theme.dark ? 'default' : 'dark-content'} />
        <Spinner
          visible={isLoading}
          textContent={'Aguarde...'}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={{ borderBottomWidth: 0.5, width: '100%', alignItems: 'center', marginBottom: 20 }}>
          <Title style={{ color: colors.text, justifyContent: 'center', fontSize: 18, }}>Documento Pessoal</Title>
        </View>
        <SafeAreaView style={{ marginLeft: 0, width: '100%', paddingHorizontal: 20, marginBottom: 35 }}>
          <Text style={{ color: colors.text, alignSelf: 'flex-start', fontSize: 16 }}>País atual</Text>
          <SelectEditProfile
            optins={countries}
            onChangeSelect={(id, name, code) => {
              setSelectedCountry(name)
              setData({
                ...data,
                code: code,
                name: name
              })
              if (name === 'Angola') {
                setPlaceholder('Ex: 002300295LS012')
                setNameDocument('BI')
                setMaxLenght(14)
                setMaxLenght2(9)
              } else {
                setPlaceholder('Ex: N1324567')
                setNameDocument('Passaporte')
                setMaxLenght(8)
                setMaxLenght2(11)
              }

            }}
            text='Selecione o País'
            OptionComponent={OptionComponent}
          />
        </SafeAreaView>


        {selectedCountry ? <Text style={{ color: colors.text, alignSelf: 'flex-start', fontSize: 16, paddingHorizontal: 20 }}>{'Por favor digite o número do ' + nameDocumet}</Text> : null}
        {selectedCountry ? <View style={{ borderColor: colors.primary, ...styles.action }}>
          <FontAwesome name="id-card-o" color={colors.text} size={20} />
          <TextInput
            placeholder={placeholder}
            placeholderTextColor="#666666"
            keyboardType="default"
            maxLength={maxLenght}
            onBlur={() => nameDocumet === 'BI' ? verificarDocumentosBI(documentType) : verificarDocumentosPassaport(documentType)}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            onChangeText={(val) => setDocumentType(val)}
          />
        </View> : null}



        <View style={{ flex: 1, justifyContent: 'flex-end', width: '100%', marginVertical: 20, paddingHorizontal: 20 }}>

          {selectedCountry === 'Angola' ? documentType.length === 14 && sucessMsg ? <FormButton
            buttonTitle="CONTINUAR"
            onPress={() => {

              if (verificarDocumentosBI(documentType)) {
                navigation.navigate("takePhoto")
                updateUser()
                updateUserVer()
              } else {
                console.log('yh nao deu')
              }
            }}
          /> : null : documentType.length === 8 && sucessMsg ? <FormButton
            buttonTitle="CONTINUAR"
            onPress={() => {

              if (verificarDocumentosPassaport(documentType)) {
                navigation.navigate("takePhoto")
                updateUser()
                updateUserVer()
              } else {
                console.log('Passaporte invalido')
              }
            }}
          /> : null}
          <FormButton
            buttonTitle="CANCELAR"
            onPress={() => {
              navigation.navigate("ViewHome")


            }}
          />
        </View>
      </View>

    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    //backgroundColor: '#f9fafd',
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20
  },
  text: {
    //fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 18,
    marginBottom: 10,
    marginTop: 5,
    alignSelf: 'flex-start',
    color: '#051d5f',
    paddingHorizontal: 20,
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
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    //fontFamily: 'Lato-Regular',
  },

  textInput: {
    //flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -5,
    paddingLeft: 0,
    paddingBottom: 10,
    color: '#666666',
    marginLeft: 10,


  },
  action: {

    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 35,
    marginLeft: 0,
    borderBottomWidth: 1,
    width: '90%',

  },
  signIn: {
    width: '100%',
    height: windowHeight / 15,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
});
export default TakeDocument;