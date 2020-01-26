import React from 'react'
import { View } from 'react-native'
import { MediumHeader } from '../components/MediumHeader'
import { SmallButton } from '../components/SmallButton'
import { Colors } from '../store/Colors'
import { useNavigation } from 'react-navigation-hooks'
import { LargeHeader } from '../components/LargeHeader'

export const DeveloperPage = () => {
    const navigation = useNavigation()

    return (
        <>
            <View style={{height: '15%'}}></View>
            <LargeHeader text='Venmo' color={Colors.BLUE} />
            <MediumHeader text='@Stephen_Davis_17'/>
            <View style={{height: '2.5%'}} />
            <MediumHeader text='@rchen42'/>
            <View style={{height: '2.5%'}} />
            <MediumHeader text='@nathan-cohen-13'/>
            <View style={{height: '2.5%'}} />
            <SmallButton text='back' color={Colors.TRON_GREEN} textColor={'#FFF'} onPress={() => navigation.navigate('Start')}/>
        </>
    );

}