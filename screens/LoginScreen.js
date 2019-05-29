import React from 'react'
import { TextInput, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import Colors from '../constants/Colors.js'
import { makeLoginRequest } from '../api.js'

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: ''
    }

    this.onButtonPress = this.onButtonPress.bind(this)
    this.onSignUpPress = this.onSignUpPress.bind(this)
  }

  onSignUpPress() {
    const { navigation } = this.props
    navigation.navigate('SignUp')
  }

  onButtonPress() {
    const { username, password } = this.state
    const { navigation } = this.props
    makeLoginRequest(username, password)
      .then(res => {
        if (res.message === 'SUCCESS') {
          navigation.navigate('Home', { username, disableOnPress: false })
        }
      })
      .catch(err => {
        console.log(err)
        console.log('Login Request Failed')
      })
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.welcomeText}>Welcome to QUIZZY</Text>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>Please sign up or login to your existing account.</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onSubmitEditing={() => this.passwordInput.focus()}
            autoCorrect={false}
            returnKeyType="next"
            placeholder="Username"
            placeholderTextColor="rgba(180,180,180,0.8)"
            onChangeText={text => this.setState({ username: text })}
          />

          <TextInput
            style={styles.input}
            returnKeyType="go"
            ref={input => (this.passwordInput = input)} // eslint-disable-line
            placeholder="Password"
            placeholderTextColor="rgba(180,180,180,0.8)"
            secureTextEntry
            onChangeText={text => this.setState({ password: text })}
          />

          <TouchableOpacity style={styles.buttonContainer} onPress={this.onButtonPress}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>

          <Text style={styles.text} onPress={this.onSignUpPress}>
            Sign Up
          </Text>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F9F9',
    flex: 1,
    height: '100%'
  },
  loginContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center'
  },
  welcomeText: {
    color: '#17202A',
    fontWeight: 'bold',
    fontSize: 20
  },
  infoTextContainer: {
    alignItems: 'center',
    marginTop: 30,
    width: '70%'
  },

  infoText: {
    color: '#17202A',
    fontSize: 17,
    alignSelf: 'center'
  },
  formContainer: {
    padding: 20
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(225,225,225,0.2)',
    marginBottom: 10,
    padding: 10,
    color: '#000'
  },
  buttonContainer: {
    backgroundColor: Colors.secondaryColor,
    paddingVertical: 15
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700'
  },
  text: {
    color: Colors.secondaryColor,
    textAlign: 'center',
    padding: '5%',
    fontSize: 16
  }
})
