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
    const user_id = navigation.getParam('user_id', 'null_user')
    const team = navigation.getParam('team', 'auto')
    const [winner, setWinner] = useState('auto')
    const [result, setResult] = useState('tie') 


    useEffect(() => {
        fetch('https://bulldog.ryanjchen.com/game/score/' + game_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user_id,
                latitude: 0,
                longitude: 0  
            })
        }).then((response) => {
            if (response.status == 200) {
                setWinner(response.json()['control'])
                return response.json()
            }
            else {
                console.log('[error ' + response.status + ']: ' + response.statusText)
            }
        }).then(responseJson => {
            if (responseJson !== undefined) {
                setWinner(response.json()['control'])
            }
        }).catch((error) => {
            console.error(error);
        });
    })

    useEffect(() => {
        setResult(getResult(team, winner))
    }, [winner])


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
    if (winner.toLowerCase() === 'auto') { return 'tie'}
    return team.toLowerCase() === winner.toLowerCase() ? 'win' : 'lose'
} 

function getResultColor(result) {
    if (result.toLowerCase() === 'win') {
        return Colors.TRON_GREEN
    } else if (result.toLowerCase() === 'lose') {
        return Colors.TRON_RED
    } else {
        return Colors.TRON_YELLOW
    }
}