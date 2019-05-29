import React from 'react'
import { ActivityIndicator, AsyncStorage, StatusBar, View } from 'react-native'

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props)
    this._bootstrapAsync() // eslint-disable-line
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userTokenQuizzy')
    const { navigation } = this.props

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    console.log(userToken)
    console.log('No userToken found, navigate to AuthStack')

    navigation.navigate(userToken ? 'App' : 'Auth')
  }

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    )
  }
}
