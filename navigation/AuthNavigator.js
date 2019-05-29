import { createStackNavigator, createAppContainer } from 'react-navigation'
import LoginScreen from '../screens/LoginScreen.js'
import SignUpScreen from '../screens/SignUpScreen.js'
import Layout from '../constants/Layout.js'

const Auth = createStackNavigator(
  {
    Auth: { screen: LoginScreen },
    SignUp: { screen: SignUpScreen }
  },
  {
    defaultNavigationOptions: { ...Layout.navOptions }
  }
)

const AuthApp = createAppContainer(Auth)

export default AuthApp
