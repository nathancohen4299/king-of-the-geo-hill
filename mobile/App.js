/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  View,
} from 'react-native';
import { LargeButton } from './components/LargeButton';

const App = () => {
  return (
    <>
      <View style={[{height: '35%'}]} />
      <LargeButton text='Create Game' color='#2277DD'/>
      <View style={[{height: '2.5%'}]} />
      <LargeButton text='Join Game' color='#339933'/>
    </>
  );
};

export default App;
