import React, { createRef, useContext, useState, useRef, useEffect } from 'react';
import { Alert, FlatList, Image, View, StyleSheet, Text, TouchableOpacity, TextInput, TouchableWithoutFeedback, StatusBar, Keyboard, ScrollView, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons, Entypo, Ionicons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@react-navigation/native';
import MoedaList from '../data/ListaMoedas';
import { ListItem, CheckBox } from 'react-native-elements'
import OptionWithFoto from '../components/OptionWithFoto/index';
import Select from '../components/Select/index';
import ListaMoedasInvertida from '../data/ListaMoedasInvertida';
import { FONTS, SIZE } from '../constant/themes';
import { Button } from 'react-native-elements';
import { auth, db } from '../services/firebase';
import NumberFormat from 'react-number-format';
import ListOfBanckAngola from '../data/ListOfBanckAngola';
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





export default ({ route, navigation }) => {


    const [isLoading, setIsLoading] = useState(false)
    const { user } = route.params;
    const theme = useTheme();
    const { colors } = useTheme();
    const [moedas, setMoedas] = useState(MoedaList)
    const [isDeposito, setIsDeposito] = useState(true);
    const [isTransf, setIsTransf] = useState(false);
    const [moedasInv, setMoedasInv] = useState(ListaMoedasInvertida)
    const [moedaSelecionada, setMoedaSelecionada] = useState("AOA")
    const [moedaSelecionada2, setMoedaSelecionada2] = useState("EUR")
    const [bancoSelecionado, setBancoSelecionado] = useState("")
    const [textSee, setTextSee] = useState("Ver detalhes da venda");
    const [isOpen, setIsOpen] = useState(false)
    const [selectedIndex, setIndexTake] = useState()
    const [selectedIndex2, setIndexTake2] = useState()
    const [thousandSeparator, setThousandSeparator] = useState(' ')
    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);
    const [visible, setVisible] = useState(false)
    const [textError, setTextError] = useState('')
    const UidUser = auth.currentUser.uid
    const [data, setData] = useState({
        valorComprar: '',
        dataPubl: new Date().getTime(),
        moedaFrom: moedaSelecionada,
        dataPubl: new Date().getTime(),
        moedaTo: moedaSelecionada2,
        imageUrlFrom: selectedIndex,
        imageUrlTo: selectedIndex2,
        symboloFrom: user.simbolysFrom,
        comentar: '',

    });

    /**
     * publicar as vendas
     * @param {*} props 
     */
    const buingMoney = async () => {

        var ref = db.collection("Users").doc(user.userUId).collection("ComprasSolicitadas");
        var refComprador= db.collection("Users").doc(UidUser).collection("ComprasEmCurso");

        try {
            await db.collection("Users").doc(UidUser)
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
                        formPagam: isDeposito ? "Deposito Bancario" : "Transferencia Bancaria",
                        bancoSelecionado: isTransf ? bancoSelecionado :'',
                        valorComprar:data.valorComprar,
                        symbolosFrom:data.symboloFrom
                    }).then(() => {

                        refComprador.add({
                            firstName: user.firstName,
                            midleName: user.midleName,
                            lastname: user.lastname,
                            userUId: UidUser,
                            dataPubl: data.dataPubl,
                            isAccepted: false,
                            imageUser: user.imageUser,
                            formPagam: isDeposito ? "Deposito Bancario" : "Transferencia Bancaria",
                            bancoSelecionado: isTransf ? bancoSelecionado :'',
                            valorComprar:data.valorComprar,
                            symbolosFrom:data.symboloFrom
                        })

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
 * 
 * @returns funcoes paralelas
 */
    function renderExchnage() {
        return (
            <ScrollView>
                <View style={{
                    flex: 1,
                    marginTop: Platform.OS === 'ios' ? 20 : 15,
                    marginHorizontal: 2,
                    padding: 10,
                    borderRadius: 12,
                    backgroundColor: colors.background,
                    borderColor: colors.primary,
                    paddingVertical: 10,
                    marginVertical: 15,
                    //shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 0 },
                    shadowRadius: 2,
                    shadowOpacity: 0.4,
                    elevation: 5

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
                                    uri: user.imageUser ? user.imageUser : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                                }}
                                size={40}
                            >
                            </Avatar.Image>
                            <View style={{ flexDirection: 'column', marginHorizontal: 10 }}>
                                <Text style={{ color: colors.text,fontSize: 16, fontWeight: 'bold' }}>{user.firstName + ' ' + user.midleName + ' ' + user.lastname}</Text>
                                <Caption>{moment(user.dataPubl).locale('pt').fromNow(false) + " • " + user.countryUser}</Caption>

                            </View>

                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ backgroundColor: colors.background, ...styles.viewValor }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ alignSelf: 'center', color: colors.text }}>Valor</Text>
                                    <View style={{ backgroundColor: colors.text, ...styles.viewLinha }}></View>
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginLeft: 5 }}>
                                        <Image
                                            source={moedas[user.imageUrlFrom].avatarUrl
                                            }
                                            style={styles.imageStyleCard}

                                        />
                                        <NumberFormat renderText={text => <Text style={{ marginLeft: 8, marginTop: 2, color: colors.text }}>{text}</Text>} value={user.valorFrom}
                                            displayType={'text'} thousandSeparator={thousandSeparator} decimalSeparator={','} prefix={user.simbolysFrom + ' '} />

                                    </View>
                                </View>

                            </View>
                            <View style={{ backgroundColor: colors.background, ...styles.viewValor }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ alignSelf: 'center', color: colors.text }}>Preço</Text>
                                    <View style={{ backgroundColor: colors.text, ...styles.viewLinha }}></View>
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginLeft: 5 }}>
                                        <Image
                                            source={moedas[user.imageUrlTo].avatarUrl}
                                            style={styles.imageStyleCard}

                                        />

                                        <NumberFormat renderText={text => <Text style={{ marginLeft: 8, marginTop: 2, color: colors.text }}>{text}</Text>} value={user.valorTo}
                                            displayType={'text'} thousandSeparator={thousandSeparator} decimalSeparator={','} prefix={user.simbolysTo + ' '} />

                                    </View>

                                </View>

                            </View>
                        </View>
                        {isOpen ? <View style={{ ...styles.section2 }}>
                            {isOpen ? <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderColor: colors.text, width: '95%', marginBottom: 10 }}>
                                <MaterialCommunityIcons
                                    name="bank"
                                    color={colors.text}
                                    size={20} />
                                <Text style={{ fontSize: 15, marginLeft: 10, marginBottom: 10 }}>{'Banco Preferencial: ' + user.bancoSelecionado}</Text>
                            </View> : null}
                            {isOpen ? <View style={{ flexDirection: 'row', marginTop: 10, borderColor: colors.text, borderBottomWidth: 0.5, width: '95%', marginBottom: 10 }}>
                                <FontAwesome name="handshake-o" size={20} color={colors.text} />
                                <Text style={{ fontSize: 15, marginLeft: 10, marginBottom: 10 }}>
                                    Negociável:  {user.isNegociavel ? "Sim" : "Não"}
                                </Text>
                            </View> : null}

                        </View> : null}
                        <View style={{ flexDirection: 'row' }}>
                            <MaterialCommunityIcons
                                name={isOpen ? "chevron-up" : "chevron-down"}
                                color={colors.primary}
                                size={20} />
                            <TouchableOpacity onPress={() => {
                                setIsOpen(!isOpen)
                                textSee === 'Ver detalhes da venda' ? setTextSee("Ocultar detalhes da Venda") : setTextSee("Ver detalhes da venda")
                            }}>
                                <Text style={{ color: colors.primary, borderBottomWidth: 0.5, borderBottomColor: colors.primary }}>{textSee}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        )
    }

    /**
     * Chamada principal da funcao comprar notas....
     */


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

            <View style={styles.container}>
                <StatusBar backgroundColor={colors.background} barStyle={theme.dark ? 'default' : 'dark-content'} />

                <View styles={{ backgroundColor: colors.background }}>

                    <View style={styles.panel}>
                        <View style={{
                            flexDirection: 'row', alignContent: 'space-between', marginBottom: 5, marginTop: 5,
                            shadowOffset: { width: 0, height: 0 },

                        }}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}>
                                <MaterialCommunityIcons name="close" size={28} color={colors.text} />
                            </TouchableOpacity>
                            <Text style={{
                                fontSize: 18,
                                height: 35,
                                marginLeft: 90, color: colors.text,
                                fontWeight: 'bold'
                            }}>{'COMPRAR NOTAS'}</Text>

                        </View>
                        {renderExchnage()}
                        <View style={{ backgroundColor: colors.background, borderColor: colors.primary, ...styles.input }}>
                            <Image
                                source={moedas[user.imageUrlFrom].avatarUrl}
                                style={styles.imageStyle} />
                            <Text style={{ color: colors.text, marginTop: 15, marginRight: 5, marginLeft: 2, color: colors.text }}>{moedas[user.imageUrlFrom].value}</Text>
                            <TextInput
                                placeholder='Digite o valor que pretende comprar...'
                                keyboardType='decimal-pad'
                                placeholderTextColor='grey'
                                returnKeyLabel='OK'
                                returnKeyType='done'
                                autoFocus={false}
                                style={{ flex: 1, color: colors.text, }}
                                onChangeText={(valor) => setData({
                                    ...data,
                                    valorComprar: valor

                                })}>
                            </TextInput>


                        </View>
                        <Text style={{ ...FONTS.h3, marginBottom: 5, color: colors.text }}>Selecione o metodo de pagamento</Text>
                        <View style={{ backgroundColor: colors.background, marginBottom: 5 }}>
                            <CheckBox
                                title='Depósito '
                                checked={isDeposito}
                                containerStyle={{ backgroundColor: colors.background }}
                                textStyle={{ color: colors.text }}
                                onPress={() => {
                                    setIsDeposito(!isDeposito)
                                    setIsTransf(false)

                                }}
                            />
                        </View>
                        <View style={{ backgroundColor: colors.background, marginBottom: 15 }}>
                            <CheckBox
                                title='Transferência Bancaria'
                                checked={isTransf}
                                containerStyle={{ backgroundColor: colors.background }}
                                textStyle={{ color: colors.text }}
                                onPress={() => {
                                    setIsTransf(!isTransf)
                                    setIsDeposito(false)

                                }}
                            />
                        </View>

                        {isTransf ? <Text style={{ ...FONTS.h3, marginBottom: 5, color: colors.text }}>Selecione o banco </Text> : null}
                        {isTransf ? <SafeAreaView style={{ marginLeft: 0, width: '100%', marginBottom: 15 }}>
                            <Select
                                optins={ListOfBanckAngola}
                                onChangeSelect={(id, name, value) => {
                                    setBancoSelecionado(name);

                                }}
                                text='Selecione o banco a depositar'
                                OptionComponent={OptionWithFoto}
                            />
                        </SafeAreaView> : null}


                        <View style={{ width: '100%', marginTop: 10 }}>
                            <Button
                                onPress={() => {
                                    if (data.valorComprar !== '') {
                                        buingMoney()
                                    } else {
                                        onToggleSnackBar()
                                        setTextError('Existem Campos vazios, Por favor verifique!')
                                    }

                                }}
                                icon={
                                    <Ionicons style={{ marginRight: 10 }} name="checkmark-done-circle-outline" size={25} color="white" />
                                }

                                title="Solicitar"
                                loading={isLoading}
                                containerStyle={{ borderRadius: 10, borderColor: colors.primary }}
                            />

                        </View>

                    </View>

                </View>
            </View>
        </TouchableWithoutFeedback>
    )
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
    panel: {
        padding: 20,
        //backgroundColor: '#FFFFFF',
        paddingTop: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,

    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        //backgroundColor: '#00000040',
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
    picker: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 1,
        //borderColor: colors.themeColor,
        borderRadius: 7,
        marginBottom: 15,
    },
    section2: {
        flexDirection: 'column',
        marginLeft: 15,
        marginTop: 10,
    },
    switchMoeda: {
        marginBottom: 15,
        marginLeft: 3,
        marginRight: 3
    },
    imageStyle: {
        padding: 5,
        margin: 10,
        height: 25,
        width: 25,
        marginTop: 13,
        resizeMode: 'stretch',
        alignItems: 'center',
    },
    input: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderWidth: 1,
        height: 50,
        width: '100%',
        borderRadius: 12,
        marginVertical: 7

    },
    inputComent: {
        paddingLeft: 10,
        borderWidth: 1,

        width: '100%',
        borderRadius: 7,
        marginBottom: 15,

    },
    button: {
        alignItems: 'center',
        marginTop: 0
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    panelHeader: {
        alignItems: 'center'
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
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
    imageStyleCard: {
        height: 25,
        width: 25,
        resizeMode: 'stretch',

    },
})