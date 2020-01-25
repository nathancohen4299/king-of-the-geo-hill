import React from 'react'
import { View } from 'react-native'
import { LargeButton } from '../components/LargeButton'
import { useNavigation } from 'react-navigation-hooks'
import { LargeTextInput, LargeNumericTextInput, useLargeTextInput } from '../components/LargeTextInput'
import { LargeHeader } from '../components/LargeHeader'

export const CreateGamePage = () => {
    const [gameName, onChangeGameName] = useLargeTextInput()
    const [duration, onChangeDuration] = useLargeTextInput()
    const navigation = useNavigation()

    return (
        <>
            <View style={[{height: '20%'}]} />

            <LargeHeader text='Create Game' />

            <View style={[{height: '2.5%'}]} />

            <LargeTextInput text={gameName} onChangeText={onChangeGameName} placeholder='enter game name' />
            <View style={[{height: '2.5%'}]} />

            <LargeNumericTextInput text={duration} onChangeText={onChangeDuration} placeholder='enter a duration' />

            <LargeButton text='Create' color="#339933" onPress={() => onCreateGame(navigation, gameName, duration)}/>
        </>
    );
}

const onCreateGame = async (navigation, gameName, duration) => {
    fetch('http://bulldog.ryanjchen.com:5000/game', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            game_name: gameName,
            duration: parseFloat(duration)
        }),
        }).then((response) => response.json())
        .then((responseJson) => {
            navigation.navigate('Start')
            // TODO implement this 
            return;
        })
        .catch((error) => {
        console.error(error);
    });
}