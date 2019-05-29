import { createAppContainer, createSwitchNavigator } from 'react-navigation'

import MainTabNavigator from './MainTabNavigator.js'
import AuthNavigator from './AuthNavigator.js'
import AuthLoadingScreen from '../screens/AuthLoadingScreen.js'

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      Main: MainTabNavigator,
      Auth: AuthNavigator
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
)
