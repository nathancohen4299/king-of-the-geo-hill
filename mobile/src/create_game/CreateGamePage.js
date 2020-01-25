import React from 'react'
import { View } from 'react-native'
import { LargeButton } from '../components/LargeButton'
import { useNavigation } from 'react-navigation-hooks'
import { LargeTextInput, useLargeTextInput } from '../components/LargeTextInput'
import { LargeHeader } from '../components/LargeHeader'

export const CreateGamePage = () => {
    const [gameName, onChangeGameName] = useLargeTextInput()
    const navigation = useNavigation()

    return (
        <>
            <View style={[{height: '25%'}]} />

            <LargeHeader text='Create Game' />

            <View style={[{height: '2.5%'}]} />

            <LargeTextInput text={gameName} onChangeText={onChangeGameName} placeholder='enter game name' />

            <LargeButton text='Create' color="#339933" onPress={() => onCreateGame(navigation, gameName)}/>
        </>
    );
}

function onCreateGame(navigation, gameName) {
    fetch('https://mywebsite.com/endpoint/', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            gameName: gameName,
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