import React from 'react'
import { Text } from 'react-native'

export const SmallHeader = ({text, color, textAlign='center'}) => {
    return (
        <Text 
            style={{
                fontSize: 20, 
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