
import React, { createRef, useContext, useState, useRef, useEffect } from 'react'
import { Alert, FlatList, Image, View, StyleSheet, Text, TouchableOpacity, TextInput, StatusBar, Platform, SafeAreaView } from 'react-native'
import { useTheme } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler'
import { LinearGradient } from 'expo-linear-gradient';
import MoedaList from '../data/ListaMoedas'
import MoedaList2 from '../data/ListaMoedasInvertida'
import { FONTS, SIZE } from '../constant/themes'
import ListCurrency from '../data/ListCurrencyBank'
import { Button, ListItem, Avatar } from 'react-native-elements'
import { Snackbar } from 'react-native-paper'
import Swiper from 'react-native-swiper';
import axios from 'axios';
import { auth, db } from '../services/firebase'
import { Ionicons, MaterialCommunityIcons, Entypo, Feather } from '@expo/vector-icons'
import NumberFormat from 'react-number-format'
import OptionWithFoto from '../components/OptionWithFoto/index';
import Select from '../components/Select/index';
import ListaHeaderMoeda from '../data/ListaHeaderMoeda';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';




const headerCurr = Platform.OS === 'android' ? '-35%' : '-2%'
const Tab = createMaterialTopTabNavigator();
export default ({navigation}) => {


  const theme = useTheme();
  const { colors } = useTheme();
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [thousandSeparator, setThousandSeparator] = useState('.')
  const [visible, setVisible] = useState(false);
  const [textError, setTextError] = useState('');
  const [moedas, setMoedas] = useState(MoedaList);
  const [listCambioDiario, setListCambioDiario]=useState([])
  const [country, setCoountry] = useState([]);
  const [country2, setCoountry2] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [inputValue, setInputValue] = useState(1);
  const [selectValue1, setSelectValue1] = useState([]);
  const [selectValue2, setSelectValue2] = useState();
  const [cambioHoje, setCambioHoje] = useState({
    euro: 820.56,
    dolar: 730.67
  });
  const [resultado, setResultado] = useState(1);
  const [resultado2, setResultado2] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  let [moedaSelecionada, setMoedaSelecionada] = useState("");
  let [moedaSelecionada2, setMoedaSelecionada2] = useState("");
  let [selectedIndex, setIndexTake] = useState(null);
  let [selectedIndex2, setIndexTake2] = useState(null);
  let takeValueBase1 = 0;
  let takeValueBase2 = 0;



 

  const UidUser = auth.currentUser.uid



//UseEffect
useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
      getData();
  })

  return unsubscribe;
}, [navigation])

  async function getData() {
    try {
      setIsLoading(true)
      const result = await axios.get('http://data.fixer.io/api/latest?access_key=0e2ac0ff105aadbda6b64d82541d0e2c&symbols= AOA,CNY,CAD,USD,GBP,JPY,MZN,RUB,EUR, ZAR,BRL,BYR,CVE,NGN,NAD,ARS,MAD,CDF,UAN');
      setSymbols(result.data.rates)
      //setSelectValue2(Object.value(result.data.rates))
      setIsLoading(false)
      //console.log(result.data.rates)
      const arrays = [...result.data.rates, ...moedas]
      console.log(arrays)

    } catch (error) {
      console.log(error)
    }


  }


  /**
   * 
   * @param {*} simbolosSelec 
   * @returns 
   */
  const takeValue1 = (simbolosSelec) => {
    Object.keys(symbols).map((value, index) => {
      if (value === simbolosSelec)
        takeValueBase1 = symbols[value]
      setSelectValue1(takeValueBase1)

    })
    return
  }

  /**
   * 
   * @param {*} simbolosSelec 
   * @returns 
   */
  const takeValue2 = (simbolosSelec) => {
    let valueTake = 0;
    Object.keys(symbols).map((value, index) => {
      if (value === simbolosSelec)
        takeValueBase2 = symbols[value]
      setSelectValue2(takeValueBase2)

    })
    return
  }

  /**
   * 
   */
  const convert = () => {
    console.log(selectValue1)
    if (selectValue1 !== null && selectValue2 !== null) {
      let num = (inputValue / selectValue1) * selectValue2
      setResultado(num)

    } else {
      Alert.alert(
        "Campos Vazios",
        'Por favor Preencha todos campos!'
      )
    }

  }

  /**
      * 
      * @returns 
      */
  function MyTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Variação Diária do KZ" component={Moedas} />
        <Tab.Screen name="Conversor de Moedas" component={renderExchnage} />
      </Tab.Navigator>
    );
  }

  /**
   * 
   * @returns return list of KZ rate
   */
  const Moedas = () => {
    const keyExtractor = (item, index) => index.toString();
    const renderItem = ({ item }) => (
      <ListItem bottomDivider >
        <Avatar rounded  source={item.avatarUrl} />
        <ListItem.Content>
          <ListItem.Title>{item.name}</ListItem.Title>
          <ListItem.Subtitle>{item.label}</ListItem.Subtitle>
        </ListItem.Content>
        <View style={{flexDirection:'column'}}>
          <Text style={{...FONTS.h3}}>{item.value + " " + 12.3356}</Text>
          <Text style={{...FONTS.body5, alignSelf:'flex-end'}}>1.234</Text>
        </View>
      </ListItem>)

    return (
      <View style={{backgroundColor: colors.background,}}>
        <FlatList
          keyExtractor={keyExtractor}
          data={moedas}
          renderItem={renderItem}
        />
      </View>

    )
  }

  /**
   * 
   * @param {*} param0 
   * @returns 
   */
  const renderItem = ({ item, index }) => (

    <TouchableOpacity style={{
      width: 150,
      paddingVertical: 24,
      paddingHorizontal: 10,
      marginLeft: index == 0 ? 21 : 0,
      marginRight: 12,
      borderRadius: 10,
      marginBottom: Platform.OS === 'ios' ? 20 : 15,
      backgroundColor: colors.background,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 5,
      shadowOpacity: 0.4,
      elevation: 5,
      zIndex: 5
    }}>

      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ marginLeft: 0 }}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={item.avatarUrl} style={styles.avatar} />
            <View style={{ flexDirection: 'column' }}>
              <Text style={{ color: colors.text, ...FONTS.h3, fontWeight: 'bold' }}>{item.name}</Text>
              <Text style={{ color: colors.text, fontSize: 12 }}>{item.label}</Text>
            </View>

          </View>
        </View>
      </View>
      <View style={{ paddingLeft: 10, paddingTop: 7, marginTop: 0, flexDirection: 'column' }}>
        <View >
          <Text style={{ color: colors.text, ...FONTS.h3 }}>{Object.keys(symbols).map((value, index) => {
            if (value === item.label)
              return item.value + ' ' + symbols[value].toFixed(3)

          })}</Text>
          <Text style={{ color: item.variationDolar <= '0' ? 'red' : 'green', ...FONTS.h4 }}>
            {1.0993}
          </Text>
        </View>

      </View>

    </TouchableOpacity>
  )


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

          <Swiper autoplay showsPagination={false} index={0} autoplayTimeout={5}>
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
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: (Platform.OS === 'ios') ? 13 : 20
              }}
            >
              <Text style={{ color: 'white', ...FONTS.h2 }}>€ 810.00</Text>
              <Text style={{ color: 'white', ...FONTS.body5 }}>Atualizado: 12-09-2021</Text>
            </View>

          </Swiper>
          {/**Header Bar */}
          <View style={{
            position: 'absolute',
            bottom: headerCurr
          }}>

            <FlatList
              contentContainerStyle={{ marginTop: 8 }}
              data={ListaHeaderMoeda}
              renderItem={renderItem}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </LinearGradient>
      </View>
    )
  }

  /**
 * funcao responsavel da parte de conversao de valores
 */
  function renderExchnage() {
    return (
      <ScrollView>
        <View style={{

          flex: 1,
          marginTop: Platform.OS === 'ios' ? 50 : 30,
          marginHorizontal: 24,
          padding: 20,
          borderRadius: 12,
          backgroundColor: colors.background,
          borderColor: colors.primary,
          paddingVertical: 10,
          marginVertical:10,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 5,
          shadowOpacity: 0.4,
          elevation: 5

        }}>


          <Text style={{
            color: colors.text,
            ...FONTS.h2, marginBottom: 15, alignSelf: 'center'
          }}>Faça uma Conversão!</Text>



          <View style={{ flexDirection: "row", justifyContent: 'space-between', width: '100%' }}>
            <SafeAreaView style={{ flex: 1, width: '100%' }}>
              <Select
                optins={moedas}
                onChangeSelect={(id, name, value) => {
                  setMoedaSelecionada(name);
                  setIndexTake(id);
                  takeValue1(name);
                }}
                text='De'
                OptionComponent={OptionWithFoto}
              />
            </SafeAreaView>
            {/*  <View style={{ borderColor: colors.primary, ...styles.inputIOS }}>

      </View >*/}


            <View style={styles.switchMoeda}>
              <Button
                type='clear'
                onPress={() => {
                  if (selectValue1 !== null && selectValue2 !== null && selectedIndex !== null & selectedIndex2 !== null) {

                    /** Funcao que permite a troca de moeda no Picker */
                    let moedaSel = moedaSelecionada
                    let moedaSel2 = moedaSelecionada2
                    let value1 = selectValue1
                    setSelectValue1(selectValue2)
                    setSelectValue2(value1)
                    let index = selectedIndex
                    let changeMoeda = moedaSel
                    selectedIndex = selectedIndex2
                    selectedIndex2 = index
                    moedaSel = moedaSel2
                    moedaSel2 = changeMoeda
                    setIndexTake(selectedIndex)
                    setIndexTake2(selectedIndex2)
                    setMoedaSelecionada(moedaSel)
                    setMoedaSelecionada2(moedaSel2)
                  }



                }}
                icon={<MaterialCommunityIcons name="swap-horizontal-circle-outline" size={28} color={colors.primary} />}>

              </Button>
            </View>

            <SafeAreaView style={{ flex: 1 }}>
              <Select
                optins={moedas}
                onChangeSelect={(id, name, value) => {
                  setMoedaSelecionada2(name)
                  setIndexTake2(id)
                  takeValue2(name);
                }}
                text='Para'
                OptionComponent={OptionWithFoto}
              />
            </SafeAreaView>

          </View>
          <View style={{ backgroundColor: colors.background, borderColor: colors.primary, ...styles.input }}>
            <Image
              source={selectedIndex !== null ? moedas[selectedIndex].avatarUrl : null}
              style={styles.imageStyleInput} />
            <Text style={{
              color: colors.text,
              ...FONTS.h4, marginBottom: 10, marginTop: 10, marginRight: 5, alignSelf: 'center'
            }}>{selectedIndex !== null ? moedas[selectedIndex].value : null}</Text>
            <TextInput
              keyboardType='numeric'
              style={{ flex: 1, padding: 10,color: colors.text,}}
              placeholder='Digite o valor'
              placeholderTextColor='grey'
              //returnKeyLabel='Ok'
              //returnKeyType='done'
              //onChangeText={text => setInputValue(text)}
              >
            </TextInput>
          </View>


          <View style={{ width: '100%', marginTop: 10 }}>
            <Button
              onPress={convert}
              icon={
                <Feather style={{ marginRight: 10 }} name="refresh-ccw" size={20} color='white' />
              }

              title="Converter"
              loading={isLoading}

            />

          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{
                color: colors.text,
                ...FONTS.h3, marginBottom: 0, marginTop: 5
              }}>B. Comerciais: </Text>

              <NumberFormat decimalScale={3} renderText={text => <Text style={{
                color: colors.text,
                ...FONTS.h3, marginBottom: 5, marginTop: 5, marginLeft: 5, fontWeight: 'bold'
              }}>{text}</Text>} value={selectedIndex2 !== null ? resultado : null}
                displayType={'text'} thousandSeparator={thousandSeparator} decimalSeparator={','} prefix={selectedIndex2 !== null ? moedas[selectedIndex2].value + ' ' : null} />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{
                color: colors.text,
                ...FONTS.h3, marginBottom: 0, marginTop: 5
              }}>Informal: </Text>
              <NumberFormat decimalScale={3} renderText={text => <Text style={{
                color: colors.text,
                ...FONTS.h3, marginBottom: 15, marginTop: 5, marginLeft: 5, fontWeight: 'bold'
              }}>{text}</Text>} value={selectedIndex2 !== null ? resultado : null}
                displayType={'text'} thousandSeparator={thousandSeparator} decimalSeparator={','} prefix={selectedIndex2 !== null ? moedas[selectedIndex2].value + ' ' : null} />

            </View>
          </View>
        </View>
      </ScrollView>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        style={{
          backgroundColor: '#ff3333',
          bottom: Platform.OS == 'ios' ? 50 : 5
        }}
        duration={1000}
      >
        {textError}
      </Snackbar>

      {renderHeader()}

      <View style={{flex:1, marginTop:Platform.OS==='android' ? 45 : 0}}>
        {MyTabs()}
      </View>

    </View>
  );
}


