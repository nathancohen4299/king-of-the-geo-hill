import React from 'react'
import { Text } from 'react-native'
import { Colors } from '../store/Colors';

export const MassiveHeader = ({text, color=Colors.TRON_GREEN, fontFamily='Bangers-Regular'}) => {
    return (
        <Text 
            style={{
                fontSize: 144, 
                fontFamily: fontFamily, 
                marginHorizontal: '7.5%',
                textAlign: 'center', 
                color: color,
            }}
        >
            {text}
        </Text>
    );
}