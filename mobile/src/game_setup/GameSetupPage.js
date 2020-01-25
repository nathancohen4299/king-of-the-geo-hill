import React, { useState } from 'react'
import { LargeHeader } from '../components/LargeHeader'
import { MediumHeader } from '../components/MediumHeader'
import { Colors } from '../store/Colors'
import { useNavigation } from 'react-navigation-hooks'
import { LargeButton } from '../components/LargeButton'
import { SmallHeader } from '../components/SmallHeader'
import { View, TouchableOpacity } from 'react-native'

export const GameSetupPage = () => {
    const navigation = useNavigation()
    const [team, changeTeam] = useState(false)
    const blueCode =  navigation.getParam('blueCode', 'undefined')
    const redCode =   navigation.getParam('redCode' ,'undefined')
    const duration =  navigation.getParam('duration', 'undefined')
    const name =      navigation.getParam('name', 'undefined')
    const blueCount = 0
    const redCount = 0

    const toggleTeam = (team) => {
        console.log(team)
        changeTeam(team === 'red' ? true : false)
    }

    return (
        <>
            <LargeHeader text='Teams' />
            <View style={{flexDirection: 'row', flex: 2, justifyContent: 'center'}}>
                <View style={{flex: 1}}>
                    <TouchableOpacity style={{ margin: '5%', paddingBottom: '5%', borderRadius: 4, backgroundColor: (Colors.BLUE + (team ? '00': 'FF'))}} onPress={() => toggleTeam('blue')}>
                        <MediumHeader text={'Blue Team'} color={team ? Colors.BLUE : '#FFF'}/>
                        <SmallHeader text={'code: ' + blueCode} color={team ? Colors.BLUE: '#FFF'} />
                        <SmallHeader text={'player count: ' + blueCount} color={team ? Colors.BLUE: '#FFF'} />
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                    <TouchableOpacity style={{ margin: '5%', paddingBottom: '5%', borderRadius: 4, backgroundColor: (Colors.RED + (!team ? '00': 'FF'))}} onPress={() => toggleTeam('red')}>
                        <MediumHeader text={'Red Team'} color={!team ? Colors.TRON_RED : '#FFF'} />
                        <SmallHeader text={'code: ' + redCode} color={!team ? Colors.TRON_RED : '#FFF'} />
                        <SmallHeader text={'player count: ' + redCount} color={!team ? Colors.TRON_RED : '#FFF'}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{flex: 5}}>
                <MediumHeader text={'Game Settings '} color={Colors.DARK_GRAY}                  />
                <SmallHeader text={'name: ' + name} color={Colors.DARK_GRAY}                    />
                <SmallHeader text={'duration: ' + duration + ' min'} color={Colors.DARK_GRAY}   />
                <SmallHeader text={'location: ' + 'this address here'} color={Colors.DARK_GRAY} />

                <LargeButton text='Start Game' color={Colors.TRON_GREEN} onPress={()=>{}}/>
            </View>
        </>
    )
}
