import React, { useEffect } from 'react'

import { View, Text, TouchableOpacity } from 'react-native'
import { LargeButton } from '../components/LargeButton' 
import { useNavigation } from 'react-navigation-hooks';
import { LargeHeader } from '../components/LargeHeader';
import { Colors } from '../store/Colors';
import { _hasData, _retrieveData } from '../store/LocalStorage';

export const StartPage = () => {
    const navigation = useNavigation()

    useEffect(() => {   
        if (_hasData('GameData')) {
            const data = _retrieveData('GameData')

            // check if active
            fetch('https://bulldog.ryanjchen.com/game/score/' + data['game_id'], {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: data['username'],
                    latitude: 0,
                    longitude: 0
                })
            }).then((response) => {
                if (response.status == 200) {
                    navigation.navigate('Game', {game_id: data['game_id'], team: data['team'], username: data['username']})
                }
                else {
                    _removeData('GameData')
                }
            }).then(responseJson => {
                
            }).catch((error) => {
                console.error(error);
            });
        }
    }, []) 

    return (
        
        <View style={{flex: 1}}>
            <View style={[{height: '15%'}]} />
            <LargeHeader text='King of the Geo Hill' />
            <LargeButton text='Create Game' color={Colors.TRON_YELLOW} onPress={() => onCreateGamePressed(navigation)}/>
            <View style={[{height: '1.5%'}]} />
            <LargeButton text='Join Game' color={Colors.TRON_YELLOW} onPress={() => onJoinGamePressed(navigation)}/>
            <View style={{flexGrow: 1}}></View>
            <TouchableOpacity onPress={() => navigation.navigate('Developer')}>
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