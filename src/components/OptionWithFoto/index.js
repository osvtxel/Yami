import React  from "react";
import {View,Text,Image, TouchableOpacity, StyleSheet} from 'react-native';

import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'



const OptionComponent = ({item, selected, change}) => {

    //console.log(item)
    return (
        <TouchableOpacity style={[styles.optionsContainer, {backgroundColor:item.key === selected ? '#eee': '#fff'}]}  onPress={()=> {
            change(item.key,item.label,item.avatarUrl,item.value);
         }}>
            <View style={styles.left}>
                <Image source={item.avatarUrl} style={styles.avatar}/>
                <View style={{flexDirection:'column'}}>
                <Text style={styles.optionTxt}>{item.name}</Text>
                <Text style={{fontSize:12}}>{item.label}</Text>
                </View>
           
            </View>
            
            {item.key === selected && (<Entypo name={"check"} size={22} color={'green'} />)}
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
        padding: 10,
       
    },
    optionTxt: {
        fontSize: 16
    },
    left:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar:{
        height:25,
        width:25,
        borderRadius:25,
        marginRight:12
    }
});
export default OptionComponent;