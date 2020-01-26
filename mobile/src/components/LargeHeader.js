import React from 'react'
import { Text } from 'react-native'
import { Colors } from '../store/Colors';

export const LargeHeader = ({text, color=Colors.TRON_GREEN, fontFamily='Bangers-Regular', size=72, underline=false}) => {
    return (
        <Text 
            style={{
                fontSize: size, 
                fontFamily: fontFamily, 
                marginHorizontal: '7.5%',
                textAlign: 'center', 
                color: color,
                textDecorationLine: underline ? 'underline' : 'none'
            }}
        >
            {text}
        </Text>
    );
}