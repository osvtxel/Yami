import React, { createRef, useContext, useState, useRef, useEffect } from 'react'
import { Alert, Image, View, StyleSheet, Text, TouchableOpacity, TextInput, TouchableWithoutFeedback, StatusBar, Keyboard, SafeAreaView, ActivityIndicator, Platform } from 'react-native'
import { Button, CheckBox } from 'react-native-elements'
import { MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient';
import MoedaList from '../data/ListaMoedas'
import MoedaListInvert from '../data/ListaMoedasInvertida'
import { auth, db } from '../services/firebase'
import { useTheme } from '@react-navigation/native'
import { FONTS, SIZE } from '../constant/themes';
import NumberFormat from 'react-number-format'
import ListOfBanckAngola from '../data/ListOfBanckAngola';
import OptionWithFoto from '../components/OptionWithFoto/index';
import Select from '../components/Select/index';




export default ({ route, navigation }) => {

    const theme = useTheme();
    const { colors } = useTheme();
    const newSell = route.params;
    const { user } = route.params
    const [isLoading, setIsLoading] = useState(false)
    const [userInfo, setUserInfo] = useState([])
    const [isNegociavel, setIsNegociavel] = useState(false);
    const [bancoSelecionado, setBancoSelecionado] = useState("")
    const [moedas, setMoedas] = useState(MoedaList)
    const [moedasInv, setMoedasInv] = useState(MoedaListInvert)
    const [moedaSelecionada, setMoedaSelecionada] = useState(newSell === 'new' ? {
        label: 'EUR',
        value: '€',
    } : user.moedaFrom)
    const [moedaSelecionada2, setMoedaSelecionada2] = useState(newSell === 'new' ? "AOA" : user.moedaTo)
    let [selectedIndex, setIndexTake] = useState(newSell === 'new' ? 0 : user.imageUrlFrom)
    let [selectedIndex2, setIndexTake2] = useState(newSell === 'new' ? 0 : user.imageUrlTo)
    const [textError, setTextError] = useState('')
    const UidUser = auth.currentUser.uid
    const [data, setData] = useState({
        valorFrom: newSell === 'new' ? '' : user.valorFrom,
        valorTo: newSell === 'new' ? '' : user.valorTo,
        dataPubl: new Date().getTime(),
        moedaFrom: moedaSelecionada,
        moedaTo: moedaSelecionada2,
        imageUrlFrom: selectedIndex,
        imageUrlTo: selectedIndex2,
        simbolysTo: moedasInv[selectedIndex].value,
        simbolysFrom: moedas[selectedIndex2].value,
        comentar: newSell === 'new' ? '' : user.comentar,
    });

    /**
     * 
     * @returns editSell
     */
    const editSell = () => {
        try {
            setIsLoading(true)
            var SellUpdate = db.collection("VendasAll").doc(user.id);

            // Set the "capital" field of the city 'DC'
            return SellUpdate.update({
                valorFrom: data.valorFrom,
                valorTo: data.valorTo,
                moedaFrom: moedaSelecionada,
                moedaTo: moedaSelecionada2,
                imageUrlFrom: data.imageUrlFrom,
                imageUrlTo: data.imageUrlTo,
                comentar: data.comentar
            })
                .then(() => {
                    setIsLoading(false)
                    navigation.replace("ViewHome")
                })
                .catch((error) => {
                    Alert.alert(
                        "Erro de Actualização",
                        'Pedimos desculpas mas não conseguimos atualizar os teus dados, tente mais tarde!'
                    )
                });
        } catch (error) {

        }

    }
    /**
     * publicar as vendas
     * @param {*} props 
     */
    const publishSells = async () => {
        try {
            setIsLoading(true)
            await db.collection("Users").doc(UidUser)
                .get()
                .then((doc) => {
                    db.collection("VendasAll")
                        .add({
                            firstName: doc.data().firstName,
                            midleName: doc.data().midleName,
                            lastname: doc.data().lastname,
                            countryUser: doc.data().country,
                            idSell: Math.floor(Math.random() * 100) + 1,
                            userUId: UidUser,
                            like: "0",
                            liked: false,
                            expoPushToken: doc.data().expoPushToken,
                            imageUser: doc.data().userImg,
                            valorFrom: data.valorFrom,
                            valorTo: data.valorTo,
                            dataPubl: data.dataPubl,
                            moedaFrom: moedaSelecionada,
                            moedaTo: moedaSelecionada2,
                            imageUrlFrom: selectedIndex,
                            imageUrlTo: selectedIndex2,
                            simbolysFrom: moedas[selectedIndex].value,
                            simbolysTo: moedas[selectedIndex2].value,
                            comentar: data.comentar,
                            isNegociavel: isNegociavel,
                            bancoSelecionado: bancoSelecionado,
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
    return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

        <View style={styles.container}>
            <StatusBar backgroundColor={colors.background} barStyle={theme.dark ? 'default' : 'dark-content'} />
            <View styles={{ backgroundColor: colors.background, flex: 1 }}>

                <View style={{ backgroundColor: colors.background, ...styles.panel }}>
                    <View style={{
                        flexDirection: 'row', alignContent: 'space-between', marginBottom: 5, marginTop: 5,
                        shadowRadius: 5,

                    }}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ViewHome')}>
                            <MaterialCommunityIcons name="close" size={28} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={{
                            fontSize: 18,
                            height: 35,
                            marginLeft: 90,
                            color: colors.text
                        }}>{newSell === 'new' ? 'Criar Nova Venda' : 'Editar a Venda'}</Text>

                    </View>


                    <View style={{ flexDirection: "row", justifyContent: 'space-between', width: '100%' }}>

                        <SafeAreaView style={{ flex: 1, width: '100%' }}>
                            <Select
                                optins={moedas}
                                onChangeSelect={(id, name, value) => {
                                    setMoedaSelecionada(name);
                                    setIndexTake(id);

                                }}
                                text='De'
                                OptionComponent={OptionWithFoto}
                            />
                        </SafeAreaView>

                        <View style={styles.switchMoeda}>
                            <Button
                                type='clear'
                                onPress={() => {
                                    if (selectValue1 !== null && selectValue2 !== null && selectedIndex !== null & selectedIndex2 !== null) {

                                        /** Funcao que permite a troca de moeda no Picker */
                                        let moedaSel = moedaSelecionada
                                        let moedaSel2 = moedaSelecionada2
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
                                icon={<MaterialCommunityIcons name="swap-horizontal-circle-outline" size={28} color={colors.primary} />}

                            >

                            </Button>
                        </View>

                        <SafeAreaView style={{ flex: 1 }}>
                            <Select
                                optins={moedas}
                                onChangeSelect={(id, name, value) => {
                                    setMoedaSelecionada2(name)
                                    setIndexTake2(id)

                                }}
                                text='Para'
                                OptionComponent={OptionWithFoto}
                            />
                        </SafeAreaView>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ borderColor: colors.primary, ...styles.input }}>
                            <Image
                                source={moedas[selectedIndex].avatarUrl}
                                style={styles.imageStyle} />
                            <Text style={{ marginTop: 14, marginLeft: 2, color: colors.text }}>{moedas[selectedIndex].value}</Text>
                            <TextInput
                                placeholder='Digite o valor'
                                keyboardType='decimal-pad'
                                defaultValue={newSell === 'new' ? '' : user.valorFrom}
                                placeholderTextColor='grey'
                                returnKeyLabel='Ok'
                                maxLength={9}
                                returnKeyType='done'
                                autoFocus={false}
                                style={{ color: colors.text, padding: 10 }}
                                onChangeText={(valor) => setData({
                                    ...data,
                                    valorFrom: valor

                                })}>
                            </TextInput>


                        </View>
                        <View style={{ borderColor: colors.primary, ...styles.input }}>

                            <Image
                                source={moedas[selectedIndex2].avatarUrl}
                                style={styles.imageStyle} />
                            <Text style={{ marginTop: 14, marginLeft: 5, color: colors.text }}>{moedas[selectedIndex2].value}</Text>
                            <TextInput
                                keyboardType='decimal-pad'
                                placeholderTextColor='grey'
                                defaultValue={newSell === 'new' ? '' : user.valorTo}
                                style={{ color: colors.text, padding: 10 }}
                                placeholder='Preço por nota'
                                returnKeyLabel='Ok'
                                maxLength={9}
                                returnKeyType='done'
                                onChangeText={(valor) => setData({
                                    ...data,
                                    valorTo: valor

                                })} />

                        </View>

                    </View>
                    <Text style={{ ...FONTS.h3, marginBottom: 5, color: colors.text }}>Selecione o banco a depositar/transferir</Text>
                    <SafeAreaView style={{ marginLeft: 0, width: '100%', marginBottom: 15 }}>
                        <Select
                            optins={ListOfBanckAngola}
                            onChangeSelect={(id, name, value) => {
                                setBancoSelecionado(name);

                            }}
                            text='Selecione o banco a depositar'
                            OptionComponent={OptionWithFoto}
                        />
                    </SafeAreaView>
                    <View style={{ backgroundColor: colors.background, marginBottom: 15 }}>
                        <CheckBox
                            title='Negociavel '
                            checked={isNegociavel}
                            containerStyle={{ backgroundColor: colors.background }}
                            textStyle={{ color: colors.text }}
                            onPress={() => {
                                setIsNegociavel(!isNegociavel)
                            
                            }}
                        />
                    </View>
                    <View style={{ borderColor: colors.primary, ...styles.inputComent }}>
                        <TextInput
                            multiline={true}
                            numberOfLines={10}
                            autoCapitalize="sentences"
                            defaultValue={newSell === 'new' ? '' : user.comentar}
                            placeholder="Descrição da Venda... (Opcional)"
                            placeholderTextColor='grey'
                            onChangeText={(valor) => setData({
                                ...data,
                                comentar: valor

                            })}
                            style={{ height: 100, justifyContent: 'flex-start', color: colors.text, }}


                        />

                    </View>

                    <View style={{ width: '100%', marginTop: 10 }}>
                        <Button
                            onPress={() => {
                                if (data.valorTo !== '' && data.valorFrom !== '' && moedaSelecionada !== null && moedaSelecionada2 !== null && bancoSelecionado !== null) {
                                    newSell === 'new' ? publishSells() : editSell()
                                } else {
                                    Alert.alert(
                                        "Campos Vazios",
                                        'Por favor Preencha todos campos!'
                                    )
                                }

                            }}
                            icon={
                                <Ionicons style={{ marginRight: 10 }} name="checkmark-done-circle-outline" size={25} color="white" />
                            }

                            title="Publicar Venda"
                            loading={isLoading}
                            containerStyle={{ borderRadius: 10, borderColor: colors.primary }}
                        />

                    </View>

                </View>

            </View>
        </View >
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        right: 0,
        bottom: 0,

    },
    background: {

        height: 100,
        //shadowColor: '#000',
        //shadowOffset: {width: 0, height: 3 },
        //shadowOpacity: 3,
        shadowRadius: 2,
        elevation: 0
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    background2: {

        height: 140,

    },
    inputIOS: {
        fontSize: 14,
        borderWidth: 1,
        height: 40,
        width: 110,
        borderRadius: 8,
        flex: 1,
        flexDirection: 'row',
        color: 'black',

    },
    panel: {
        padding: 20,
        paddingTop: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 5,
        elevation: 0,
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

        alignItems: 'center',
        marginVertical: 7,
    },
    panelButton1: {
        padding: 13,
        borderRadius: 10,
        marginTop: 5,

        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },

    switchMoeda: {
        marginBottom: 15,
        marginLeft: 3,
        marginRight: 3
    },
    imageStyle: {
        padding: 5,
        marginLeft: 10,
        height: 25,
        width: 25,
        marginTop: 10,
        resizeMode: 'stretch',
        alignItems: 'center',
    },
    input: {
        flexDirection: 'row',
        borderWidth: 1,
        height: 50,
        width: 180,
        //marginHorizontal:10,
        borderRadius: 7,
        marginBottom: 15,

    },
    inputComent: {

        paddingLeft: 10,
        borderWidth: 1,

        width: '100%',
        borderRadius: 7,
        marginBottom: 15,

    },
    btnCancelar: {
        borderRadius: 7,

    },
    button: {
        alignItems: 'center',
        marginTop: 0,
        width: 360
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

})