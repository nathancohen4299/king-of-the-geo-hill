import React from 'react'

import { View, Text } from 'react-native'
import { LargeButton } from '../components/LargeButton' 
import { useNavigation } from 'react-navigation-hooks';
import { LargeHeader } from '../components/LargeHeader';
import { Colors } from '../store/Colors';
import LinearGradient from 'react-native-linear-gradient'

export const StartPage = () => {
    const navigation = useNavigation()
    return (
        
        // <LinearGradient colors={['#111' , '#222']} locations={[0.5, 1]} start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}} style={{height: '100%'}}>
        <View>
            <View style={[{height: '15%'}]} />
            <LargeHeader text='King of the Geo Hill' />
            <LargeButton text='Create Game' color={Colors.TRON_YELLOW} onPress={() => onCreateGamePressed(navigation)}/>
            <View style={[{height: '1.5%'}]} />
            <LargeButton text='Join Game' color={Colors.TRON_YELLOW} onPress={() => onJoinGamePressed(navigation)}/>
        </View>
        // </LinearGradient>
    );
}

function onCreateGamePressed(navigation) {
    navigation.navigate('CreateGame')
}

function onJoinGamePressed(navigation) {
    navigation.navigate('JoinGame')
}