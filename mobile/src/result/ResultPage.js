import React, { useEffect } from 'react' 
import { LargeHeader } from '../components/LargeHeader'
import { useNavigation } from 'react-navigation-hooks'
import { Colors } from '../store/Colors'
import { View } from 'react-native'
import { SmallButton } from '../components/SmallButton'
import { getGameState } from '../game/getGameState'

export const ResultPage = () => {
    const navigation = useNavigation()
    const game_id = navigation.getParam('game_id', 'null_game')
    const team = navigation.getParam('team', 'auto')
    let winner = 'auto'

    useEffect(() => {
        fetch('https://bulldog.ryanjchen.com/game/score/' + game_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.status == 200) {
                return response.json()
            }
            else {
                console.log('[error ' + response.status + ']: ' + response.statusText)
            }
        }).then(responseJson => {
            if (responseJson !== undefined) {
                winner = responseJson['control']
            }
        }).catch((error) => {
            console.error(error);
        });
    })

    const result = getResult(team, winner)

    return (
        <>
            <View style={{height: '30%'}}></View>
            <LargeHeader text={'you ' + result} color={getResultColor(result)}/>
            <SmallButton text='close' color={Colors.DARK_GRAY} textColor={'#FFF'} onPress={() => onClose(navigation)}/>
        </>
    )
}

function onClose(navigation) {
    navigation.navigate('Start')
}

function getResult(team, winner) {
    if (winner === 'auto') { return 'tie'}
    return team === winner ? 'win' : 'lose'
} 

function getResultColor(result) {
    if (result === 'win') {
        return Colors.TRON_GREEN
    } else if (result === 'lose') {
        return Colors.TRON_RED
    } else {
        return Colors.TRON_YELLOW
    }
}