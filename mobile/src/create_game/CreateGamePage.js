import React from 'react'
import { View } from 'react-native'
import { LargeButton } from '../components/LargeButton'
import { useNavigation } from 'react-navigation-hooks'
import { LargeTextInput, LargeNumericTextInput, useLargeTextInput } from '../components/LargeTextInput'
import { LargeHeader } from '../components/LargeHeader'

export const CreateGamePage = () => {
    const [gameName, onChangeGameName] = useLargeTextInput()
    const [duration, onChangeDuration] = useLargeTextInput()
    const [user_id, onChangeUserId] = useLargeTextInput()
    const navigation = useNavigation()

    return (
        <>
            <View style={[{height: '15%'}]} />

            <LargeHeader text='Create Game' />

            <View style={[{height: '2.5%'}]} />

            <LargeTextInput text={gameName} onChangeText={onChangeGameName} placeholder='enter game name' />
            <View style={[{height: '2.5%'}]} />

            <LargeNumericTextInput text={duration} onChangeText={onChangeDuration} placeholder='enter a duration' />
            <View style={[{height: '2.5%'}]} />
            <LargeTextInput text={user_id} onChangeText={onChangeUserId} placeholder='enter username' />


            <LargeButton text='Create' color="#339933" onPress={() => onCreateGame(navigation, gameName, duration)}/>
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
            duration: parseFloat(duration)
        }),
        }).then((response) => {
            if (response.status == 200) {
                return response.json()
            }
            else {
                return undefined
            }
        }).then(responseJson => {
            if (responseJson !== undefined) { 
                navigation.navigate('GameSetup', {code: responseJson['id'], name: responseJson['id'], username: user_id, duration: parseFloat(duration), isOwner: true})
            } else {
                // TODO error message
            }
        })
        .catch((error) => {
        console.error(error);
    });
}