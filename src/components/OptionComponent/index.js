import React  from "react";
import {View,Text, TouchableOpacity, StyleSheet} from 'react-native';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'



const OptionComponent = ({item, index, selected, change}) => {
    return  (
        <TouchableOpacity style={[styles.optionsContainer, {backgroundColor:index === selected ? '#eee': '#fff'}]}
            onPress={()=> {
               change(index,item.name,item.code,item.states);
            }}
        >
            <Text style={[styles.optionTxt,{fontWeight:index=== selected ? 'bold': 'normal'}]}>{item.name}</Text>
            {index === selected && (<Entypo name={"check"} size={22} color={'green'} />)}
        </TouchableOpacity>

    )
};

const styles = StyleSheet.create({
    optionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        padding: 10
    },
    optionTxt: {
        fontSize: 16
    }
});

export default OptionComponent;