const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  wrapper: {

  },
  slide1: {
    height: 10,
    width: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  background1: {
    flex: 1,
    borderRadius: 10
  },
  background2: {
    height: Platform.OS === 'ios' ? 220 : 170,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 3,
    shadowRadius: 2,
    elevation: 2
  },
  areaText: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  scrolView: {
    //backgroundColor: colors.white
  },
  text: {
    fontSize: 24
  },
  viewScroll: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: 20

  },
  viewSearch: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 20,
    marginVertical: 20,
    alignItems: "center"

  },
  styleIcon: {
    //color: colors.white

  },
  input: {
    flexDirection: 'row',
    //backgroundColor: '#fff',
    borderWidth: 1,
    height: 50,
    width: '100%',
    borderRadius: 8,
    marginBottom: 15,

  },
  picker: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 7,
    marginBottom: 15,


  },
  inputIOS: {
    fontSize: 14,
    borderWidth: 1,
    height: 40,
    width: 110,
    borderRadius: 8,
    flexDirection: 'row',
    color: 'black',

  },
  switchMoeda: {
    marginBottom: 15,
    marginLeft: 3,
    marginRight: 3

  },
  btnSubmit: {
    flex: 1,
    width: '100%',
    height: 40,
    marginTop: 5,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7
  },
  submitText: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    marginTop: 7,
    ...FONTS.h2
  },
  imageStyle: {
    padding: 5,
    marginRight: 0,
    marginLeft: 3,
    height: 25,
    width: 25,
    marginTop: 13,
    resizeMode: 'stretch'
  },
  imageStyleInput: {
    padding: 5,
    marginRight: 10,
    marginLeft: 10,
    height: 25,
    width: 25,
    marginTop: 13,
    resizeMode: 'stretch'
  },
  avatar: {
    height: 35,
    width: 35,
    borderRadius: 25,
    marginRight: 12
  }

})