import { AsyncStorage } from '@react-native-community/async-storage';

export const _storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.log('an error has occured')
    }
};

export const _retrieveData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return JSON.parse(value)
        }
    } catch (error) {
        console.log('an error has occurred')
    }
};

export const _removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch (error) {
        console.log('an error has occured')
    }
}

export const _hasData = async (key) => {
    try {
        const value = await _retrieveData(key) 
        return value !== null
    } catch (error) {
        console.log('an error has occured')
    }
}