import React, { useState, useEffect } from 'react'
import { LargeHeader } from '../components/LargeHeader'
import { MediumHeader } from '../components/MediumHeader'
import { Colors } from '../store/Colors'
import { useNavigation } from 'react-navigation-hooks'
import { LargeButton } from '../components/LargeButton'
import { SmallHeader } from '../components/SmallHeader'
import { View, TouchableOpacity } from 'react-native'

export const GameSetupPage = () => {
    const navigation = useNavigation()
    const [teamColor, changeTeamColor] = useState('none')
    const duration = navigation.getParam('duration', 0)
    const game_id = navigation.getParam('game_id', 'null_game')
    const user_id = navigation.getParam('user_id', 'null_user')
    const isOwner = navigation.getParam('isOwner', false)
    const [redCount, setRedCount] = useState(0)
    const [blueCount, setBlueCount] = useState(0)
    const [autoCount, setAutoCount] = useState(0)

    const toggleTeam = (newTeamColor) => {
        if (newTeamColor !== teamColor) {
            changeTeamColor(newTeamColor)
            changeTeamRequest(user_id, game_id, newTeamColor)
        }
    }

    useEffect(() => {
        listen(game_id, isOwner, teamColor, navigation, setRedCount, setBlueCount, setAutoCount, user_id)
    })

    return (
        <>
            <LargeHeader text='Teams' />

            <View style={{ flexDirection: 'row', flex: 2, justifyContent: 'center' }}>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={{ margin: '5%', paddingBottom: '10%', borderRadius: 4, backgroundColor: (Colors.BLUE + (teamColor !== 'blue' ? '00' : 'FF')) }} onPress={() => toggleTeam('blue')}>
                        <MediumHeader text={'Blue Team'} color={teamColor !== 'blue' ? Colors.BLUE : '#FFF'} />
                        <SmallHeader text={'player count: ' + blueCount} color={teamColor !== 'blue' ? Colors.BLUE : '#FFF'} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={{ margin: '5%', paddingBottom: '10%', borderRadius: 4, backgroundColor: (Colors.RED + (teamColor !== 'red' ? '00' : 'FF')) }} onPress={() => toggleTeam('red')}>
                        <MediumHeader text={'Red Team'} color={teamColor !== 'red' ? Colors.TRON_RED : '#FFF'} />
                        <SmallHeader text={'player count: ' + redCount} color={teamColor !== 'red' ? Colors.TRON_RED : '#FFF'} />
                    </TouchableOpacity>
                </View>

            </View>

            <View style={{ flex: 1 }}>
                <TouchableOpacity style={{ margin: '10%', borderRadius: 4, paddingBottom: '2.5%', backgroundColor: (Colors.DARK_GRAY + (teamColor !== 'none' ? '00' : 'FF')) }} onPress={() => toggleTeam('none')}>
                    <MediumHeader text={'auto assign: ' + autoCount} color={teamColor !== 'none' ? Colors.DARK_GRAY : '#FFF'} />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }} />
            <View style={{ flex: 7 }}>
                <MediumHeader text={'Game Settings '} color={Colors.DARK_GRAY} textAlign={'left'} />
                <SmallHeader text={'game: ' + game_id} color={Colors.DARK_GRAY} textAlign={'left'} />
                <SmallHeader text={'user: ' + user_id} color={Colors.DARK_GRAY} textAlign={'left'} />
                <SmallHeader text={'duration: ' + duration.toString() + ' min'} color={Colors.DARK_GRAY} textAlign={'left'} />
                {/* <SmallHeader text={'location: ' + 'undefined address'} color={Colors.DARK_GRAY} textAlign={'left'} /> */} 
                {isOwner && <LargeButton text='Start Game' color={Colors.TRON_GREEN} onPress={() => startGame(navigation, game_id, teamColor ,user_id)} />}
                <View style={{ height: '2.5%' }} />
                {!isOwner && <MediumHeader text='waiting for game to start . . . ' color={Colors.TRON_YELLOW} />}
            </View>
        </>
    )
}

let process = undefined

function startGame(navigation, game_id, teamColor, user_id) {
    clearInterval(process)
    fetch('https://bulldog.ryanjchen.com/game/start/' + game_id, {
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
            return undefined
        }
    }).then(responseJson => {
        console.log(responseJson)
        if (responseJson !== undefined) {
            // response not needed
            navigation.navigate('Game', {game_id: game_id, team: teamColor, username: user_id})
        } else {
            // TODO error message
        }
    }).catch((error) => {
        console.error(error);
    });

}

function changeTeamRequest(user_id, game_id, teamColor) {
    fetch('https://bulldog.ryanjchen.com/game/' + game_id + '/user/' + user_id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            team_color: teamColor
        }),
    }).then((response) => {
        console.log(response.status)
        if (response.status == 200) {
            return response.json()
        }
        else {
            return undefined
        }
    }).then(responseJson => {
        console.log(responseJson)
        if (responseJson !== undefined) {
            // response not needed
        } else {
            // TODO error message
        }
    })
        .catch((error) => {
            console.error(error);
        });
}


function listen(game_id, isOwner, teamColor, navigation, setRedCount, setBlueCount, setAutoCount, user_id) {
    process = setInterval(() => {
        fetch('https://bulldog.ryanjchen.com/game/' + game_id, {
            method: 'GET',
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
                setRedCount(responseJson['red_team_count'])
                setBlueCount(responseJson['blue_team_count'])
                setAutoCount(responseJson['auto_count'])

                // if not owner check if game has started
                if (!isOwner) {
                    if (responseJson['status'] === 'ACTIVE') {
                        // game has started, navigate to screen 
                        clearInterval(process)
                        navigation.navigate('Game', {game_id: game_id, team: teamColor, username: user_id})
                    }
                }
            } else {
                // TODO error message
            }
        }).catch((error) => {
            console.error(error);
        });
    }, 500)
}
