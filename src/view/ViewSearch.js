import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Text, Modal, FlatList, StyleSheet, Dimensions, StatusBar, Image, Platform } from 'react-native'
import { Entypo, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { SearchBar, ListItem, Avatar } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native'
import { auth, db } from '../services/firebase'
import NumberFormat from 'react-number-format'
import ViewMoreText from 'react-native-view-more-text'
import Spinner from 'react-native-loading-spinner-overlay';

import {
    Title,
    Caption,
    Card,
    Snackbar
}
    from 'react-native-paper'
import MoedaList from '../data/ListaMoedas'
import moment from 'moment'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import 'moment/locale/pt'



const { width } = Dimensions.get('window')
const Tab = createMaterialTopTabNavigator();
const ViewSearch = ({ optins, navigation }) => {
    const { colors } = useTheme();
    const theme = useTheme();
    const [search, setSearch] = useState('')
    const [limit, setLimit] = useState(100)
    const [isLoading, setIsLoading] = useState(false)
    const [moedas, setMoedas] = useState(MoedaList)
    const [thousandSeparator, setThousandSeparator] = useState('.')
    const [selected, setSelected] = useState('')
    const [listTakeVendas, setListTakeVendas] = useState([])
    const [listTakeUsuarios, setListTakeUsuario] = useState([])
    const [fullData, setFullData] = useState([])
    const [fullDataUsuario, setFullDataUsuario] = useState([])
    const [lastDocId, setLastDocId] = useState("")
    const [query, setQuery] = useState('');
    const [modalVisivel, setModalVisivel] = useState(true)
    const UidUser = auth.currentUser.uid



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

    /**
     * take sell from firebase
     */
    useEffect(() => {
        takeSellsFromFirebase()
    }, [])

    /**
     *take user from firebase 
     */
    useEffect(() => {
        takeUserFromFirebase()
    }, [])


    /***
      * Pegar as vendas todas
      */
    const takeSellsFromFirebase = async () => {
        setIsLoading(true)
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
                        SellDetails = doc.data();
                        SellDetails['id'] = doc.id;
                        temp.push(SellDetails);
                        setListTakeVendas(temp)
                        setFullData(temp)
                        setIsLoading(false)
                        //pegar os gostos

                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc.id, " => ", lastDoc);
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
            return () => vendasTodas();
        } catch (error) {

        }

    }


    /***
     * Pegar os ddos dos usuarios
     */
    const takeUserFromFirebase = async () => {
        //setIsLoading(true)
        try {
            const vendasUsuarios = await db.collection("Users")
                .orderBy("firstName", "desc")
                .limit(limit)
                .get()
                .then((querySnapshot) => {
                    let temp = [];
                    let DocumentDatas = querySnapshot.docs.map(docume =>
                        docume.data())
                    querySnapshot.forEach((doc) => {
                        let SellDetails = {};
                        SellDetails = doc.data();
                        SellDetails['id'] = doc.id;
                        temp.push(SellDetails);
                        setListTakeUsuario(temp)
                        setFullDataUsuario(temp)
                        //setIsLoading(false)

                        //pegar os gostos
                        // doc.data() is never undefined for query doc snapshots
                        //console.log(doc.id, " => ", temp);
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
            return () => vendasUsuarios();
        } catch (error) {

        }

    }



    const SugestoesPesquisas = () => {

        return (
            <View style={{ flex: 1, borderTopWidth: 0.5, flexDirection: 'column' }}>
                <Title style={{ fontWeight: 'bold', marginHorizontal: 10, marginVertical: 20 }}>Sugestoes de Pesquisas</Title>
                <View>
                    <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 10, marginBottom: 15 }} onPress={() => {
                        setQuery("Russia")
                        handleSearch("Russia")
                    }}>
                        <Ionicons
                            name="search"
                            color={colors.text}
                            size={20} />
                        <Text style={{ fontSize: 15, marginLeft: 10, marginBottom: 10 }}>
                            {"Notas na Russia"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 10, marginBottom: 15 }} onPress={() => {
                        setQuery("POrtugal")
                        handleSearch("Portugal")
                    }} >
                        <Ionicons
                            name="search"
                            color={colors.text}
                            size={20} />
                        <Text style={{ fontSize: 15, marginLeft: 10, marginBottom: 10, marginBottom: 10 }}>
                            {"Notas em Portugal"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 10, marginBottom: 15 }} onPress={() => {
                        setQuery("KZ")
                        handleSearch("KZ")
                    }} >
                        <Ionicons
                            name="search"
                            color={colors.text}
                            size={20} />
                        <Text style={{ fontSize: 15, marginLeft: 10, marginBottom: 10, marginBottom: 10 }}>
                            {"Kwanza"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 10, marginBottom: 15 }} onPress={() => {
                        setQuery("EUR")
                        handleSearch("EUR")
                    }}>
                        <Ionicons
                            name="search"
                            color={colors.text}
                            size={20} />
                        <Text style={{ fontSize: 15, marginLeft: 10, marginBottom: 10 }}>
                            {"Euro"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 10, marginBottom: 15 }} onPress={() => {
                        setQuery("USD")
                        handleSearch("USD")
                    }}>
                        <Ionicons
                            name="search"
                            color={colors.text}
                            size={20} />
                        <Text style={{ fontSize: 15, marginLeft: 10, marginBottom: 10 }}>
                            {"Dolar"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 10, marginBottom: 15 }} onPress={() => {
                        setQuery("RUB")
                        handleSearch("RUB")
                    }}>
                        <Ionicons
                            name="search"
                            color={colors.text}
                            size={20} />
                        <Text style={{ fontSize: 15, marginLeft: 10, marginBottom: 10 }}>
                            {"Rublos"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    /**
     * 
     * @returns 
     */
    function MyTabs() {
        return (
            <Tab.Navigator>
                <Tab.Screen name="Vendas" component={Vendas} />
                <Tab.Screen name="Vendedores" component={Vendedores} />
                <Tab.Screen name="Moedas" component={Moedas} />
            </Tab.Navigator>
        );
    }

    const Moedas = () => {
        const keyExtractor = (item, index) => index.toString();
        const renderItem = ({ item }) => (
            <ListItem bottomDivider>
                <Avatar rounded source={item.avatarUrl} />
                <ListItem.Content>
                    <ListItem.Title>{item.label}</ListItem.Title>
                    <ListItem.Subtitle>{item.value}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>)

        return (
            <>
                <FlatList
                    keyExtractor={keyExtractor}
                    data={moedas}
                    renderItem={renderItem}
                />
            </>

        )
    }
    const handleSearch = text => {
        const formattedQuery = text.toLowerCase();
        const filteredData = fullData.filter((item) => {
            return item.firstName.toLowerCase().includes(text.toLowerCase()) || item.lastname.toLowerCase().includes(text.toLowerCase()) || item.countryUser.toLowerCase().includes(text.toLowerCase()) ||
                item.moedaTo.toLowerCase().includes(text.toLowerCase()) || item.moedaFrom.toLowerCase().includes(text.toLowerCase()) || item.comentar.toLowerCase().includes(text.toLowerCase()) || item.simbolysFrom.toLowerCase().includes(text.toLowerCase()) || item.simbolysTo.toLowerCase().includes(text.toLowerCase());
        });
        setListTakeVendas(filteredData);
        setListTakeUsuario(filteredData);
        //setMoedas(filteredData)
        setQuery(text)
    }
    /**
     * 
     * @returns 
     */
    const Vendedores = () => {
        const keyExtractor = (item, index) => index.toString();
        const renderItem = ({ item }) => (
            <ListItem bottomDivider>
                <Avatar rounded source={{ uri: item.userImg }} />
                <ListItem.Content>
                    <ListItem.Title>{item.firstName + ' ' + item.lastname}</ListItem.Title>
                    <ListItem.Subtitle>{item.country}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        )
        return (
            <>
                <Spinner
                    visible={isLoading}
                    textContent={'Aguarde...'}
                    textStyle={styles.spinnerTextStyle}
                />
                <FlatList
                    keyExtractor={keyExtractor}
                    data={listTakeUsuarios}
                    renderItem={renderItem}
                />
            </>

        )
    }
    /**
     * 
     * @returns 
     */
    const Vendas = () => {

        const keyExtractor = (item, index) => index.toString();
        /**
               * Card View das vendas Todas
               * @param {} param0 
               * @returns 
               */
        const cardViewSearch = ({ item, index }) => (
            <Card elevation={3} key={index} style={{ marginTop: 5, color: colors.card }}>
                <Card.Title titleStyle={{ fontSize: 16 }} subtitleStyle={{ fontSize: 12 }} title={item.firstName + ' ' + item.lastname} subtitle={moment(item.dataPubl).locale('pt').fromNow(false) + " • " + item.countryUser} left={props =>
                    <Avatar
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
                    </Avatar>} />
                <Card.Content >
                    <ViewMoreText
                        numberOfLines={3}
                        renderViewMore={renderViewMore}
                        renderViewLess={renderViewLess}
                        textStyle={{ textAlign: 'auto' }}>

                        <Text style={{ marginBottom: 10 }}>
                            {item.comentar}
                        </Text>
                    </ViewMoreText>

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
                    </View>
                </Card.Content>
            </Card>

        )
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Spinner
                    visible={isLoading}
                    textContent={'Aguarde...'}
                    textStyle={styles.spinnerTextStyle}
                />
                <FlatList
                    keyExtractor={keyExtractor}
                    data={listTakeVendas}
                    renderItem={cardViewSearch}
                />
            </View>

        )
    }
    /**
     * 
     *  */
    return (
        <>
            <StatusBar backgroundColor={colors.background} barStyle={theme.dark ? 'default' : 'dark-content'} />
            <Modal
                animationType='slide'
                visible={modalVisivel}
                onRequestClose={() => setModalVisivel(false)} >

                <SafeAreaView>
                    <View style={{ borderBottomColor: colors.border, backgroundColor: colors.background, ...styles.headerModal }}>
                        <SearchBar
                            lightTheme={true}
                            containerStyle={{ borderRadius: 0 }}
                            round={true}
                            autoFocus
                            platform={Platform.OS === 'android' ? 'android' : 'ios'}
                            showCancel={Platform.OS === 'ios' ? true : false}
                            inputContainerStyle={{ height: 40 }}
                            onCancel={() => {
                                navigation.navigate('ViewHome')
                                setModalVisivel(!modalVisivel)
                            }}
                            placeholder="Pesquisar..."
                            onChangeText={queryText => handleSearch(queryText)}
                            value={query}

                        />

                    </View>
                    {
                        <FlatList
                            data={optins}
                            keyExtractor={(item) => String(item.key)}
                            renderItem={({ item }) => renderOption(item)}
                        />
                    }
                </SafeAreaView>
                {query ? MyTabs() : SugestoesPesquisas()}
            </Modal>
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        height: 45,
        paddingHorizontal: 10,
        marginHorizontal: 0,
        paddingVertical: 10,
        borderRadius: 8,
        fontSize: 16,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    txt: {

        fontSize: 16,
        width: width - 350

    },
    headerModal: {
        margin: 0,
        // alignItems: 'center',
        justifyContent: 'space-between',
        //borderBottomWidth: 1,

        paddingBottom: 0,
    },
    modalTitle: {
        fontSize: 18,
        //color: '#555',

    },
    modalCancel: {
        fontSize: 14,


    }, optionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        padding: 10
    },
    optionTxt: {
        fontSize: 16
    },
    avatar: {
        height: 25,
        width: 25,
        borderRadius: 25,
        marginRight: 12
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
        padding: 5,
        //margin: 5,
        height: 25,
        width: 25,
        //marginTop: 10,
        resizeMode: 'stretch',
        alignItems: 'center',
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    viewLinha: {
        height: 0.5,
        width: '100%',
        opacity: 0.5,
        //backgroundColor: colors.greyish,
        marginTop: 0,
        marginBottom: 10

    },
});


export default ViewSearch;

