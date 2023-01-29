import React from "react";
import {View, Text, StyleSheet} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';


export default OnboardingJs =()=>{


    return(
        <Onboarding
        nextLabel='Próximo'
        pages={[
          {
            backgroundColor: '#fff',
            image: <Image source={require('../assents/imagesIcon/ukraine.png')} />,
            title: 'Onboarding',
            subtitle: 'Done with React Native Onboarding Swiper',
          },
          {
            backgroundColor: '#fff',
            image: <Image source={require('../assents/imagesIcon/argentina.png')} />,
            title: 'Onboarding',
            subtitle: 'Done with React Native Onboarding Swiper',
          },
          {
            backgroundColor: '#fff',
            image: <Image source={require('../assents/imagesIcon/belarus.png')} />,
            title: 'Onboarding',
            subtitle: 'Done with React Native Onboarding Swiper',
          },
          {
            backgroundColor: '#fff',
            image: <Image source={require('../assents/imagesIcon/brazil.png')} />,
            title: 'Onboarding',
            subtitle: 'Done with React Native Onboarding Swiper',
          },
        ]}
      />
    )
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})