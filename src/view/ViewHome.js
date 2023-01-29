
import React, { createRef, useContext, useState, useRef, useEffect } from 'react'
import { Alert, FlatList, Image, View, StyleSheet, StatusBar, TouchableOpacity, Platform, RefreshControl, ActivityIndicator, TextInput } from 'react-native'
import { useTheme } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient';
import { FONTS, SIZE } from '../constant/themes'
import {
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  Card,
  Snackbar,
  Avatar as AvatarPaper
} from 'react-native-paper';
import { Avatar,Button } from 'react-native-elements'
import RBSheet from 'react-native-raw-bottom-sheet';
import ViewMoreText from 'react-native-view-more-text'
import { MaterialCommunityIcons, FontAwesome, AntDesign, Ionicons,FontAwesome5 } from '@expo/vector-icons'
import { auth, db } from '../services/firebase'
import axios from 'axios';
import MoedaList from '../data/ListaMoedas'
import ListaKinguila from '../data/ListaKinguila';
import NumberFormat from 'react-number-format'
import moment from 'moment'
import ListCurrency from '../data/ListCurrencyBank'
import 'moment/locale/pt'
import Spinner from 'react-native-loading-spinner-overlay';






const MORE_ICON = Platform.OS === 'android' ? 'dots-vertical' : 'dots-horizontal'
const headerCurr = Platform.OS === 'android' ? '-45%' : '-5%'
const ContainerCurr = Platform.OS === 'android' ? '-45%' : '-30%'

