import React from 'react'
import { View } from 'react-native'
import { LargeButton } from '../components/LargeButton'
import { useNavigation } from 'react-navigation-hooks'
import { useLargeTextInput, LargeTextInput } from '../components/LargeTextInput'
import { LargeHeader } from '../components/LargeHeader'

export const JoinGamePage = () => {
    const navigation = useNavigation()
    const [ gameName, onChangeGameName ] = useLargeTextInput()

    return (
        <>
            <View style={[{height: '25%'}]} />

            <LargeHeader text='Join Game' />

            <View style={[{height: '2.5%'}]} />

            <LargeTextInput value={gameName} onChangeValue={onChangeGameName} placeholder={'enter game name'} />

            <LargeButton text='Join' color="#339933" onPress={() => onJoinGame(navigation, gameName)}/>
        </>
    );
}

function onJoinGame(navigation, gameName) {
    // TODO 
}