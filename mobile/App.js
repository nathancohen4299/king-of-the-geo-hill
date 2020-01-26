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
import { ResultPage } from './src/result/ResultPage';
import { DeveloperPage } from './src/developer/DeveloperPage';

const MainNavigator = createStackNavigator({
  Start: {screen: StartPage},
  Developer: {screen: DeveloperPage},
  Result: {screen: ResultPage},
  GameSetup: {screen: GameSetupPage},
  Game: {screen: GamePage},
  JoinGame: {screen: JoinGamePage},
  CreateGame: {screen: CreateGamePage},
}, {
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
}
});

const App = createAppContainer(MainNavigator);

export default App;
