import React, { useState, useContext } from "react";
import { View, StyleSheet, Text, Image, Alert, } from 'react-native';
import { AuthContext } from '../routes/AuthProvider';
import FormInput from "../components/FormInput";
import { useTheme } from '@react-navigation/native'
import { auth, db, storage } from '../services/firebase'
import { Title, } from 'react-native-paper'
import FormButton from "../components/FormButton";
import Spinner from 'react-native-loading-spinner-overlay';




const ViewFinalVerifications = ({ navigation }) => {
    const [email, setEmail] = useState(null);
    const theme = useTheme();
    const [confirmationsSucess, setConfirmationsSucess] = useState(true)
    const { colors } = useTheme();
    const [isLoading, setIsLoading] = useState(false)
    const UidUser = auth.currentUser.uid





    /***
   * Atualizar
   */
    const updateUserVerifications = () => {
        var ProfileUpdate = db.collection("UserVerifications").doc(UidUser);
        return ProfileUpdate.update({
            userVerifications: confirmationsSucess,
        })

    }
    return (
        <View style={{ backgroundColor: colors.background, ...styles.container }}>
            <Spinner
                visible={isLoading}
                textContent={'Aguarde...'}
                textStyle={styles.spinnerTextStyle}
            />
            <Title style={{ color: colors.text, ...styles.text }}>PARABÉNS</Title>
            <Image
               source={require('../assents/done.png')}
                style={styles.logo}
            />
            <Text style={{ color: colors.text, ...styles.text2 }}>Completou com sucesso a verificação da tua conta</Text>
            <Text style={{ color: colors.text, fontSize: Platform.OS ==='ios' ? 15 : 13, }}>Podes agora desfrutar de todos os recursos</Text>
            <Text style={{ color: colors.text, fontSize: Platform.OS ==='ios' ? 15 : 13, marginBottom: 20 }}>que YAME oferece.</Text>
            <FormButton
                buttonTitle="CONFIRMAR"
                onPress={() => {
                    navigation.navigate("ViewHome")
                    updateUserVerifications()

                }}
            />


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        //backgroundColor: '#f9fafd',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        //fontFamily: 'Kufam-SemiBoldItalic',
        fontSize: 30,
        marginBottom: 15,
        marginTop: 30,
        alignSelf: 'center',
        
    },
    text2: {
        //fontFamily: 'Kufam-SemiBoldItalic',
        fontSize: Platform.OS ==='ios' ? 15 : 13,
        marginTop: 30,
        alignSelf: 'center',
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
        height: 200,
        width: 200,
        alignSelf: "center",
        resizeMode: 'cover',
    },
});
export default ViewFinalVerifications;