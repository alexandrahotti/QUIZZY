import React from 'react'
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native'
import io from 'socket.io-client/dist/socket.io'
import AnswerButton from '../components/AnswerButton.js'
import { makeRunGameRequest, makeRegisterAnswerRequest, socketAdressPath } from '../api.js'

export default class GameScreen extends React.Component {

  static navigationOptions = {
    headerLeft: null,
  }

  constructor(props) {
    super(props)

    const { navigation } = this.props

    this.state = {
      isLoading: false,
      gameObject: null,
      totalNoQuestions: 3,
      socket: navigation.state.params.socket,
      gameRoomSocket: null,
      gameID: navigation.state.params.gameID,
      userName: navigation.state.params.userName,
      questionNo: 0,
      question: null,
      answered: false,
      timerCount: 2, // set the timer count here
      timer: 2, // set the timer count here

      shuffledQuestions: [null, null, null, null]
    }
  }

  componentDidMount() {
    const { gameID, userName } = this.state
    this.state.gameRoomSocket = io(socketAdressPath, { transports: ['websocket'] })
    this.state.gameRoomSocket.emit('joinGameRoom', { gameID, userName }) // eslint-disable-line

    makeRunGameRequest(gameID)
      .then(game => {
        this.setState({ gameObject: game })
        this.updateQuestion()
        this.runTimer()
      })
      .catch(err => {
        console.log(err);
        console.log('makeRunGameRequest failed')
      })
  }

  registerAnswerLocal(ans) {
    this.setState({ answered: true })

    const { gameID, userName, questionNo } = this.state

    return makeRegisterAnswerRequest(gameID, userName, ans, questionNo)
      .then(() => {
        return 'answer registered!'
      })
      .catch(err => {
        console.log(err);
        console.log('makeRegisterAnswerRequest failed')
      })
  }

  runTimer() {
    this.state.gameRoomSocket.on('gameTimer', countdown => { // eslint-disable-line
      this.setState({ timer: countdown })
    })

    const { gameID, timer, userName, socket, answered, timerCount } = this.state
    this.state.gameRoomSocket.emit('gameTimer', {   // eslint-disable-line
      gameID,
      countDownTime: timer,
      userName,
    })

    this.state.gameRoomSocket.on('stoppingTimer', data => {  // eslint-disable-line
      const { answered } = this.state
      if (!answered) {
        console.log('storeIRNG DEFUALT NO ANSWER ANSWER');
        this.updateAnswer('-')
      }

      if (this.checkIfGameOver()) {
        const { gameRoomSocket } = this.state
        gameRoomSocket.disconnect(true);
        gameRoomSocket.emit('disconnect');

        this.props.navigation.navigate('Results', {   // eslint-disable-line
          gameID,
          socket,
          userName,
        })
      } else {
        this.updateQuestion()
        this.setState({ timer: timerCount })  // eslint-disable-line
        this.state.socket.emit('gameTimer', {   // eslint-disable-line
          gameID,
          countDownTime: timer,
          userName,
        })
        this.setState({ answered: false })
      }
    })
  }

  checkIfGameOver() {
    const { questionNo, totalNoQuestions } = this.state
    const currentQuestionNumber = questionNo

    if (currentQuestionNumber === totalNoQuestions) {
      return true
    }
    return false
  }

  updateQuestion() {
    const { gameObject, questionNo } = this.state
    this.setState({
      question: gameObject.questions[questionNo].question,
      shuffledQuestions: gameObject.shuffledQuestions[questionNo],
      isLoading: false,
    }
    )

    const nextQuestionIndex = questionNo + 1
    this.setState({ questionNo: nextQuestionIndex })

  }

  updateAnswer(ans) {
    this.registerAnswerLocal(ans)
      .then(() => {})
      .catch(err => {
        console.log(err);
        console.log('registerAnswerLocal failed')
      })
  }

  render() {
    const { isLoading, questionNo, timer, question, shuffledQuestions } = this.state
    if (isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <View style={styles.upperHalfContainer}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>{questionNo} out of 3</Text>
            <Text style={styles.infoText}>{timer}</Text>
          </View>

          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question}</Text>
          </View>
        </View>

        <View style={styles.lowerHalfContainer}>
          <View style={styles.answerOptionsContainer}>
            <AnswerButton
              backgroundColor='black'
              option={shuffledQuestions[0]}
              onPress={() => this.updateAnswer(shuffledQuestions[0])}
            />
            <AnswerButton
              backgroundColor='black'
              option={shuffledQuestions[1]}
              onPress={() => this.updateAnswer(shuffledQuestions[1])}
            />
          </View>

          <View style={styles.answerOptionsContainer}>
            <AnswerButton
              backgroundColor='black'
              option={shuffledQuestions[2]}
              onPress={() => this.updateAnswer(shuffledQuestions[2])}
            />
            <AnswerButton
              backgroundColor='black'
              option={shuffledQuestions[3]}
              onPress={() => this.updateAnswer(shuffledQuestions[3])}
            />
          </View>
        </View>
      </View>
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
  upperHalfContainer: {
    height: '40%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 5
  },
  infoText: {
    color: '#17202A',
    fontSize: 20,
    fontWeight: 'bold'
  },

  questionContainer: {
    height: '50%',

    width: '90%',
    marginTop: 3,
    marginBottom: 3,
    justifyContent: 'space-around',
    backgroundColor: '#f2c81d',
    borderWidth: 4,
    borderRadius: 10,
    borderColor: '#F1C40F'
  },
  questionText: {
    fontWeight: 'bold',
    flex: 1,
    width: '85%',
    alignSelf: 'center',
    fontSize: 15,
    color: '#FDFEFE',
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
