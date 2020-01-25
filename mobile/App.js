/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { StartPage } from './src/start/StartPage';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import { CreateGamePage } from './src/create_game/CreateGamePage';
import { JoinGamePage } from './src/join_game/JoinGamePage';
import { GameSetupPage } from './src/game_setup/GameSetupPage';
import { GamePage } from './src/game/GamePage';

const MainNavigator = createStackNavigator({
  Game: {screen: GamePage},
  GameSetup: {screen: GameSetupPage},
  JoinGame: {screen: JoinGamePage},
  Start: {screen: StartPage},
  CreateGame: {screen: CreateGamePage},
}, {
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
}
});

const App = createAppContainer(MainNavigator);

export default App;
