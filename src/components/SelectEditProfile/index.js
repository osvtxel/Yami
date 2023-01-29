import React, { useState } from 'react'
import { View, TouchableOpacity, Text, Modal, FlatList, StyleSheet, Dimensions, StatusBar, Image } from 'react-native'
import { Entypo, MaterialCommunityIcons,FontAwesome } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native'


const { width } = Dimensions.get('window')

const Select = ({ optins, onChangeSelect, text, OptionComponent }) => {
    const { colors } = useTheme();
    const theme = useTheme();
    const [txt, setTxt] = useState(text)
    const [image, setImage] = useState(null)
    const [selected, setSelected] = useState('')
    const [modalVisivel, setModalVisivel] = useState(false)

    
    function renderOption(item, index) {
        return (
            <OptionComponent item={item} index={index} selected={selected} change={(id, name, code,) => {
                setTxt(name);
                setModalVisivel(false);
                setSelected(id);
                onChangeSelect(id,name,code)
            }} />
        )
    }
    return (
        <>
            <TouchableOpacity style={{ backgroundColor: colors.background, borderColor: colors.primary, ...styles.container }} onPress={() => setModalVisivel(true)}>
                <Text style={{color:  theme.dark ? colors.text :colors.text , ...styles.txt }} numberOfLines={1}>{txt}</Text>
                <Entypo name="chevron-small-down" size={26} color={colors.primary} />
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
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index}) => renderOption(item, index)}
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
        paddingHorizontal: 5,
        marginHorizontal: 0,
        paddingVertical: 10,
        fontSize: 16,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    txt: {
        fontSize: 16,
        width: width-100

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
        
        marginRight: 5
    }
});


export default Select;

