import React, { useState, useEffect } from 'react'
import { Colors } from '../store/Colors'
import { View } from 'react-native'
import { LargeHeader } from '../components/LargeHeader'
import { MassiveHeader } from '../components/MassiveHeader'
import Radar  from 'react-native-radar'
import { useNavigation } from 'react-navigation-hooks'

export const GamePage = () => {
    const navigation = useNavigation()
    const [team, changeTeam] = useState('blue')
    const myTeam = 'blue'
    const username = navigation.getParam('username', 'null_use')
    useEffect(() => {
        Radar.setUserId(username)
        Radar.requestPermissions(false)
        Radar.startTracking()
    })

    if (myTeam !== team) {
        return (
            <View style={{height: '100%', backgroundColor: team === 'blue' ? Colors.BLUE: Colors.TRON_RED}}>
                <View style={{height: '15%'}}></View>
                <MassiveHeader text='10:00' color={'#FFF'} fontFamily={'Call of Ops Duty'}/>
                <View style={{height: '10%'}}></View>
                <LargeHeader text={team + ' is in control'} color={'#FFF' } size={64} fontFamily={'Call of Ops Duty'}/>
                <View style={{height: '10%'}}></View>
                <LargeHeader text={'reclaim the point'} color={team === 'red' ? Colors.BLUE : Colors.TRON_RED} size={36} fontFamily={'Call of Ops Duty'}/>
            </View>
        )
    } else {
        return (
            <View style={{height: '100%', backgroundColor: team === 'blue' ? Colors.BLUE: Colors.TRON_RED}}>
                <View style={{height: '15%'}}></View>
                <MassiveHeader text='10:00' color={'#FFF'} fontFamily={'Call of Ops Duty'}/>
                <View style={{height: '10%'}}></View>
                <LargeHeader text={'you are in control'} color={'#FFF' } size={64} fontFamily={'Call of Ops Duty'}/>
                <View style={{height: '10%'}}></View>
                <LargeHeader text={'hold the point'} color={Colors.DARK_GRAY} size={36} fontFamily={'Call of Ops Duty'}/>
            </View>
            )
    }

}