import React from 'react'
import { TextInput, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import { makeSubmitQuestionRequest } from '../api.js'
import Colors from '../constants/Colors.js'
import AnswerInput from '../components/AnswerInput.js'

export default class AddUserQuestionScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      answer1: '',
      answer2: '',
      answer3: '',
      answer4: '',
      question: ''
    }

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit() {
    const { answer1, answer2, answer3, answer4, question } = this.state
    const { navigation } = this.props
    if (answer1 !== '' && answer2 !== '' && answer3 !== '' && answer4 !== '' && question !== '') {
      makeSubmitQuestionRequest(answer1, answer2, answer3, answer4, question)
        .then(() => {
          console.log('User question submitted')
          navigation.navigate('Profile')
        })
        .catch(err => {
          console.log('Submit user question failed')
          console.log(err)
        })
    }
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.upperHalfContainer}>
          <Text>Here you can enter your own question!</Text>
          <View style={styles.questionContainer}>
            <TextInput
              style={styles.textStyle}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              placeholder="Create your own question!"
              placeholderTextColor="rgba(180,180,180,0.8)"
              onChangeText={text => this.setState({ question: text })}
            />
          </View>
        </View>

        <View style={styles.lowerHalfContainer}>
          <View style={styles.answerOptionsContainer}>
            <AnswerInput option="Correct Answer" onChangeText={text => this.setState({ answer1: text })} />
            <AnswerInput option="Wrong Answer" onChangeText={text => this.setState({ answer2: text })} />
          </View>
          <View style={styles.answerOptionsContainer}>
            <AnswerInput option="Wrong Answer" onChangeText={text => this.setState({ answer3: text })} />
            <AnswerInput option="Wrong Answer" onChangeText={text => this.setState({ answer4: text })} />
          </View>
        </View>

        <TouchableOpacity style={styles.buttonContainer} onPress={this.onSubmit}>
          <Text style={styles.textStyle}>SUBMIT</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F9F9',
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain'
  },
  textStyle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5D6D7E',
    alignSelf: 'center'
  },
  upperHalfContainer: {
    height: '40%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 5
  },
  buttonContainer: {
    backgroundColor: Colors.secondaryColor,
    paddingVertical: 15
  },
  questionContainer: {
    height: '35%',

    width: '90%',
    marginTop: 3,
    marginBottom: 3,
    justifyContent: 'space-around',
    backgroundColor: '#EBEDEF',
    borderWidth: 4,
    borderRadius: 10,
    borderColor: '#F2F4F4'
  },
  questionText: {
    flex: 1,
    width: '85%',
    alignSelf: 'center',
    fontSize: 18,
    color: '#5D6D7E',
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 1,
    marginRight: 1
  },
  infoContainer: {
    height: '12%',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },

  lowerHalfContainer: {
    height: '50%',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  answerOptionsContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row'
  }
})
