import React from 'react'
import { View } from 'react-native'
import { LargeButton } from '../components/LargeButton'
import { useNavigation } from 'react-navigation-hooks'
import { LargeTextInput, LargeNumericTextInput, useLargeTextInput } from '../components/LargeTextInput'
import { LargeHeader } from '../components/LargeHeader'
import Snackbar from 'react-native-snackbar'

export const CreateGamePage = () => {
    const [game_id, onChangeGameId] = useLargeTextInput()
    const [duration, onChangeDuration] = useLargeTextInput()
    const [user_id, onChangeUserId] = useLargeTextInput()
    const navigation = useNavigation()

    return (
        <>
            <View style={[{height: '15%'}]} />

            <LargeHeader text='Create Game' />

            <View style={[{height: '2.5%'}]} />

            <LargeTextInput text={game_id} onChangeText={onChangeGameId} placeholder='enter game name' />
            <View style={[{height: '2.5%'}]} />

            <LargeNumericTextInput text={duration} onChangeText={onChangeDuration} placeholder='enter a duration' />
            <View style={[{height: '2.5%'}]} />
            <LargeTextInput text={user_id} onChangeText={onChangeUserId} placeholder='enter username' />


            <LargeButton text='Create' color="#339933" onPress={() => onCreateGame(navigation, game_id, user_id, duration)}/>
        </>
    );
}

const onCreateGame = async (navigation, game_id, user_id, duration) => {
    fetch('https://bulldog.ryanjchen.com/game', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            game_id: game_id,
            user_id: user_id,
            duration: parseFloat(duration) * 60
        }),
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
            }
        }).then(responseJson => {
            console.log(responseJson)
            if (responseJson !== undefined) { 
                navigation.navigate('GameSetup', {game_id: responseJson['id'], user_id: user_id, duration: parseFloat(duration), isOwner: true})
            } else {
                // TODO error message
            }
        })
        .catch((error) => {
        console.error(error);
    });
}