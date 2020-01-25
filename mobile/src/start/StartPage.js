import React from 'react'

import { View, Text, TouchableOpacity } from 'react-native'
import { LargeButton } from '../components/LargeButton' 
import { useNavigation } from 'react-navigation-hooks';
import { LargeHeader } from '../components/LargeHeader';
import { Colors } from '../store/Colors';

export const StartPage = () => {
    const navigation = useNavigation()
    return (
        
        <View style={{flex: 1}}>
            <View style={[{height: '15%'}]} />
            <LargeHeader text='King of the Geo Hill' />
            <LargeButton text='Create Game' color={Colors.TRON_YELLOW} onPress={() => onCreateGamePressed(navigation)}/>
            <View style={[{height: '1.5%'}]} />
            <LargeButton text='Join Game' color={Colors.TRON_YELLOW} onPress={() => onJoinGamePressed(navigation)}/>
            <View style={{flexGrow: 1}}></View>
            <TouchableOpacity>
                <Text style={{textAlign: "right", color: "#666", padding: 4}}>support the developers :^)</Text>
            </TouchableOpacity>
        </View>
    );
}

function onCreateGamePressed(navigation) {
    navigation.navigate('CreateGame')
}

function onJoinGamePressed(navigation) {
    navigation.navigate('JoinGame')
}