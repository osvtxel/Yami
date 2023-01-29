
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Image, StatusBar, ScrollView, Platform, StyleSheet, FlatList } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { FONTS, SIZE } from '../constant/themes'

import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome5, FontAwesome } from '@expo/vector-icons'
import { Button, ListItem, Overlay, Icon, Avatar as AvatarElemento } from 'react-native-elements'
import { auth, db } from '../services/firebase'

import NumberFormat from 'react-number-format';
import {
  Title,
  Caption,
  Paragraph,
  Drawer,
  Card,
  Snackbar,
  Avatar
} from 'react-native-paper';
import moment from 'moment'
import 'moment/locale/pt'



const headerCurr = Platform.OS === 'android' ? '-35%' : '-2%'
export default function NewSell({ navigation }) {

  const theme = useTheme();
  const { colors } = useTheme();
  const [limit, setLimit] = useState(5)
  const [listTakeVendas, setListTakeVendas] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [textSee, setTextSee] = useState("Ver detalhes");
  const UidUser = auth.currentUser.uid
  const [visible, setVisible] = useState(false);
  const [itemOne, setItemOne] = useState("")


  const toggleOverlay = () => {
    setVisible(!visible);
  };

  //UseEffect
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      takeSellsFromFirebase()

    })

    return unsubscribe;
  }, [navigation])


  const takeSellsFromFirebase = async () => {
    try {
      const vendasTodas = await db.collection("Users").doc(UidUser).collection("ComprasSolicitadas")
        .orderBy("dataPubl", "desc")
        .get()
        .then((querySnapshot) => {
          let temp = [];
          querySnapshot.forEach((doc) => {
            let SellDetails = {};
            SellDetails = doc.data();
            SellDetails['id'] = doc.id;
            temp.push(SellDetails);
            setListTakeVendas(temp)

            //pegar os gostos

            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", lastDoc);
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
      return () => vendasTodas();
    } catch (error) {

    }

  }

  /**
      * publicar as vendas
      * @param {*} props 
      */
  const confirmSell = async ({ id }) => {

    var ref = db.collection("Users").doc(UidUser).collection("ComprasEmCurso");

    try {
      await db.collection("Users").doc(id)
        .get()
        .then((doc) => {

          ref.add({
            firstName: doc.data().firstName,
            midleName: doc.data().midleName,
            lastname: doc.data().lastname,
            countryUser: doc.data().country,
            userUId: UidUser,
            dataPubl: data.dataPubl,
            isAccepted: false,
            imageUser: doc.data().userImg,
            formPagam: isDeposito ? " Deposito Bancario" : " Transferencia Bancaria",
            bancoSelecionado: isTransf ? bancoSelecionado : '',
            valorComprar: data.valorComprar,
            symbolosFrom: data.symboloFrom
          }).then(() => {
            setIsLoading(false)
            navigation.navigate('ViewHome')
          }
          ).catch((error) => {
            Alert.alert(
              "Ocorreu um erro",
              'Por favor volte a tentar dentro de alguns minutos ou entre em contacto com a nossa equipa!'
            )
          })
        })
        .catch((error) => {
          Alert.alert(
            "Erro de rede",
            'Erro de conexao! Verifica a tua internet!'
          )
        });
    } catch (error) {

    }
  }

  /**
   * funcao responsavel por pelo design da parte de cima
   */
  function renderHeader() {
    return (
      <View>
        <LinearGradient
          colors={['#00B4DB', '#0083B0']}
          style={styles.background2}

        >


          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: (Platform.OS === 'ios') ? 13 : 18
            }}
          >

            <Text style={{ color: 'white', ...FONTS.h2 }}>$ 784.00</Text>
            <Text style={{ color: 'white', ...FONTS.body5 }}>Atualizado: 12-09-2021</Text>
          </View>

          {/**Header Bar */}
          <View style={{
            position: 'absolute',
            bottom: headerCurr
          }}>
            <FlatList
              contentContainerStyle={{ marginTop: 8 }}
              data={listTakeVendas}
              renderItem={renderItem}
              horizontal
              showsHorizontalScrollIndicator={false}
            />

          </View>
        </LinearGradient>
      </View>
    )
  }




  /***
   * 
   * 
   */
  const Overflay = () => {
    return (
      <View>
        <Overlay overlayStyle={{ borderRadius: 12 }} isVisible={visible} onBackdropPress={toggleOverlay}>
          <Text style={styles.textPrimary}>Detalhes da Solicitação!</Text>
          <View>
            <AvatarElemento
              rounded={true}
              containerStyle={{
                marginBottom: 10, borderWidth: 2,
                borderColor: colors.primary,
                alignSelf: 'center'
              }}
              source={{
                uri: itemOne.imageUser ? itemOne.imageUser : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
              }}
              size={110}
            >
            </AvatarElemento>
            <Text style={styles.textSecondary}>Nome do Comprador: {itemOne.firstName + " " + itemOne.midleName + " " + itemOne.lastname}</Text>
            <Text style={styles.textSecondary}>Residência Atual: {itemOne.countryUser + ", " + "Golf 2"}</Text>
            <NumberFormat renderText={text => <Text style={{ fontSize: 17, marginVertical: 2, marginBottom: 10, color: colors.text }}>Quantidade: {text}</Text>} value={itemOne.valorComprar}
              displayType={'text'} thousandSeparator={/*thousandSeparator*/" "} decimalSeparator={'.'} prefix={itemOne.symbolosFrom + ' '} />
            <Text style={styles.textSecondary}>Metódo de Pagamento: {itemOne.formPagam}</Text>
            {itemOne.formPagam === " Transferencia Bancaria" ? <Text style={styles.textSecondary}>Banco de Origem: {itemOne.bancoSelecionado}</Text> : null}
          </View>

          <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button
              onPress={() => {

                toggleOverlay()
              }}
              containerStyle={{ width: 200, marginRight: 10 }}
              buttonStyle={{ backgroundColor: 'rgba(127, 220, 103, 1)', borderRadius: 12, }}
              icon={
                <FontAwesome5 style={{ marginRight: 10 }} name="hands-helping" size={20} color='white' />
              }

              title="VENDER"
            //loading={isLoading}

            />
            <Button
              onPress={() => console.warn('Maluco')}
              titleStyle={{ color: 'rgba(78, 116, 289, 1)' }}
              type='outline'
              buttonStyle={{
                //backgroundColor: 'rgba(92, 99,216, 1)',
                //borderColor: 'transparent',
                //borderWidth: 0,
                borderRadius: 12,
              }}
              icon={
                <MaterialCommunityIcons name="account-outline" size={20} color='rgba(78, 116, 289, 1)' />
              }

              title="VER PERFIL"
            //loading={isLoading}
            />
          </View>
        </Overlay>
      </View>

    )
  }

  const renderSell = () => {

    const renderItem = ({ item, index }) => (
      <View style={{
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 2 : 15,
        marginHorizontal: 2,
        padding: 10,
        //borderRadius: 12,
        backgroundColor: colors.background,
        borderColor: colors.primary,
        paddingVertical: 10,
        marginVertical: 0,
        //shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 1,
        shadowOpacity: 0.4,
        elevation: 2,
        zIndex: 1,

      }}>

        <View style={{ flexDirection: "column", justifyContent: 'space-between', width: '100%' }}>
          <View style={{ flex: 1, flexDirection: 'row', marginBottom: 15 }}>
            <Avatar.Image
              rounded={true}
              containerStyle={{
                marginBottom: 0, borderWidth: 1,
                borderColor: colors.card,
              }}
              source={{
                uri: item.imageUser ? item.imageUser : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
              }}
              size={50}
            >
            </Avatar.Image>
            <View style={{ flexDirection: 'column', marginHorizontal: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text }}>{item.firstName + ' ' + item.midleName + ' ' + item.lastname}</Text>
              <Caption>{moment(item.dataPubl).locale('pt').fromNow(false) + " • " + item.countryUser}</Caption>

            </View>

          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <View style={{ backgroundColor: colors.background, ...styles.viewValor }}>
              <View style={{ flexDirection: 'column', alignContent: 'center', marginVertical: 10 }}>

                <NumberFormat renderText={text => <Text style={{ marginLeft: 8, alignSelf: 'center', fontWeight: 'bold', fontSize: 25, marginTop: 2, color: colors.text }}>{text}</Text>} value={item.valorComprar}
                  displayType={'text'} thousandSeparator={/*thousandSeparator*/" "} decimalSeparator={','} prefix={item.symbolosFrom + ' '} />

              </View>

            </View>

          </View>

          <View style={{ flexDirection: 'row' }}>
            <MaterialIcons
              name={"unfold-more"}
              color={colors.primary}
              size={20} />
            <TouchableOpacity key={index} onPress={() => {
              setItemOne(item)
              toggleOverlay()
            }}>
              <Text style={{ color: colors.primary, borderBottomWidth: 0.5, borderBottomColor: colors.primary }}>{"Ver detalhes"}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button
              onPress={() => {
                setItemOne(item)
                toggleOverlay()
              }}
              containerStyle={{ width: 250, marginRight: 15 }}
              buttonStyle={{ backgroundColor: 'rgba(127, 220, 103, 1)', borderRadius: 12, }}
              icon={
                <FontAwesome5 style={{ marginRight: 10 }} name="hands-helping" size={20} color='white' />
              }

              title="VENDER"
            //loading={isLoading}

            />
            <Button
              onPress={() => console.warn('Maluco')}
              titleStyle={{ color: 'rgba(214, 61, 57, 1)' }}
              type='outline'
              buttonStyle={{
                //backgroundColor: 'rgba(92, 99,216, 1)',
                borderColor: 'rgba(214, 61, 57, 1)',
                //borderWidth: 0,
                borderRadius: 12,
              }}
              icon={
                <MaterialCommunityIcons name="close" size={20} color='rgba(214, 61, 57, 1)' />
              }

              title="RECUSAR"
            //loading={isLoading}
            />
          </View>
        </View>
      </View>
    )
    return (
      <>
        {Overflay()}
        {renderSell()}
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={listTakeVendas}
          renderItem={renderItem}
        />
      </>

    )

  }
  return (
    <View style={{ flex: 1, backgroundColor: colors.card }}>
      <StatusBar backgroundColor="#00B4DB" barStyle="dark-content" />
      {renderHeader()}
      

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    right: 0,
    bottom: 0,
    //backgroundColor: colors.white,
  },
  background: {
    //backgroundColor: colors.themeColor,
    height: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 3,
    shadowRadius: 2,
    elevation: 2
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  background2: {
    //backgroundColor: colors.white,
    height: 140,

  },

  panelTitle: {
    //color: colors.themeColor,
    fontSize: 18,
    height: 30,

  },
  textPrimary: {
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textSecondary: {
    marginBottom: 10,
    fontSize: 17,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    marginTop: 10,
    //backgroundColor: colors.themeColor,
    alignItems: 'center',
    marginVertical: 7,
  },
  viewValor: {
    width: '100%',
    height: 60,
    borderRadius: 12,
    marginBottom: 15,
    //backgroundColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    elevation: 5,
  },
  imageStyleCard: {
    height: 25,
    width: 25,
    resizeMode: 'stretch',

  },
})