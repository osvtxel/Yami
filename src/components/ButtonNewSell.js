import React, { useState, useRef, useEffect , useContext} from "react";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import {
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";
import { auth, db } from '../services/firebase'
import { AuthContext } from '../routes/AuthProvider';






export default function ButtonNewSell({size , color, navigation}){
    const newsell= 'new'
    const UidUser = auth.currentUser.uid
    const {userVerifications} = useContext(AuthContext);
    const [data, setData] = useState({
        perfilVerification: false,
        selectedCountry:'angola',
        documentType:'passporte',
        nameDocumet:'N2332366'

    
      });

    useEffect(() => {
        takeUser()
      }, [])
     
      /***
       * Pegar dados do usuario
       */
      const takeUser = async () => {
        try {
          await
                db.collection("UserVerifications").doc(UidUser)
                  .get()
                  .then((doc) => {
                    setData({
                      ...data,
                      perfilVerification: doc.data().userVerifications,
                     
                    })                   
                  })
                  .catch((error) => {
                    console.log("Error getting documents: ", error);
                  });
     
        } catch (error) {
    
        }
      }


    return(
        
        <TouchableOpacity style={styles.container} onPress={()=> data.perfilVerification ? navigation.navigate("viewSell", newsell) : Alert.alert('Conta não verificada', 'Para efetuar qualquer operação de venda ou compra deve verificar a conta. Pretende verifcar a conta agora ?', [
            {
              text: 'Sim',
              onPress: () => {
                 navigation.navigate("biPassport")
                 userVerifications(data.selectedCountry,data.documentType,data.nameDocumet)

              }
            },
            {
              text: 'Não',
              
            }
          ])}>
         <MaterialCommunityIcons name="plus" color='white' size={size}/>
      </TouchableOpacity> 
      
    )
}

const styles=StyleSheet.create({
    container:{
        width:35,
        height:35,
        borderRadius:30,
        elevation: 6,
        borderWidth: 0.5,
        backgroundColor:'#42a5f5',
        borderColor:'#3eccf5',
        alignItems:'center',
        justifyContent:'center',
      
    }
})