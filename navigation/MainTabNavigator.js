import React from 'react'
import { Platform } from 'react-native'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'

import TabBarIcon from '../components/TabBarIcon.js'
import HomeScreen from '../screens/HomeScreen.js'
import ProfileScreen from '../screens/ProfileScreen.js'
import AddUserQuestionScreen from '../screens/AddUserQuestionScreen.js'
import StatsScreen from '../screens/StatsScreen.js'
import GameScreen from '../screens/GameScreen.js'
import ResultsScreen from '../screens/ResultsScreen.js'
import WaitingRoomScreen from '../screens/WaitingRoomScreen.js'
import Layout from '../constants/Layout.js'

const HomeStack = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    WaitingRoom: { screen: WaitingRoomScreen },
    Game: { screen: GameScreen },
    Results: { screen: ResultsScreen }
  },
  {
    defaultNavigationOptions: {
      ...Layout.navOptions
    }
  }
)

// HomeStack.navigationOptions = {
//   tabBarLabel: 'Home',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS === 'ios' ? `ios-information-circle${focused ? '' : '-outline'}` : 'md-information-circle'}
//     />
//   )
// }

HomeStack.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation.state.routes[navigation.state.index];
  const navigationOptions = {};

  if (routeName === 'WaitingRoom' || routeName === 'Game' || routeName === 'Results') {
    navigationOptions.tabBarVisible = false
    navigationOptions.headerLeft = null
  }

  navigationOptions.tabBarLabel = 'Home'
  navigationOptions.tabBarIcon = ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-information-circle${focused ? '' : '-outline'}` : 'md-information-circle'}
    />
  )

  return navigationOptions;
};

const StatsStack = createStackNavigator(
  {
    Stats: { screen: StatsScreen }
  },
  {
    defaultNavigationOptions: {
      ...Layout.navOptions
    }
  }
)

StatsStack.navigationOptions = {
  tabBarLabel: 'Stats',
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-stats' : 'md-stats'} />
}

const ProfileStack = createStackNavigator(
  {
    Profile: { screen: ProfileScreen },
    AddUserQuestion: { screen: AddUserQuestionScreen }
  },
  {
    defaultNavigationOptions: {
      ...Layout.navOptions
    }
  }
)

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'} />
  )
}

export default createBottomTabNavigator(
  {
    ProfileStack,
    HomeStack,
    StatsStack
  },
  {
    initialRouteName: 'HomeStack'
  }
)
