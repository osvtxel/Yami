import React, { createContext, useState } from 'react';
import { Alert } from 'react-native'
import { auth, db, storage } from '../services/firebase'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            await auth.signInWithEmailAndPassword(email, password);
          } catch (e) {
            Alert.alert(
              "E-mail ou senha inválida",
              'Erro... Por favor a senha ou e-email fornecido é inválido, tente novamente!'
            )

          }
        },

        thoggleTheme: () => {
          setIsDarkTheme(isDarkTheme => !isDarkTheme) //responsavel por inversao de theme
        },
        uplodingPhotoProfile: async (image) => {
          let blob;
          try {
            blob = await new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.onload = function () {
                resolve(xhr.response);
              };
              xhr.onerror = function (e) {
                reject(new TypeError("Network request failed"));
              };
              xhr.responseType = "blob";
              xhr.open("GET", image, true);
              xhr.send(null);
            });;
            const ref = await storage.ref().child(`photos/${auth.currentUser.uid}`);
            const snapshot = await ref.put(blob);
            return await snapshot.ref.getDownloadURL();
          } catch (e) {
            alert("Por favor selecione a foto de perfil");
          } finally {
            blob.close();

          }
        }
        ,

        register: async (email, password, firstName, lastName, avatarUrl, expoPushToken) => {
          try {
            await auth.createUserWithEmailAndPassword(email, password)
              .then(() => {
                //Once the user creation has happened successfully, we can add the currentUser into firestore
                //with the appropriate details.
                var dataBaseRef = db.collection("Users").doc(auth.currentUser.uid);

                dataBaseRef
                  .set({
                    _id: auth.currentUser.uid,
                    expoPushToken: expoPushToken,
                    firstName: firstName,
                    midleName: '',
                    lastname: lastName,
                    country: '',
                    email: email,
                    telefone: '',
                    address: '',
                    phoneCode: '',
                    localTrabalho: '',
                    nVendas: '',
                    followers: '',
                    nLikers: '',
                    city: '',
                    profissao: '',
                    createdAt: new Date().getTime(),
                    userImg: avatarUrl,
                  }).then(async () => {
                    try {

                      const uploadUri = avatarUrl;
                      let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

                      // Add timestamp to File Name
                      const extension = filename.split('.').pop();
                      const name = filename.split('.').slice(0, -1).join('.');
                      filename = name + Date.now() + '.' + extension;
                      const response = await fetch(uploadUri);
                      const blob = await response.blob();
                      var ref = storage.ref().child('photos/profile' + `${auth.currentUser.uid}` + '/' + 'profile' + `${filename}`);
                      const snapshot = await ref.put(blob);
                      let imgUrl = await snapshot.ref.getDownloadURL();
                      // Set the "capital" field of the city 'DC'
                      return dataBaseRef.update({
                        userImg: imgUrl
                      })
                        .then(() => {

                        })
                        .catch((error) => {
                          alert("Erro ao atualizar a foto");
                        });
                    } catch (error) {
                      alert('alguma coisa nao deu certo', error)
                    }

                  })
                  //ensure we catch any errors at this stage to advise us if something does go wrong
                  .catch(error => {
                    alert('Erro.. Senha fraca ou email invalido, por favor tente novamente : ', error);
                  })
              })
              //we need to catch the whole sign up process if it fails too.
              .catch(error => {
                Alert.alert(
                  "E-mail inválido/Senha Fraca",
                  'Erro... Senha fraca ou email invalido, a senha deve conter no minimo 8 caracteres, uma junção de letras e numeros/caracteres especiais !'
                )

              });
          } catch (e) {
            Alert.alert(
              "Erro de Conexão",
              'Erro... Alguma coisa deu errado, tente mais tarde!'
            )
          }
        },
        userVerifications: async (presentCountry, docNumber, docType) => {
          try {

            //Once the user creation has happened successfully, we can add the currentUser into firestore
            //with the appropriate details.
            var dataBaseRef = await db.collection("UserVerifications").doc(auth.currentUser.uid);

            dataBaseRef
              .set({
                _id: auth.currentUser.uid,
                fullNameUser: '',
                presentCountry: presentCountry,
                docNumber: docNumber,
                docType: docType,
                email: '',
                telefone: '',
                address: '',
                docFrontalImage: 'https://cdn.pixabay.com/photo/2017/03/24/06/49/camera-2170377_960_720.png',
                docTraseiraImage: 'https://cdn.pixabay.com/photo/2017/03/24/06/49/camera-2170377_960_720.png',
                userPhotoVerication: 'https://cdn.pixabay.com/photo/2017/03/24/06/49/camera-2170377_960_720.png',
                city: '',
                createdAt: new Date().getTime(),
              })
              //ensure we catch any errors at this stage to advise us if something does go wrong
              .catch(error => {
                alert('Erro.. Senha fraca ou email invalido, por favor tente novamente : ', error);
              })
              //we need to catch the whole sign up process if it fails too.
              .catch(error => {
                Alert.alert(
                  "E-mail inválido/Senha Fraca",
                  'Erro... Senha fraca ou email invalido, a senha deve conter no minimo 8 caracteres, uma junção de letras e numeros/caracteres especiais !'
                )

              });
          } catch (e) {
            Alert.alert(
              "Erro de Conexão",
              'Erro... Alguma coisa deu errado, tente mais tarde!'
            )
          }
        },
        logout: async () => {
          try {
            await auth.signOut();
          } catch (e) {
            console.log(e);
          }
        },
        recoverPassword: async (email, navigation) => {
          try {
            await auth.sendPasswordResetEmail(email)
              .then((user) => {
                Alert.alert(
                  "Mensagem enviada",
                  'Por favor verifque o seu e-mail, mandamos informações para recuperação da palavra passe!'
                )
                navigation.navigate('Login')
              }).catch((error) => {
                Alert.alert(
                  "Erro de E-mail",
                  'o E-mail fornecido não existe, por favor verique e volte a tentar!'
                )
              })
          } catch (error) {

          }
        }
      }}>
      {children}
    </AuthContext.Provider>
  );
};