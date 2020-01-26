import React from 'react'
import { View } from 'react-native'
import { LargeButton } from '../components/LargeButton'
import { useNavigation } from 'react-navigation-hooks'
import { useLargeTextInput, LargeTextInput } from '../components/LargeTextInput'
import { LargeHeader } from '../components/LargeHeader'
import { Colors } from '../store/Colors'

export const JoinGamePage = () => {
    const navigation = useNavigation()
    const [ gameName, onChangeGameName ] = useLargeTextInput()
    const [ username, onChangeUsername ] = useLargeTextInput()


    return (
        <>
            <View style={[{height: '20%'}]} />

            <LargeHeader text='Join Game' />

            <View style={[{height: '2.5%'}]} />

            <LargeTextInput value={gameName} onChangeValue={onChangeGameName} placeholder={'enter game name'} />

            <View style={[{height: '2.5%'}]} />

            <LargeTextInput value={gameName} onChangeValue={onChangeUsername} placeholder={'enter username'} />

            <LargeButton text='Join' color={Colors.TRON_GREEN} onPress={() => onJoinGame(navigation, gameName)}/>
        </>
    );
}

function onJoinGame(navigation, game_id, user_id) {
    fetch('https://bulldog.ryanjchen.com/game/' + game_id + '/user_id/' + user_id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        }).then((response) => {
            if (response.status == 200) {
                return response.json()
            }
            else {
                return undefined
            }
        }).then(responseJson => {
            if (responseJson !== undefined) { 
                navigation.navigate('GameSetup', {code: responseJson['id'], name: responseJson['id'], isOwner: false})    
            } else {
                // TODO error message
            }
        })
        .catch((error) => {
        console.error(error);
    });
    
}