
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet, Alert, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import { auth, db, storage } from '../services/firebase'
import { Title, } from 'react-native-paper'
import { useTheme } from '@react-navigation/native'
import Spinner from 'react-native-loading-spinner-overlay';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'
import { AuthContext } from '../routes/AuthProvider';
import { ScrollView } from 'react-native-gesture-handler';



const DocVerifications = ({ navigation }) => {

  const refRBSheetCurrentUser = useRef();
  const theme = useTheme();
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false)
  const [documentNumber, setDocumentNumber] = useState('')
  const [documentName, setDocumentName] = useState('')
  const [isOld, setIsOld] = useState(false)
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [data, setData] = useState({
    telefone: '',
    nomeCompleto: '',
    dataNascimento: '',
    localNascimento: '',
    nacionalidade: ''
  })
  const UidUser = auth.currentUser.uid


  useEffect(() => {
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
            setDocumentName(doc.data().docType)
          }).then(() => {
            setIsLoading(false)
          })
          .catch((error) => {
            alert('Problemas em carregar os dados, verifique a tua conexão, por favor');

          });

    } catch (error) {

    }
  }

  /***
   * Atualizar
   */
  const updateUser = () => {
    var ProfileUpdate = db.collection("UserVerifications").doc(UidUser);
    return ProfileUpdate.update({
      fullNameUser: data.nomeCompleto,
      placeBirth: data.localNascimento,
      dateBirth: data.dataNascimento,
    })

  }
  const showMsgIsNotOld = () => {
    Alert.alert(
      "Menor de Idade",
      'Lamentamos, não tem idade requerida pelos termos da aplicação para utilizar os nossos serviços!'
    )
  };

  /***
   * 
   */
   const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
 
  const handleConfirm = (date) => {
    console.log("A date has been picked: ", date);
    const newDate= new Date();
    hideDatePicker();
    setData({
      ...data,
      dataNascimento:date.getDate().toString().padStart(2, '0') + '/' + (date.getMonth()+1).toString().padStart(2,'0') + '/' + date.getFullYear()
    })
    const value = newDate.getFullYear() -  date.getFullYear()
      value >= 17 ? setIsOld(true) : setIsOld(false)
  };

   const DatePicker = () => {  
   
    return (
      <View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          locale='pt_BR'
          date={new Date}
          confirmTextIOS='Confirmar'
          cancelTextIOS='Cancelar'
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
    );
  };


  /**
   * Aqui comeca a renderiza;ao principal
   */
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView style={{flex:1}}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Spinner
          visible={isLoading}
          textContent={'Aguarde...'}
          textStyle={styles.spinnerTextStyle}
        />
       
        <View style={{ borderBottomWidth: 0.5, width: '100%', alignItems: 'center', marginBottom: 30 }}>
          <Title style={{ color: colors.text, justifyContent: 'center', fontSize: 18, }}>{'Validação do documento nº ' + documentNumber} </Title>
          <Text style={{color:colors.text, marginHorizontal: 10, alignSelf: 'center' }}>{'Por favor insira os dados conforme escritos no teu'}</Text>
          <Text style={{color:colors.text, marginHorizontal: 10, alignSelf: 'center' }}>{documentName + ' nº ' + documentNumber}</Text>
        </View>

        <View style={{ padding: 10 }}>
          <FormInput
            labelValue={"Nacionalidade: Angolana"}
            placeholderText="Nacionalidade"
            iconType="earth"
            editable={false}
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect={false}
          />
          <FormInput
            labelValue={data.nomeCompleto}
            placeholderText="Digite o nome completo"
            iconType="account-tie-outline"
            autoFocus={true}
            onChangeText={(fName) => setData({
              ...data,
              nomeCompleto: fName
            })}
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect={false}
          />
          <FormInput
            labelValue={data.localNascimento}
            placeholderText="Digite o local de nascimento"
            iconType="city"
            onChangeText={(lNasc) => setData({
              ...data,
              localNascimento: lNasc
            })}
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect={false}
          />
          <FormInput
            labelValue={data.dataNascimento}
            placeholderText="Digite a data de nascimento"
            iconType={ data.dataNascimento ? 'calendar-edit' : "calendar-month"}
            onPress={showDatePicker}
            keyboardType="numbers-and-punctuation"
            autoCapitalize="sentences"
            autoCorrect={false}
          />

        </View>

        <View style={{justifyContent: 'flex-end', width: '90%', marginTop:120 }}>
           {data.nomeCompleto && data.localNascimento && data.dataNascimento ? <FormButton
            buttonTitle="CONTINUAR"
            onPress={isOld ? () => {
                navigation.navigate("phoneVer")
              updateUser()
               
            } : () => {showMsgIsNotOld()}}
          /> : null}
          <FormButton
            buttonTitle="VOLTAR"
            onPress={() => {
              navigation.navigate("imageDocument")
            }}
          />
        </View>
            {DatePicker()}
      </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default DocVerifications;

const styles = StyleSheet.create({
  container: {
    //backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
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
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -5,
    paddingLeft: 10,
    color: '#666666',
  },
  action: {
    //flex: 1,
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingHorizontal: 0,
    width: '83%'
  }
});