export default function HomeScreen({ navigation }) {

  const theme = useTheme();
  const { colors } = useTheme();
  const refRBSheet = useRef();
  const refRBSheetNegociar = useRef();
  const refRBSheetCurrentUser = useRef();
  const [listCambioDiario, setListCambioDiario] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isLikesFirebase, setIsLikesFirebase] = useState([])
  const [isLikes, setIsLikes] = useState({
    likes: [],
    likedPosts: []
  })
  const [postId, setPostId] = useState()
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [visible, setVisible] = useState(false)
  const [textError, setTextError] = useState('')
  const [limit, setLimit] = useState(5)
  const [image, setImage] = useState('');
  const [lastDocId, setLastDocId] = useState("")
  const [thousandSeparator, setThousandSeparator] = useState('.')
  const [moedas, setMoedas] = useState(MoedaList)
  const [listTakeVendas, setListTakeVendas] = useState([])
  const UidUser = auth.currentUser.uid

  const [ratesBna, setRatesBna] = useState([]);
  const [rates, setRates] = useState([]);





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
          refRBSheetCurrentUser.current.close()
          removeFavorits()
        }
      },
      {
        text: 'Não',
        onPress: () => refRBSheetCurrentUser.current.close()
      }
    ])
  }


  //UseEffect
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      takeSellsFromFirebase()
      takeCambioDiarioRua()
    })

    return unsubscribe;
  }, [navigation])
  /**
  * Refresshing data
  */
  const refreshingData = () => {
    takeSellsFromFirebase()
  }
  /**
   * 
   */
  const footerRender = () => {
    try {
      if (isFetchingMore) {
        return (
          <ActivityIndicator style={{ justifyContent: 'center', marginVertical: 10 }} color={colors.text} />
        )
      } else {
        return null
      }
    } catch (error) {

    }

  }



  /**
   * 
   * @returns Take more kinguila today
   */
  const takeCambioDiarioRua = async () => {

    try {
      //setIsFetchingMore(true)
      const cambioDiario = await db.collection("CambioDaRua")
        .get()
        .then((querySnapshot) => {
          let temp = [];
          querySnapshot.forEach((doc) => {
            let SellDetails = {};
            SellDetails = doc.data();
            SellDetails['id'] = doc.id;
            temp.push(SellDetails);
            setListCambioDiario(temp)
            console.log(listCambioDiario)

          });
        })
        .catch((error) => {
          Alert.alert(
            "Erro de rede",
            'Erro de conexao! Verifica a tua internet ou tente mais tarde!'
          )
        });
      return () => cambioDiario;
    } catch (error) {
      Alert.alert(
        "Erro de rede",
        'Erro de conexao! Verifica a tua internet ou tente mais tarde!'
      )
    }

  }


  /***
  * Pegar as vendas todas
  */
  const takeSellsFromFirebase = async () => {
    try {
      const vendasTodas = await db.collection("VendasAll")
        .orderBy("dataPubl", "desc")
        .limit(limit)
        .get()
        .then((querySnapshot) => {
          let temp = [];
          let DocumentDatas = querySnapshot.docs.map(docume =>
            docume.data())
          let lastDoc = DocumentDatas[DocumentDatas.length - 1].userUId
          setLastDocId(lastDoc)
          querySnapshot.forEach((doc) => {
            let SellDetails = {};
            db.collection("PostLikes").doc(UidUser)
              .get()
              .then((doc) => {
                setIsLikesFirebase([doc.data().likedPosts])
                console.log(isLikesFirebase);
              })
              .catch((error) => {
                //console.log("Error getting documents: ", error);

              });
            SellDetails = doc.data();
            SellDetails['id'] = doc.id;
            temp.push(SellDetails);
            setListTakeVendas(temp)

            //pegar os gostos

            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", lastDoc);
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
   * 
   * @returns Take more data from 
   */
  const takeMoreSellsFromFirebase = async () => {

    try {
      setIsFetchingMore(true)
      const vendasTodas = await db.collection("VendasAll")
        .orderBy("dataPubl", "desc")
        .startAfter(lastDocId)
        .limit(limit)
        .get()
        .then((querySnapshot) => {
          let temp = [];
          let DocumentDatas = querySnapshot.docs.map(docume =>
            docume.data())
          let lastDoc = DocumentDatas[DocumentDatas.length - 1].userUId
          setLastDocId(lastDoc)
          querySnapshot.forEach((doc) => {
            let SellDetails = {};
            SellDetails = doc.data();
            SellDetails['id'] = doc.id;
            temp.push(SellDetails);
            setListTakeVendas([...listTakeVendas, ...temp])
            setIsFetchingMore(false)

            //console.log(doc.id, " => ", temp);
          });
        })
        .catch((error) => {
          Alert.alert(
            "Erro de rede",
            'Erro de conexao! Verifica a tua internet ou tente mais tarde!'
          )
        });
      return () => vendasTodas;
    } catch (error) {
      Alert.alert(
        "Erro de rede",
        'Erro de conexao! Verifica a tua internet ou tente mais tarde!'
      )
    }

  }

  /**
   * 
   * @param {Updating Photo Profile} imageUpdating 
   * @returns 
   */
  const updateLikedsPost = (sellUid, isLiked) => {
    var photoProfileUpdate = firestore().collection("PostLikes").doc(sellUid);

    // Set the "capital" field of the city 'DC'
    return photoProfileUpdate.update({
      likedPosts: isLiked
    })
      .catch((error) => {
        Alert.alert(
          "Erro de Actualização",
          'Pedimos desculpas mas não conseguimos atualizar os teus dados, tente mais tarde!'
        )
      });
  }
  /** 
   * 
  */
  const renderItem = ({ item, index }) => (

    <View style={[styles.headerCurr, { zIndex: 50, backgroundColor: colors.background, marginLeft: index == 0 ? 15 : 0, }]}>

      <View style={{ flexDirection: 'row' }}>
        <Image source={item.avatarUrl} style={styles.avatar} />
        <View style={{ marginLeft: 0, flexDirection: 'column' }}>
          <Text style={{ ...FONTS.h4, fontWeight: 'bold' }}>{item.name}</Text>
          <Text style={{ ...FONTS.body5 }}>{item.label}</Text>
        </View>
      </View>
      {/* Valores*/}
      <View style={{ flexDirection: 'row', marginTop: 2 }}>
        <Text style={{ ...FONTS.h4, marginRight: 5, }}>{item.value + ' ' + listCambioDiario.map((value, index) => {
          if (value.abreviacao === item.label)
            return value.valor

        })}</Text>
        <MaterialCommunityIcons style={{ marginTop: 3.5 }} name={listCambioDiario.map((value, index) => {
          if (value.abreviacao === item.label)
            return value.valor

        }) < listCambioDiario.map((value, index) => {
          if (value.abreviacao === item.label)
            return value.valorAnterior

        }) ? "arrow-up" : "arrow-down"} size={15} color={listCambioDiario.map((value, index) => {
          if (value.abreviacao === item.label)
            return value.valor

        }) < listCambioDiario.map((value, index) => {
          if (value.abreviacao === item.label)
            return value.valorAnterior

        }) ? "green" : "red"} />
      </View>

    </View>


  )

  /**
    * 
    * @returns render Header
    */
  function renderHeader() {
    return (

      <View style={{ color: colors.background, ...styles.background2 }}>
        <LinearGradient
          colors={Platform.OS === 'ios' ? ['#00B4DB', '#0083B0'] : ['#00B4DB', '#0083B0']}
          style={styles.background}

        >
          {/**Header Bar */}
          <View style={{
            position: 'absolute',
            bottom: headerCurr
          }}>
            <FlatList
              contentContainerStyle={{ marginTop: 8 }}
              data={ListaKinguila}
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
    * renderizar o botton sheet  
   */
  function bottomSheetOptions() {
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
          <MaterialCommunityIcons name='chat-outline' size={24} color={colors.text} onPress={() => refRBSheet.current.close()} />
          <TouchableOpacity style={styles.commandButton} onPress={() => {
            refRBSheet.current.close()
            navigation.navigate('ViewChatScreen', { user: postId })
          }}>
            <Text style={{ ...FONTS.h3, marginLeft: 5, color: colors.text }}>
              Enviar Mensagem
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', margin: 5, marginLeft: 20 }}>
          <FontAwesome name='handshake-o' size={20} color={colors.text} onPress={() => refRBSheet.current.close()} />
          <TouchableOpacity style={styles.commandButton} onPress={() => {
            refRBSheet.current.close()
            UidUser === postId ? navigation.navigate('viewNegociar') : navigation.navigate('viewNegociar', { user: postId })

          }
          }>
            <Text style={{ ...FONTS.h3, marginLeft: 5, color: colors.text }}>
              Negociar a venda
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', margin: 5, marginLeft: 20 }}>
          <MaterialCommunityIcons name='account-tie-outline' size={24} color={colors.text} onPress={() => refRBSheet.current.close()} />
          <TouchableOpacity style={styles.commandButton} onPress={() => {
            refRBSheet.current.close()
            UidUser === postId ? navigation.navigate('profileScreen') : navigation.navigate('profileScreen', { user: postId })
          }
          }>
            <Text style={{ ...FONTS.h3, marginLeft: 5, color: colors.text }}>
              Visitar o Perfil
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', margin: 5, marginLeft: 20 }}>
          <MaterialCommunityIcons name='flag-variant-outline' size={24} color={colors.text} onPress={() => refRBSheet.current.close()} />
          <TouchableOpacity style={styles.commandButton} onPress={() => refRBSheet.current.close()}>
            <Text style={{ ...FONTS.h3, marginLeft: 5, color: colors.text }}>
              Denunciar a venda
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', margin: 5, marginLeft: 20 }}>
          <MaterialCommunityIcons name='close' size={24} color={colors.text} onPress={() => refRBSheet.current.close()} />
          <TouchableOpacity style={styles.commandButton} onPress={() => refRBSheetCurrentUser.current.close()}>
            <Text style={{ ...FONTS.h3, color: colors.text }}>
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    )
  }

  function bottomSheetOptionsCurrenteUser() {
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
            borderTopLeftRadius: 10
          }

        }}
      >
        <View style={{ alignItems: 'center' }}>
          <Title style={{ color: colors.text }}>Opções</Title>
        </View>
        <View style={{ flexDirection: 'row', margin: 5, marginLeft: 20 }}>
          <MaterialCommunityIcons name='delete-variant' size={24} color={colors.text} onPress={() => refRBSheetCurrentUser.current.close()} />
          <TouchableOpacity style={styles.commandButton} onPress={confirmUserdelete}>
            <Text style={{ ...FONTS.h3, marginLeft: 5, color: colors.text }}>
              Apagar a venda
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', margin: 5, marginLeft: 20 }}>
          <FontAwesome name='edit' size={24} color={colors.text} onPress={() => refRBSheetCurrentUser.current.close()} />
          <TouchableOpacity style={styles.commandButton} onPress={() => {
            refRBSheetCurrentUser.current.close()
            navigation.navigate('viewSell', { user: postId })

          }}>
            <Text style={{ ...FONTS.h3, marginLeft: 5, color: colors.text }}>
              Editar a venda
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', margin: 5, marginLeft: 20 }}>
          <MaterialCommunityIcons name='share-outline' size={24} color={colors.text} onPress={() => refRBSheetCurrentUser.current.close()} />
          <TouchableOpacity style={styles.commandButton} onPress={() => {
            refRBSheetCurrentUser.current.close()
            funcaoShare()
          }}>
            <Text style={{ ...FONTS.h3, marginLeft: 5, color: colors.text }}>
              Partilhar a venda com ...
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', margin: 5, marginLeft: 20 }}>
          <MaterialCommunityIcons name='close' size={24} color={colors.text} onPress={() => refRBSheetCurrentUser.current.close()} />
          <TouchableOpacity style={styles.commandButton} onPress={() => refRBSheetCurrentUser.current.close()}>
            <Text style={{ ...FONTS.h3, color: colors.text }}>
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    )
  }

  /**
     * Card View das vendas Todas
     * @param {} param0 
     * @returns 
     */
  const cardView = ({ item, index }) => (
    <Card elevation={5} key={index} style={{ marginTop: 5, color: colors.card }}>
      <Card.Title titleStyle={{ fontSize: 16 }} subtitleStyle={{ fontSize: 12 }} title={item.firstName + ' ' + item.midleName + ' ' + item.lastname} subtitle={moment(item.dataPubl).locale('pt').fromNow(false) + " • " + item.countryUser} left={props => <Avatar
        rounded={true}
        containerStyle={{
          marginBottom: 0, borderWidth: 1,
          borderColor: colors.card,
        }}
        source={{
          uri: item.imageUser ? item.imageUser : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        }}
        size={40}
      >
      </Avatar>} right={() => <MaterialCommunityIcons style={{ marginHorizontal: 10 }} name={MORE_ICON} size={24} color={colors.text} onPress={() => {
        userID = item.userUId
        setPostId(item)
        UidUser != item.userUId ? refRBSheet.current.open() : refRBSheetCurrentUser.current.open()
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
        {/*<Paragraph numberOfLines={2} ellipsizeMode='tail'>{item.comentar}</Paragraph>*/}
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

          <View style={{ flexDirection: 'row', marginBottom: 0, justifyContent: 'space-around',padding:0 }}>
            <TouchableOpacity style={{marginTop:5, flexDirection:'row'}}>
              <FontAwesome id={index}
                name={isLikes.likedPosts.indexOf(item.id) > -1 ? 'thumbs-up' : 'thumbs-o-up' && isLikesFirebase.indexOf(item.id) > -1 ? 'thumbs-up' : 'thumbs-o-up'} size={20}
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
            <Button
              onPress={() => {
                navigation.navigate('viewComprar', { user: item })
              }}
              containerStyle={{ width: 150, marginRight: 0, height:35 }}
              buttonStyle={{ backgroundColor: 'rgba(127, 220, 103, 1)', borderRadius: 10, padding:5 }}
              icon={
                <FontAwesome5 style={{ marginRight: 10 }} name="hands-helping" size={20} color='white' />
              }

              title="COMPRAR"
            //loading={isLoading}

            />

            <TouchableOpacity style={{ marginTop:5, flexDirection:'row'}} onPress={() =>
               navigation.navigate('ViewChatScreen', { user: item })}>
              <FontAwesome name="send-o" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </Card.Content>
    </Card>

  )



  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar backgroundColor={colors.primary} barStyle={theme.dark ? 'default' : 'light-content'} />
      <Spinner
        visible={isLoading}
        textContent={'Aguarde...'}
        textStyle={styles.spinnerTextStyle}
      />
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        style={{
          //backgroundColor: '#FF0000'
          bottom: Platform.OS == 'ios' ? 50 : 5
        }}
        duration={1000}
      >
        {textError}
      </Snackbar>
      {isLoading ? <ActivityIndicator /> :

        <FlatList
          data={listTakeVendas}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={footerRender}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refreshingData}
            />
          }
          renderItem={cardView}
          onEndReached={takeMoreSellsFromFirebase}
          onEndReachedThreshold={0}
        />}

      {bottomSheetOptions()}
      {bottomSheetOptionsCurrenteUser()}

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  headerCurr: {
    flex: 1,
    width: 120,
    height: 100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 12,
    borderRadius: 10,
    marginBottom: 15,

    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 5,
    shadowOpacity: 0.3,
    elevation: 5
  },
  imageStyle: {
    padding: 5,
    margin: 5,
    height: 25,
    width: 25,
    marginTop: 13,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    //borderColor: colors.themeColor,
    height: 50,
    width: '100%',
    borderRadius: 7,
    marginBottom: 15,

  },
  inputComent: {
    backgroundColor: '#fff',
    paddingLeft: 10,
    borderWidth: 1,
    //borderColor: colors.themeColor,
    width: '100%',
    borderRadius: 7,
    marginBottom: 15,

  },
  btnCancelar: {
    borderRadius: 7,
    //borderColor: colors.themeColor,
  },
  panelHeader: {
    alignItems: 'center'
  },
  caption: {
    fontSize: 12,
    lineHeight: 12,
  },
  row12: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  title: {
    fontSize: 18,
    marginTop: 0,
    fontWeight: 'bold',
  },
  viewLinha: {
    height: 0.5,
    width: '100%',
    opacity: 0.5,
    //backgroundColor: colors.greyish,
    marginTop: 0,
    marginBottom: 10

  },
  viewValor: {
    width: 150,
    height: 70,
    borderRadius: 5,
    marginBottom: 15,
    //backgroundColor: 'white',
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
  background: {
    //backgroundColor: colors.themeColor,
    height: (Platform.OS === 'ios') ? 120 : 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 3,
    shadowRadius: 2,
    elevation: 2
  },
  background2: {
    //backgroundColor: colors.white,
    height: (Platform.OS === 'ios') ? 120 : 140,

  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    elevation: 5,
    paddingTop: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  panelHeader: {
    alignItems: 'center'
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    elevation: 5,
    shadowOpacity: 0.4,
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10

  },
  panelTitle: {
    //color: colors.themeColor,
    fontSize: 18,
    height: 30,

  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    marginTop: 10,
    //backgroundColor: colors.themeColor,
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButton1: {
    padding: 13,
    borderRadius: 10,
    marginTop: 5,
    //backgroundColor: colors.orange,
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  commandButton: {
    left: 5
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  logo: {
    height: 50,
    width: 50,
    alignSelf: "center",
    resizeMode: 'cover',
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 25,
    marginRight: 7
  }

})