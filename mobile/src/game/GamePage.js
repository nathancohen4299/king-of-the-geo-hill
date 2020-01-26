import React, { useState, useEffect } from 'react'
import { Colors } from '../store/Colors'
import { View } from 'react-native'
import { LargeHeader } from '../components/LargeHeader'
import { MassiveHeader } from '../components/MassiveHeader'
import Radar from 'react-native-radar'
import { useNavigation } from 'react-navigation-hooks'
import { _storeData, _removeData, _hasData } from '../store/LocalStorage'

export const GamePage = () => {
    const navigation = useNavigation()
    const [team, changeTeam] = useState('NONE')
    const myTeam = navigation.getParam('team', 'auto')
    const username = navigation.getParam('username', 'null_use')
    const game_id = navigation.getParam('game_id', 'null_game')
    const [duration, setDuration] = useState(0)
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)

    useEffect(() => {
        Radar.setUserId(username)
        Radar.requestPermissions(false)
        Radar.trackOnce(() => {

        }).then(result => {

        }).catch(error => {

        })
        Radar.setMetadata({ game_id: game_id })
        Radar.startTracking()
    }, [])

    useEffect(() => {
        //if (!_hasData('GameData')) {
        _storeData('GameData', { game_id: game_id, username: username, team: myTeam })
        //}

        listen(game_id, setDuration, changeTeam, navigation, myTeam, setLatitude, setLongitude, latitude, longitude, username)
    }, [])


    // check no one in zone
    if (team === 'NONE') {
        return (
            <View style={{ backgroundColor: Colors.DARK_GRAY, height: '100%' }}>
                <View style={{ margin: '5%' }}></View>
                <MassiveHeader text={duration} color={'#FFF'} fontFamily={'Call of Ops Duty'} />
                <LargeHeader text={'ZONE IS EMPTY'} color={'#FFF'} />
            </View>
        )
    }

    if (team === 'CONTESTED') {
        return (
            <View style={{ backgroundColor: Colors.TRON_YELLOW, height: '100%' }}>
                <View style={{ margin: '5%' }}></View>
                <MassiveHeader text={duration} color={'#FFF'} fontFamily={'Call of Ops Duty'} />
                <LargeHeader text={'ZONE IS CONTESTED'} color={'#FFF'} />
            </View>
        )
    }

    // check uncontested zone

    if (myTeam !== team) {
        return (
            <View style={{ height: '100%', backgroundColor: team === 'BLUE' ? Colors.BLUE : Colors.TRON_RED }}>
                <View style={{ height: '15%' }}></View>
                <MassiveHeader text={duration} color={'#FFF'} fontFamily={'Call of Ops Duty'} />
                <View style={{ height: '10%' }}></View>
                <LargeHeader text={team + ' is in control'} color={'#FFF'} size={64} fontFamily={'Call of Ops Duty'} />
                <View style={{ height: '10%' }}></View>
                <LargeHeader text={'reclaim the point'} color={team === 'BLUE' ? Colors.BLUE : Colors.TRON_RED} size={36} fontFamily={'Call of Ops Duty'} />
            </View>
        )
    } else {
        return (
            <View style={{ height: '100%', backgroundColor: team === 'BLUE' ? Colors.BLUE : Colors.TRON_RED }}>
                <View style={{ height: '15%' }}></View>
                <MassiveHeader text={duration} color={'#FFF'} fontFamily={'Call of Ops Duty'} />
                <View style={{ height: '10%' }}></View>
                <LargeHeader text={'you are in control'} color={'#FFF'} size={64} fontFamily={'Call of Ops Duty'} />
                <View style={{ height: '10%' }}></View>
                <LargeHeader text={'hold the point'} color={Colors.DARK_GRAY} size={36} fontFamily={'Call of Ops Duty'} />
            </View>
        )
    }
}

function listen(game_id, setDuration, changeTeam, navigation, myTeam, setLatitude, setLongitude, latitude, longitude, user_id) {
    var process = setInterval(() => {
        getLocation(setLatitude, setLongitude)
        fetch('https://bulldog.ryanjchen.com/game/score/' + game_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                latitude: latitude,
                longitude: longitude,   
                user_id: user_id
            }),
        }).then((response) => {
            if (response.status == 200) {
                return response.json()
            }
            else {
                console.log('[error ' + response.status + ']: ' + response.statusText)
            }
        }).then(responseJson => {
            if (responseJson !== undefined) {
                console.log(responseJson['duration'])
                setDuration(responseJson['duration'])
                changeTeam(responseJson['control'])

                if (responseJson['duration'] === 0) {
                    clearInterval(process)
                    _removeData('GameData')
                    navigation.navigate('Result', { game_id: game_id, team: myTeam })
                }
            }
        }).catch((error) => {
            console.error(error);
        });
    }, 1000)
}

function getLocation(setLatitude, setLongitude) {
    navigator.geolocation.getCurrentPosition(
        position => {
            setLatitude(position['coords']['latitude'])
            setLongitude(position['coords']['longitude'])
        },
        error => Alert.alert(error.message),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
}