import React from 'react'
import { TextInput, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import { makeSignUpRequest } from '../api.js'
import Colors from '../constants/Colors.js'

export default class SignUpScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      email: '',
      name: ''
    }

    this.onSignUpPress = this.onSignUpPress.bind(this)
  }

  onSignUpPress() {
    const { username, email, password, name } = this.state
    const { navigation } = this.props
    makeSignUpRequest(username, email, password, name)
      .then(res => {
        if (res.message === 'SUCCESS') {
          navigation.navigate('Home', { username, disableOnPress: false })
        }
      })
      .catch(err => {
        console.log(err)
        console.log('Signup Request failed')
      })
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.welcomeText}>QUIZZY</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onSubmitEditing={() => this.nameInput.focus()}
            autoCorrect={false}
            returnKeyType="next"
            placeholder="Username"
            placeholderTextColor="rgba(180,180,180,0.8)"
            onChangeText={text => this.setState({ username: text })}
          />

          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onSubmitEditing={() => this.emailInput.focus()}
            ref={input => (this.nameInput = input)} // eslint-disable-line no-return-assign
            autoCorrect={false}
            returnKeyType="next"
            placeholder="Name"
            placeholderTextColor="rgba(180,180,180,0.8)"
            onChangeText={text => this.setState({ name: text })}
          />

          <TextInput
            style={styles.input}
            returnKeyType="go"
            onSubmitEditing={() => this.passwordInput.focus()}
            ref={input => (this.emailInput = input)} // eslint-disable-line no-return-assign
            placeholder="Email"
            placeholderTextColor="rgba(180,180,180,0.8)"
            onChangeText={text => this.setState({ email: text })}
          />

          <TextInput
            style={styles.input}
            returnKeyType="go"
            ref={input => (this.passwordInput = input)} // eslint-disable-line no-return-assign
            placeholder="Password"
            placeholderTextColor="rgba(180,180,180,0.8)"
            secureTextEntry
            onChangeText={text => this.setState({ password: text })}
          />

          <TouchableOpacity style={styles.buttonContainer} onPress={this.onSignUpPress}>
            <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>
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
