import React from 'react'
import { Text } from 'react-native'

export const LargeHeader = ({text}) => {
    return (
        <Text style={{fontSize: 36, marginHorizontal: '15%', textAlign: 'center'}}>{text}</Text>
    );
}