import React, { createRef, useContext, useState, useRef, useEffect } from 'react'
import { Alert, FlatList, Image, View, StyleSheet, Text, TouchableOpacity, TextInput, StatusBar } from 'react-native'
import { MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@react-navigation/native'
import MoedaList from '../data/ListaMoedas'
import ListaMoedasInvertida from '../data/ListaMoedasInvertida';
import { FONTS, SIZE } from '../constant/themes'
import { Button } from 'react-native-elements'
import { auth, db } from '../services/firebase'
import NumberFormat from 'react-number-format'




export default ({route, navigation}) => {

  
    const [isLoading, setIsLoading] = useState(false)
    const { user } = route.params;
    const theme = useTheme();
    const { colors } = useTheme();
    const [moedas, setMoedas] = useState(MoedaList)
    const [moedasInv, setMoedasInv] = useState(ListaMoedasInvertida)
    const [moedaSelecionada, setMoedaSelecionada] = useState("AOA")
    const [moedaSelecionada2, setMoedaSelecionada2] = useState("EUR")
    const [selectedIndex, setIndexTake] = useState()
    const [selectedIndex2, setIndexTake2] = useState()
    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);
    const [visible, setVisible] = useState(false)
    const [textError, setTextError] = useState('')
    const UidUser = auth.currentUser.uid
    const [data, setData] = useState({
        valorFrom: '',
        valorTo: '',
        dataPubl: new Date().getTime(),
        moedaFrom: moedaSelecionada,
        moedaTo: moedaSelecionada2,
        imageUrlFrom: selectedIndex,
        imageUrlTo: selectedIndex2,
        comentar: '',

    });

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
                            nameSeller: doc.data().name,
                            countryUser: doc.data().country,
                            //imageProf: doc.data().imageUrl,
                            idSell: Math.floor(Math.random() * 100) + 1,
                            userUId: UidUser,
                            like: "0",
                            liked:false,
                            valorFrom: data.valorFrom,
                            valorTo: data.valorTo,
                            dataPubl: data.dataPubl,
                            moedaFrom: data.moedaFrom,
                            moedaTo: data.moedaTo,
                            imageUrlFrom: selectedIndex,
                            comentar: data.comentar,
                        }).then(() => {
                            setIsLoading(false)
                            props.navigation.navigate('princ')
                        }
                        ).catch((error) => {
                            onToggleSnackBar()
                            setTextError('Erro de conexao! Verifica a tua internet.')
                        })
                    // doc.data() is never undefined for query doc snapshots
                    //console.log(doc.id, " => ", doc.data());
                })
                .catch((error) => {
                    onToggleSnackBar()
                    setTextError('Erro de conexao! Verifica a tua internet.')
                });

        } catch (error) {

        }
    }


    
    return (
        <View style={styles.container}>
             <StatusBar backgroundColor={colors.background} barStyle={theme.dark ? 'default' : 'dark-content'} />
           
            <View styles={{backgroundColor: colors.background }}>

                <View style={styles.panel}>
                    <View style={{
                        flexDirection: 'row', alignContent: 'space-between', marginBottom: 5, marginTop: 5,
                        shadowOffset: { width: 0, height: 0 },
                     
                    }}>
                        <TouchableOpacity
                            onPress={() =>navigation.goBack()}>
                            <MaterialCommunityIcons name="close" size={28} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={{
                            fontSize: 18,
                            height: 35,
                            marginLeft: 90,color:colors.text
                        }}>Negociar a Venda</Text>

                    </View>
                    <Text style={{...FONTS.h3, marginTop:10,marginBottom:10,color:colors.text}}>Digite quanto pretende comprar:</Text>

                    <View style={{backgroundColor:colors.background,borderColor:colors.primary,...styles.input}}> 
                        <Image
                            source={moedas[user.imageUrlFrom].avatarUrl}
                            style={styles.imageStyle} />
                        <Text style={{ color:colors.text, marginTop: 14, marginRight:5,marginLeft: 2,color:colors.text }}>{moedas[user.imageUrlFrom].value}</Text>
                        <TextInput
                            placeholder='Quanto Pretende Comprar?'
                            keyboardType='decimal-pad'
                            defaultValue={user.valorFrom}
                            placeholderTextColor='grey'
                            autoFocus={true}
                            style={{ flex: 1, color: colors.text, }}
                            onChangeText={(valor) => setData({
                                ...data,
                                valorFrom: valor

                            })}>
                        </TextInput>


                    </View>
                    <Text style={{...FONTS.h3, marginTop:10,marginBottom:10,color:colors.text}}>Digite a quanto pretende comprar:</Text>
                    <View style={{ backgroundColor:colors.background, borderColor:colors.primary,...styles.input}}>

                        <Image
                            source={moedas[user.imageUrlTo].avatarUrl}
                            style={styles.imageStyle} />
                        <Text style={{ marginTop: 14, marginLeft: 2, marginRight:5, color:colors.text }}>{moedas[user.imageUrlTo].value}</Text>
                        <TextInput
                            keyboardType='decimal-pad'
                            placeholderTextColor='grey'
                            style={{ flex: 1, color: colors.text,}}
                            placeholder='Digiite o valor que pretende negoc....'
                            onChangeText={(valor) => setData({
                                ...data,
                                valorTo: valor

                            })} />

                    </View>
                    <Text style={{...FONTS.h3, marginTop:10,marginBottom:10, color:colors.text}}>Envie um comentário ao Vendedor.</Text>
                    <View style={{backgroundColor:colors.background, borderColor:colors.primary,...styles.inputComent}}>
                        <TextInput
                            multiline={true}
                            numberOfLines={10}
                            autoCapitalize="sentences"
                            placeholder="Envie um comentario ao comprador..."
                            placeholderTextColor='grey'
                            onChangeText={(valor) => setData({
                                ...data,
                                comentar: valor

                            })}
                            style={{ height: 100, justifyContent: 'flex-start',color: colors.text, }}


                        />

                    </View>

                    <View style={{ width: '100%', marginTop: 10}}>
                        <Button
                            onPress={() => {
                                if (data.valorTo !== '' && data.valorFrom !== '' && moedaSelecionada !== null && moedaSelecionada2 !== null) {
                                   publishSells() 
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
                            containerStyle={{borderRadius:10, borderColor:colors.primary}}
                        />

                    </View>

                </View>

            </View>
        </View>
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
    switchMoeda: {
        marginBottom: 15,
        marginLeft: 3,
        marginRight: 3
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
        borderWidth: 1,     
        height: 50,
        width: '100%',
        borderRadius: 7,
       // marginBottom: 15,

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

})