import React, { useState } from 'react'
import { TextInput } from 'react-native'
import { TextInputMask } from 'react-native-masked-text'

export const LargeTextInput = ({text, onChangeText = () => {}, placeholder}) => {
    return (
        <TextInput
            style={{ height: 64, borderColor: 'gray', borderWidth: 2, borderRadius: 4, marginHorizontal: '15%', fontSize: 24, fontFamily: 'Bangers-Regular', textAlign: 'center'}}
            onChangeText={text => onChangeText(text)}
            value={text}
            placeholder={placeholder}
        />
    )
}

export const LargeNumericTextInput = ({text, onChangeText = () => {}, placeholder}) => {
    return (
        <TextInputMask
            style={{ height: 64, borderColor: 'gray', borderWidth: 2, borderRadius: 4, marginHorizontal: '15%', fontSize: 24, fontFamily: 'Bangers-Regular', textAlign: 'center'}}
            onChangeText={text => onChangeText(text)}
            value={text}
            placeholder={placeholder}
            type={'only-numbers'}
        />
    )
}

export const useLargeTextInput = () => {
    const [text, onChangeText] = useState('')
    return [text, onChangeText]
}