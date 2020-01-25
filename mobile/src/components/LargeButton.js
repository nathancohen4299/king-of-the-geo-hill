import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'

export const LargeButton = ({text, color, onPress}) => {
    return (
        <>
            <View style={[{ width: "70%", marginHorizontal: '15%' }]}>
                <TouchableOpacity 
                    onPress={onPress} 
                    style={{ 
                        height: 64,
                        marginTop: 24, 
                        backgroundColor: color,
                        justifyContent: "center", 
                        borderRadius: 4,
                        shadowRadius: 64,
                        elevation: 12
                    }}
                >
                    <Text style={{color: "#222", textAlign: "center", fontSize: 24, fontFamily: 'Bangers-Regular' }}>{text}</Text>
                </TouchableOpacity>
            </View> 
        </>
    );
}