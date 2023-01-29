import React, { useState, useRef, useEffect } from "react";
import { Text,TouchableWithoutFeedback, ScrollView, Alert,KeyboardAvoidingView, Image, View, StyleSheet, SafeAreaView,Keyboard, TouchableOpacity, TextInput, Platform, StatusBar } from 'react-native'
import { MaterialIcons, Ionicons, MaterialCommunityIcons, FontAwesome, SimpleLineIcons, AntDesign } from '@expo/vector-icons'
import { FONTS, SIZE } from '../constant/themes'
import { auth, db, storage } from '../services/firebase'
import { Button, CheckBox } from 'react-native-elements'
import { useTheme } from '@react-navigation/native'
import OptionComponent from '../components/OptionComponent/index';
import SelectEditProfile from '../components/SelectEditProfile/index';
import Countries from "../data/Countries";




export default function EditProfile({ navigation }) {

  const [isLoading, setIsLoading] = useState(false)
  const { colors } = useTheme();
  const [countries, setCountries] = useState(Countries)
  const [checkedStudent, setCheckedStudent] = useState(false)
  const [checkedWorkers, setCheckedWorkers] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [address, setAddress] = useState(null)
  const UidUser = auth.currentUser.uid
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

  });


  useEffect(() => {
    takeUserFromFirebase()
  }, [])

  /***
   * Pegar as vendas todas
   */
  const takeUserFromFirebase = async () => {
    try {
      await db.collection("Users").doc(UidUser)
        .get()
        .then((doc) => {
          setData({
            ...data,
            firstNome: doc.data().firstName,
            midleNome: doc.data().midleName,
            lastNome: doc.data().lastname,
            email: doc.data().email,
            phoneCode: doc.data().phoneCode,
            telefone: doc.data().telefone,
            address: doc.data().address,
            profissao: doc.data().profissao,
            localTrabalho: doc.data().localTrabalho,
            city: doc.data().city,
            country: doc.data().country,
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

  /**
    * 
    * @param {Updating Data users} imageUpdating 
    * @returns 
    */
  const updateDataUsers = () => {
      setIsLoading(true)
      var ProfileUpdate = db.collection("Users").doc(UidUser);
      // Set the "capital" field of the city 'DC'
      return ProfileUpdate.update({
        firstName: data.firstNome,
        midleName: data.midleNome,
        lastname: data.lastNome,
        phoneCode: data.phoneCode,
        telefone: data.telefone,
        email: data.email,
        profissao: data.profissao,
        localTrabalho: data.localTrabalho,
        country: data.country,
        city: data.city,
        address: data.address
      })
        .then(() => {
          navigation.replace("profileScreen")
          setIsLoading(false)
        })
        .catch((error) => {
          onToggleSnackBar(),
            setTextError("Erro ao atualizar os dados!")
        });
  }

  return (
    <ScrollView style={{flex:1}}>
      <View style={{
        flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10,
        paddingTop: 10, 
      }}>
        <StatusBar backgroundColor="#00B4DB" barStyle="default" />
        <View style={{ borderColor: colors.border, ...styles.action }}>
          <MaterialCommunityIcons name="account-tie-outline" color={colors.text} size={20} />
          <TextInput
            placeholder="Primeiro Nome"
            defaultValue={data.firstNome}
            autoCapitalize="sentences"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            onChangeText={(val) => setData({
              ...data,
              firstNome: val
            })}
          />
        </View>
        <View style={{ borderColor: colors.border, ...styles.action }}>
          <MaterialCommunityIcons name="account-tie-outline" color={colors.text} size={20} />
          <TextInput
            placeholder="Nome do meio"
            defaultValue={data.midleNome}
            autoCapitalize="sentences"
            placeholderTextColor="#666666"
            keyboardType='default'
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            onChangeText={(val) => setData({
              ...data,
              midleNome: val
            })}
          />
        </View>
        <View style={{ borderColor: colors.border, ...styles.action }}>
          <MaterialCommunityIcons name="account-tie-outline" color={colors.text} size={20} />
          <TextInput
            placeholder="Sobrenome"
            defaultValue={data.lastNome}
            autoCapitalize="sentences"
            placeholderTextColor="#666666"
            keyboardType='default'
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            onChangeText={(val) => setData({
              ...data,
              lastNome: val
            })}
          />
        </View>
        <View style={{ borderColor: colors.border, ...styles.action }}>
          <MaterialCommunityIcons name="email-outline" color={colors.text} size={20} />
          <TextInput
            placeholder="E-mail"
            placeholderTextColor="#666666"
            defaultValue={data.email}
            keyboardType="email-address"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            onChangeText={(val) => setData({
              ...data,
              email: val
            })}
          />
        </View>
        <SafeAreaView style={{ marginLeft: 10, width: '100%' }}>
          <SelectEditProfile
            optins={countries}
            onChangeSelect={(id, name, postalCode) => {
              setData({
                ...data,
                country: name,
                phoneCode: postalCode,

              });
              console.log(postalCode)
              //setIndexTake(id);

            }}
            text='Selecione o País'
            OptionComponent={OptionComponent}
          />
        </SafeAreaView>
        <View style={{ borderColor: colors.border, ...styles.action }}>
          <MaterialCommunityIcons name="phone" color={colors.text} size={20} />
          {data.phoneCode ? <Text style={{ marginLeft: 10, marginVertical:2 }}>{data.phoneCode}</Text> : null}
          <TextInput
            placeholder="Digite o numero de telefone"
            placeholderTextColor="#666666"
            keyboardType="number-pad"
            defaultValue={data.telefone}
            value={data.telefone}
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            onChangeText={(val) => setData({
              ...data,
              telefone: val
            })}
          />
        </View>
        <View style={{ borderColor: colors.border, ...styles.action }}>
          <MaterialCommunityIcons name="home-city-outline" color={colors.text} size={20} />
          <TextInput
            placeholder="Cidade Atual"
            placeholderTextColor="#666666"
            autoCapitalize="sentences"
            defaultValue={data.city}
            keyboardType='default'
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            onChangeText={(val) => setData({
              ...data,
              city: val
            })}
          />
        </View>
        <KeyboardAvoidingView 
          behavior={Platform.OS ==='ios' ? 'padding' : 'height'}
          style={{flex:1}}
        >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ borderColor: colors.border, ...styles.action }}>
          <MaterialCommunityIcons name="map-marker-outline" color={colors.text} size={20} />
          <TextInput
            placeholder="Rua e o Codigo Postal"
            defaultValue={data.address}
            autoCapitalize="sentences"
            placeholderTextColor="#666666"
            keyboardType='default'
            autoCorrect={true}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            onChangeText={(val) => setData({
              ...data,
              address: val
            })}
          />
        </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        <View style={{ backgroundColor: colors.background, ...styles.action2 }}>
          <CheckBox
            title='Estudante / Trabalhador'
            checked={checkedStudent}
            containerStyle={{ backgroundColor: colors.background }}
            textStyle={{ color: colors.text }}
            onPress={() => {
              checkedWorkers ? setCheckedWorkers(!checkedWorkers) & setCheckedStudent(!checkedStudent) & setData({ ...data, profissao: 'Estudante' }) : setCheckedStudent(!checkedStudent),
                console.log(data.profissao)
            }}
          />

          <CheckBox

            title='Não Estuda / Não Trabalha'

            containerStyle={{ backgroundColor: colors.background }}
            checked={checkedWorkers}
            textStyle={{ color: colors.text }}
            onPress={() => {
              checkedStudent ? setCheckedStudent(!checkedStudent) & setCheckedWorkers(!checkedWorkers) : setCheckedWorkers(!checkedWorkers),
                console.log(data.profissao)
            }}
          />
        </View>

        {checkedStudent ? <View style={{ borderColor: colors.border, ...styles.action }}>
          <MaterialIcons name="home-work" color={colors.text} size={20} />
          <TextInput
            placeholder="Local de Trabalho/Universidade"
            defaultValue={data.localTrabalho}
            autoCapitalize="sentences"
            keyboardType='default'
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            onChangeText={(val) => setData({
              ...data,
              localTrabalho: val
            })}
          />
        </View> : null}
        <View style={{ marginLeft: 10, width: '100%', marginTop: 10 }}>
          <Button
            onPress={updateDataUsers}
            icon={
              <Ionicons style={{ marginRight: 5 }} name="checkmark-done-circle-outline" size={25} color="white" />
            }

            title="Guardar"
            loading={isLoading}
            containerStyle={{ borderRadius: 10, borderColor: colors.primary }}
          />

        </View>

      </View>

    </ScrollView>
  );
}


const styles = StyleSheet.create({
  inputStyle: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: 20,
    marginTop: 10
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 15,
    marginTop: 3,
    fontWeight: 'normal',
    //color: colors.themeColor
  },
  btnSubmit: {
    flex: 1,
    //backgroundColor: colors.themeColor,
    width: '90%',
    height: 40,
    marginTop: 5,
    marginBottom: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 7
  },
  textInput: {
    //flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -5,
    paddingLeft: 10,
    color: '#666666',
  },
  action: {
    flex:1,
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
    borderBottomWidth: 1,
    padding: 16,
    width: '100%'
  },
  action2: {
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    paddingBottom: 5,
    width: '100%'
  },

})