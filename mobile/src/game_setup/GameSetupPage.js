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
    const [team, changeTeam] = useState('auto')
    const code =   navigation.getParam('code' ,'null')
    const duration =  navigation.getParam('duration', 0)
    const name =      navigation.getParam('name', 'null_game')
    const username = navigation.getParam('username', 'null_user')
    const isOwner = navigation.getParam('isOwner', false)
    const [redCount  , setRedCount] = useState(0)
    const [blueCount , setBlueCount] = useState(0)
    const [autoCount , setAutoCount] = useState(0)

    const toggleTeam = (newTeam) => {
        if (newTeam !== team) { 
            changeTeam(newTeam)
            changeTeamRequest(username, name, newTeam)
         } 
    }

    useEffect(() => {
        listen(name, setRedCount, setBlueCount, setAutoCount)
    })

    return (
        <>
            <LargeHeader text='Teams' />
            
            <View style={{flexDirection: 'row', flex: 2, justifyContent: 'center'}}>
                <View style={{flex: 1}}>
                    <TouchableOpacity style={{ margin: '5%', paddingBottom: '10%', borderRadius: 4, backgroundColor: (Colors.BLUE + (team !== 'blue'? '00': 'FF'))}} onPress={() => toggleTeam('blue')}>
                        <MediumHeader text={'Blue Team'} color={team !== 'blue' ? Colors.BLUE : '#FFF'}/>
                        <SmallHeader text={'player count: ' + blueCount} color={team !== 'blue' ? Colors.BLUE: '#FFF'} />
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                    <TouchableOpacity style={{ margin: '5%', paddingBottom: '10%', borderRadius: 4, backgroundColor: (Colors.RED + (team !== 'red' ? '00': 'FF'))}} onPress={() => toggleTeam('red')}>
                        <MediumHeader text={'Red Team'} color={team !== 'red' ? Colors.TRON_RED : '#FFF'} />
                        <SmallHeader text={'player count: ' + redCount} color={team !== 'red' ? Colors.TRON_RED : '#FFF'}/>
                    </TouchableOpacity>
                </View>
                
            </View>

            <View style={{flex: 1}}>
                <TouchableOpacity style={{ margin: '10%', borderRadius: 4, paddingBottom: '2.5%', backgroundColor: (Colors.DARK_GRAY + (team !== 'auto' ? '00': 'FF'))}} onPress={() => toggleTeam('auto')}>
                    <MediumHeader text={'auto assign: ' + autoCount} color={team !== 'auto' ? Colors.DARK_GRAY : '#FFF'}/>
                </TouchableOpacity>
            </View>
            <View style={{flex: 1}}/>
            <View style={{flex: 7}}>
                <MediumHeader text={'Game Settings '} color={Colors.DARK_GRAY}                  textAlign={'left'}/>
                <SmallHeader text={'name: ' + name} color={Colors.DARK_GRAY}                    textAlign={'left'}/>
                <SmallHeader text={'code: ' + code} color={Colors.DARK_GRAY}                    textAlign={'left'}/>
                <SmallHeader text={'duration: ' + duration + ' min'} color={Colors.DARK_GRAY}   textAlign={'left'}/>
                <SmallHeader text={'location: ' + 'undefined address'} color={Colors.DARK_GRAY} textAlign={'left'}/>
                {isOwner &&<LargeButton text='Start Game' color={Colors.TRON_GREEN} onPress={()=>{}}/>}
                <View style={{height: '2.5%'}}/>
                {!isOwner && <MediumHeader text='waiting for game to start . . . ' color={Colors.TRON_YELLOW}/>}
            </View>
        </>
    )
}

function changeTeamRequest(user_id, game_id, team) {
    console.log(game_id + ' ' + user_id + ' ' + team) 
    fetch('https://bulldog.ryanjchen.com/game/' + game_id + '/user/' + user_id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            team_color: team
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

            } else {
                // TODO error message
            }
        })
        .catch((error) => {
        console.error(error);
    });
}

function listen(game_id, setRedCount, setBlueCount, setAutoCount) {
    var process = setInterval(() => {
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
                // console.log(responseJson)
                setRedCount(responseJson['red_team_count'])
                setBlueCount(responseJson['blue_team_count'])
                setAutoCount(responseJson['auto_count'])
            } else {
                // TODO error message
            }
        })
        .catch((error) => {
        console.error(error);
    });
    }, 500)
}
