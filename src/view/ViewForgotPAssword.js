import React, { useState, useContext} from "react";
import { View, StyleSheet, Text,Image,Alert } from 'react-native';
import { AuthContext } from '../routes/AuthProvider';
import FormInput from "../components/FormInput";
import { useTheme } from '@react-navigation/native'
import FormButton from "../components/FormButton";



const ForgotPassword = ({navigation}) => {
    const [email, setEmail] = useState(null);
    const theme = useTheme();
    const { colors } = useTheme();
    const { recoverPassword } = useContext(AuthContext);

    return (
        <View style={{backgroundColor:colors.background,...styles.container }}>
            <Image
                source={require('../assents/splash2.png')}
                style={styles.logo}
            />
            <Text style={{color:colors.text ,...styles.text }}>Esqueceu a Senha ?</Text>
            <FormInput
                labelValue={email}
                onChangeText={(email) => setEmail(email)}
                placeholderText="Digite o e-mail..."
                iconType="email-outline"
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <FormButton
                buttonTitle="Enviar Mensagem"
                onPress={() => { 
                    if(email!==null){
                        recoverPassword(email, navigation)                 
                    }else{
                        Alert.alert(
                            "Campo Vazio",
                            'Por favor Preencha o campo de E-mail!'
                          ) 
                    }
                    
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        //backgroundColor: '#f9fafd',
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        //fontFamily: 'Kufam-SemiBoldItalic',
        fontSize: 15,
        marginBottom: 10,
        marginTop: 30,
        alignSelf: 'flex-start',
        color: '#051d5f',
    },
    navButton: {
        marginTop: 15,
        marginBottom: 10,
    },
    forgotButton2: {
        marginVertical: 2,
        alignSelf: "center",
        marginTop: 5,
        marginBottom: 20
    },
    logo: {
        height: 150,
        width: 150,
        alignSelf: "center",
        resizeMode: 'cover',
      },
});
export default ForgotPassword;