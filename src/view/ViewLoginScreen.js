import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import { AuthContext } from '../routes/AuthProvider';

const ViewLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [safeEntrypassword, setSafeEntryPassword] = useState(false);
  const [iconType, setIconType] = useState('lock-outline');
  const [textError, setTextError] = useState('')
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = useState(false)

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  const { login, googleLogin } = useContext(AuthContext);


  const updateSecureTextEntry = () => {
    setSafeEntryPassword(!safeEntrypassword)
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assents/splash2.png')}
        style={styles.logo}
      />
      <Text style={styles.text}></Text>

      <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="E-mail"
        iconType="email-outline"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      ></FormInput>



      <FormInput
        labelValue={password}
        keyboardType="visible-password"
        onChangeText={(userPassword) => {
          setIconType('eye-off-outline')
          setPassword(userPassword)
        }}
        placeholderText="Palavra Passe"
        iconType={iconType}
        secureTextEntry={safeEntrypassword ? false : true}
        onPress={() => {
          updateSecureTextEntry()
          safeEntrypassword ? setIconType('eye-off-outline') : setIconType('eye-outline')
        }}
      />
      <TouchableOpacity style={styles.forgotButton} onPress={() => navigation.navigate('resetPassword')}>
        <Text style={styles.navButtonText}>Esqueceu a senha?</Text>
      </TouchableOpacity>
      <FormButton
        buttonTitle="Entrar"
        onPress={() => {
            if(email!==null && password!==null){
              login(email, password)
            }else{
              Alert.alert(
                "Campos Vazios",
                'Por favor Preencha todos campos!'
              )
            }
         }}

      />
      <TouchableOpacity
        style={styles.forgotButton2}
        onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.navButtonText}>
          Não tem uma conta? Registre-se!
        </Text>
      </TouchableOpacity>

      
    </ScrollView>
  );
};

export default ViewLoginScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'baseline',
    padding: 20,
    paddingTop: 50
  },

  logo: {
    height: 150,
    width: 150,
    alignSelf: "center",
    resizeMode: 'cover',
  },
  text: {
    //fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 5,
  },
  forgotButton: {
    marginVertical: 2,
    marginBottom: 20
  },
  forgotButton2: {
    marginVertical: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20
  },
  viewLinha: {
    height: 2,
    width: '50%',
    backgroundColor: "#a4a4a4",
    marginTop: 20,

  },
  viewLinha2: {
    height: 2,
    width: '100%',
    backgroundColor: "#a4a4a4",
    marginTop: 20

  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2e64e5',
    //fontFamily: 'Lato-Regular',
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
});