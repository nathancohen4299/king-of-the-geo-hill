import React from 'react'
import { View } from 'react-native'
import { LargeButton } from '../components/LargeButton'
import { useNavigation } from 'react-navigation-hooks'
import { useLargeTextInput, LargeTextInput } from '../components/LargeTextInput'
import { LargeHeader } from '../components/LargeHeader'
import { Colors } from '../store/Colors'
import Snackbar from 'react-native-snackbar'

export const JoinGamePage = () => {
    const navigation = useNavigation()
    const [ game_id, onChangeGameId ] = useLargeTextInput()
    const [ user_id, onChangeUserId ] = useLargeTextInput()

    return (
        <>
            <View style={[{height: '20%'}]} />

            <LargeHeader text='Join Game' />

            <View style={[{height: '2.5%'}]} />

            <LargeTextInput value={game_id} onChangeValue={onChangeGameId} placeholder={'enter game name'} />

            <View style={[{height: '2.5%'}]} />

            <LargeTextInput value={game_id} onChangeValue={onChangeUserId} placeholder={'enter username'} />

            <LargeButton text='Join' color={Colors.TRON_GREEN} onPress={() => onJoinGame(navigation, game_id, user_id)}/>
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
            console.log(response.status)
            if (response.status == 200) {
                return response.json()
            }
            else {
                Snackbar.show({
                    text: 'ERROR invalid input',
                    duration: Snackbar.LENGTH_LONG,
                    textColor: '#FFF',
                    backgroundColor: Colors.TRON_RED,
                    fontFamily: 'Bangers-Regular'
                });
                return undefined
            }
        }).then(responseJson => {
            if (responseJson !== undefined) { 
                navigation.navigate('GameSetup', {game_id: responseJson['id'], user_id: user_id, duration: response['duration'], isOwner: false})    
            }
        })
        .catch((error) => {
        console.error(error);
    });
    
}