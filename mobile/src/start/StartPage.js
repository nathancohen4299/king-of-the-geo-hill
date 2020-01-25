import React from 'react'

import { View, Text } from 'react-native'
import { LargeButton } from '../components/LargeButton' 
import { useNavigation } from 'react-navigation-hooks';
import { LargeHeader } from '../components/LargeHeader';

export const StartPage = () => {
    const navigation = useNavigation()
    return (
        <>
            <View style={[{height: '25%'}]} />
            <LargeHeader text='King of the Geo Hill' />
            <LargeButton text='Create Game' color='#2277DD' onPress={() => onCreateGamePressed(navigation)}/>
            <View style={[{height: '1.5%'}]} />
            <LargeButton text='Join Game' color='#339933' onPress={() => onJoinGamePressed(navigation)}/>
        </>
    );
}

function onCreateGamePressed(navigation) {
    navigation.navigate('CreateGame')
}

function onJoinGamePressed(navigation) {
    navigation.navigate('JoinGame')
}