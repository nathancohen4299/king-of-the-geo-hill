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

function onJoinGame(navigation, gameName) {
    // TODO 
    // perform request 

    navigation.navigate('GameSetup', {code: responseJson['code'], name: responseJson['name'], isOwner: false})
    
}