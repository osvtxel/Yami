import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, Text, Image, Alert, Platform, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { auth, db, storage } from '../services/firebase'
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../routes/AuthProvider';
import FormInput from "../components/FormInput";
import { Title, } from 'react-native-paper'

import { useFocusEffect, useTheme } from '@react-navigation/native'
import FormButton from "../components/FormButton";
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { initializeApp, getApp } from 'firebase/app';
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';

// Firebase references
const app = getApp();
const auth1 = getAuth();

// Double-check that we can run the example
if (!app?.options || Platform.OS === 'web') {
    throw new Error('This example only works on Android or iOS, and requires a valid Firebase config.');
}



const phone = Platform.OS === 'ios' ? 'cellphone-iphone' : 'cellphone-android'
const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState(null);
    const recaptchaVerifier = React.useRef(null);
    const [verificationId, setVerificationId] = React.useState(null);
    const [message, showMessage] = React.useState();
    const attemptInvisibleVerification = false;
    const firebaseConfig = app ? app.options : undefined;
    const theme = useTheme();
    const { colors } = useTheme();
    const [phoneCode, setPhoneCode] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState('')
    const [verificationCode, setVerificationCode] = React.useState();
    const UidUser = auth.currentUser.uid


    useEffect(() => {
        takeUser()
    }, [])
    /***
     * Pegar dados do usuario
     */
    const takeUser = async () => {
        try {
            setIsLoading(true)
            await
                db.collection("UserVerifications").doc(UidUser)
                    .get()
                    .then((doc) => {
                        setPhoneCode(doc.data().phoneCode)
                    }).then(() => {
                        setIsLoading(false)
                    })
                    .catch((error) => {
                        alert('Problemas em carregar os dados, verifique a tua conexão, por favor');

                    });

        } catch (error) {

        }
    }

    /***
  * Atualizar
  */
    const updateUser = () => {
        var ProfileUpdate = db.collection("Users").doc(UidUser);
        return ProfileUpdate.update({
            telefone: phoneNumber
        })

    }
    const updateUserVerifications = () => {
        var ProfileUpdate = db.collection("UserVerifications").doc(UidUser);
        return ProfileUpdate.update({
            telefone: phoneNumber
        })

    }
    const showMsgErro = () => {
        Alert.alert(
            "ERRO",
            'O código inserido não correponde ao código enviado!'
        )
    };

    



    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

            <View style={{ backgroundColor: colors.background, ...styles.container }}>
                <Spinner
                    visible={isLoading}
                    textContent={'Aguarde...'}
                    textStyle={styles.spinnerTextStyle}
                />
                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={app.options}
                // attemptInvisibleVerification
                />
                <View style={{ borderBottomWidth: 0.5, width: '100%', alignItems: 'center', marginBottom: 30 }}>
                    <Title style={{ color: colors.text, justifyContent: 'center', fontSize: 18, }}>{'Verificação do número de telefone'} </Title>
                </View>
                <Image
                    source={{
                        uri: 'https://www.freepnglogos.com/uploads/mobile-png/mobile-smartphone-icon-long-shadow-media-iconset-pelfusion-33.png'
                    }}
                    style={styles.logo}
                />
                {verificationId ? null : <View style={{ padding: 20, alignContent: 'center', }}>
                    <FormInput
                        labelValue={phoneNumber}
                        onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
                        placeholderText="Digite o número telefone..."
                        iconType={phone}
                        maxLenght={12}
                        phoneVer={true}
                        phoneCode={phoneCode}
                        autoCapitalize="none"
                        keyboardType="phone-pad"
                    />

                </View>}
                {verificationId ? <View style={{ padding: 20, alignContent: 'center', }}>
                    <FormInput
                        labelValue={verificationCode}
                        onChangeText={setVerificationCode}
                        placeholderText="Por favor insira o codigo"
                        iconType={'numeric'}
                        maxLenght={12}
                        phoneVer={false}
                        phoneCode={phoneCode}
                        autoCapitalize="none"
                        keyboardType="phone-pad"
                    />

                </View> : null}
                {verificationId ? <Text style={{ color: colors.text, ...styles.text2 }}>Foi enviado o código de confirmação no seu telemóvel</Text>:null}
                {verificationId ? <Text style={{ color: colors.text,  fontSize: Platform.OS ==='ios' ? 15 : 13 }}>Por favor insira o código no campo acima</Text>: null}
                {verificationId ? <Text style={{ color: colors.text,  fontSize: Platform.OS ==='ios' ? 15 : 13 }}>e clica em verificar código</Text>:null}
                

                <View style={{ justifyContent: 'flex-end', width: '90%' }}>
                    {phoneNumber.length >= 8 && verificationId === null ? <FormButton
                        buttonTitle="Enviar o Código"
                        onPress={async () => {
                            // The FirebaseRecaptchaVerifierModal ref implements the
                            // FirebaseAuthApplicationVerifier interface and can be
                            // passed directly to `verifyPhoneNumber`.
                            try {
                                const phoneProvider = new PhoneAuthProvider(auth1);
                                const verificationId = await phoneProvider.verifyPhoneNumber(
                                    phoneCode + phoneNumber,
                                    recaptchaVerifier.current
                                );
                                setVerificationId(verificationId);
                            } catch (err) {
                               showMsgErro()
                            }
                        }
                        }
                    /> : null}
                    {verificationCode ? <FormButton
                        buttonTitle="Verificar o código"
                        onPress={async () => {
                            try {
                                const credential = PhoneAuthProvider.credential(
                                    verificationId,
                                    verificationCode
                                );

                                navigation.navigate('finalVer')
                                updateUser()
                                updateUserVerifications()
                            } catch (err) {
                                showMsgErro()
                            }
                        }}
                    /> : null}
                    <FormButton
                        buttonTitle="VOLTAR"
                        onPress={() => {
                            navigation.navigate("imageDocument")
                        }}
                    />
                </View>
                {message ? (
                    <TouchableOpacity
                        style={[
                            StyleSheet.absoluteFill,
                            { backgroundColor: 0xffffffee, justifyContent: 'center' },
                        ]}
                        onPress={() => showMessage(undefined)}>
                        <Text
                            style={{
                                color: message.color || 'blue',
                                fontSize: 17,
                                textAlign: 'center',
                                margin: 20,
                            }}>
                            {message.text}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    undefined
                )}
                {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        //backgroundColor: '#f9fafd',
        flex: 1,
        //justifyContent: 'center',
        marginVertical: 20,
        alignItems: 'center',

    },
    text: {
        //fontFamily: 'Kufam-SemiBoldItalic',
        fontSize: 15,
        marginBottom: 10,
        marginTop: 30,
        alignSelf: 'flex-start',
        color: '#051d5f',
    },
    text2: {
        //fontFamily: 'Kufam-SemiBoldItalic',
        fontSize: Platform.OS ==='ios' ? 15 : 13,
        marginTop: 15,
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
        height: 150,
        width: 150,
        alignSelf: "center",
        resizeMode: 'cover',
    },
});
export default ForgotPassword;