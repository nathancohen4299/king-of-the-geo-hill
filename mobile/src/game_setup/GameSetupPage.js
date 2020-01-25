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
    const [team, changeTeam] = useState('blue')
    const code =   navigation.getParam('code' ,'undefined')
    const duration =  navigation.getParam('duration', 'undefined')
    const name =      navigation.getParam('name', 'undefined')
    const isOwner = navigation.getParam('isOwner', false)
    const blueCount = 0
    const redCount = 0
    const autoCount = 0

    const toggleTeam = (newTeam) => {
        if (newTeam !== team) { changeTeam(newTeam) } 
    }

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
