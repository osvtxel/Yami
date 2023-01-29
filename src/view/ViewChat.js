
import React, { useContext, useState, useEffect,useLayoutEffect } from 'react'
import { Alert, FlatList, View, StyleSheet, RefreshControl, Text } from 'react-native'
import { ListItem, Avatar, Icon, Button } from 'react-native-elements'
import { auth, db } from '../services/firebase'
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from '../components/MessageStyles';
import moment from 'moment'
import 'moment/locale/pt'




export default props => {

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [dataUsers, setDataUsers] = useState([]);
  const currentUser = auth.currentUser.uid




  /**
     * publicar as vendas
     * @param {*} props 
     */

   useEffect(() => {
    takeUsersFromFirebase()
  }, [])

  /**Get Vendas todas */
  /**
   * Refresshing data
   */
  const refreshingData = () => {
    takeUsersFromFirebase()
  }

  /**
   * Take users from dataBase
   */
  const takeUsersFromFirebase = async () => {
    setIsLoading(true)
    try {
      await
        db.collection("Last-messages")
          .doc(currentUser)
          .collection('Vendedores')
          .get()
          .then((querySnapshot) => {
            let temp = [];
            querySnapshot.forEach((doc) => {
              let UsersDetails = {};
              UsersDetails = doc.data();
              UsersDetails['id'] = doc.id;
              temp.push(UsersDetails);
              setDataUsers(temp)
              setIsLoading(false)

              // doc.data() is never undefined for query doc snapshots
              //console.warn(doc.id, " => ", temp);
            });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });

    } catch (error) {

    }
  }
  /*
    const takeUsersFromFirebaseConversas = async () => {
      setIsLoading(true)
      try {
        await
          db.collection("Conversas")
            .doc(currentUser)
            .get()
            .then((querySnapshot) => {
              let temp = [];
              querySnapshot.forEach((doc) => {
                let UsersDetails = {};
                UsersDetails = doc.data();
                UsersDetails['id'] = doc.id;
                temp.push(UsersDetails);
                setDataUsers(temp)
                setIsLoading(false)
  
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", temp);
              });
            })
            .catch((error) => {
              console.log("Error getting documents: ", error);
            });
  
      } catch (error) {
  
      }
    }*/

  function confirmUserdelete(user) {
    Alert.alert('Excluir Usuário', 'Deseja Excluir o Usuário?', [
      {
        text: 'Sim',
        onPress() {
          dispatch({
            type: 'deleteUser',
            payload: user,
          })
        }
      },
      {
        text: 'Não'
      }
    ])
  }

  const getUserItem = ({ item: user }) => {

    return (
      <Card onPress={() => props.navigation.navigate('ViewChatScreen',{user: user.user})}>
        <UserInfo>
          <UserImgWrapper>
            {<UserImg source={ {uri: user.user.avatar ? user.user.avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}}/>} 
          </UserImgWrapper>
          <TextSection>
            <UserInfoText>
              <UserName>{user.user.name}</UserName>
              <PostTime>
                <Text>{moment(user.latestMessage.createdAt).locale('pt').fromNow(false)}</Text>
              </PostTime>
            </UserInfoText>
            <MessageText>{user.latestMessage.text}</MessageText>
          </TextSection>
        </UserInfo>
      </Card>
    )
  }


  return (
    <Container>
      <FlatList
        keyExtractor={user => user.id.toString()}
        data={dataUsers}
        renderItem={getUserItem}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refreshingData}
          />
        }
      />
    </Container>

  )
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});
