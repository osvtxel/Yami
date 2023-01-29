import React, { useState } from 'react'
import { View, TouchableOpacity, Text, Modal, FlatList, StyleSheet, Dimensions, StatusBar, Image } from 'react-native'
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native'


const { width } = Dimensions.get('window')

const Select = ({ optins, onChangeSelect, text, OptionComponent }) => {
    const { colors } = useTheme();
    const [txt, setTxt] = useState(text)
    const [image, setImage] = useState(null)
    const [selected, setSelected] = useState('')
    const [modalVisivel, setModalVisivel] = useState(false)

    
    function renderOption(item) {
        return (
            <OptionComponent item={item} selected={selected} change={(id, name, image, value) => {
                setTxt(name);
                setImage(image);
                setModalVisivel(false);
                setSelected(id);
                onChangeSelect(id, name,value)
            }} />
        )
    }
    return (
        <>
            <TouchableOpacity style={{ backgroundColor: colors.background, borderColor: colors.primary, ...styles.container }} onPress={() => setModalVisivel(true)}>
                {image !== null ? <Image source={image} style={styles.avatar} /> : null}
                <Text style={{ color: colors.text, ...styles.txt }} numberOfLines={1}>{txt}</Text>
                <Entypo name="chevron-small-down" size={26} color={colors.text} />
            </TouchableOpacity>
            <Modal
                animationType='slide'
                visible={modalVisivel}
                onRequestClose={() => setModalVisivel(false)}

            >
                <SafeAreaView>
                    <View style={{ borderBottomColor: colors.border, backgroundColor: colors.background, ...styles.headerModal }}>
                        <TouchableOpacity onPress={() => setModalVisivel(false)}>
                            <Entypo name="chevron-small-left" size={30} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={{ color: colors.text, ...styles.modalTitle }}>{text}</Text>
                        <TouchableOpacity onPress={() => setModalVisivel(false)}>
                            <Text style={{ color: colors.text, ...styles.modalCancel }}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                    {
                    <FlatList
                        data={optins}
                        keyExtractor={(item) => String(item.key)}
                        renderItem={({ item }) => renderOption(item)}
                    />
                    }
                </SafeAreaView>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        paddingBottom: 12,
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
    }
});


export default Select;

