import React from 'react'
import { Text } from 'react-native'

export const MediumHeader = ({text, color, textAlign='center'}) => {
    return (
        <Text 
            style={{
                fontSize: 36, 
                fontFamily: 'Bangers-Regular', 
                marginHorizontal: '15%',
                textAlign: textAlign, 
                color: color,
            }}
        >
            {text}
        </Text>
    );
}