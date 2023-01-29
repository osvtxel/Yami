import React from 'react'
import {createDrawerNavigator} from '@react-navigation/drawer'
import AppStack from './AppStack'
import {DrawerContent} from './DrawerContent'


const Drawer = createDrawerNavigator()


function LogoTitle(route) {
    return (
        <View style={{flexDirection:'row', alignItems:'center'}}>
            <Avatar.Image
                source={{
                    uri: route.imageProf}}
                size={30}
            />
            <Title style={{fontSize:14, marginLeft:10}}>{route.nameSeller}</Title>
        </View>

    );
}
const DrawerNavigator=({navigation})  => {
        return(
            <Drawer.Navigator  drawerContent= {props => <DrawerContent {...props}/>} 
            >
                <Drawer.Screen  options={{headerShown: false }} name="AppStack" component={AppStack}/>
            </Drawer.Navigator>
        )
    }
export default DrawerNavigator