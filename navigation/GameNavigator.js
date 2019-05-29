import { createStackNavigator, createAppContainer } from 'react-navigation'
import WaitingRoomScreen from '../screens/WaitingRoomScreen.js'
import ResultsScreen from '../screens/ResultsScreen.js'
import GameScreen from '../screens/GameScreen.js'
import Layout from '../constants/Layout.js'

const Game = createStackNavigator(
  {
    WaitingRoom: { screen: WaitingRoomScreen },
    Game: { screen: GameScreen },
    Results: { screen: ResultsScreen }
  },
  {
    defaultNavigationOptions: { ...Layout.navOptions },
    tabBarVisible: false,
  }
)

const GameApp = createAppContainer(Game)

export default GameApp
