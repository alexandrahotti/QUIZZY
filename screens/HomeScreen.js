import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import Colors from '../constants/Colors'
import { makeGetRequest, checkauthPath, makeNewGameRequest } from '../api.js'

window.navigator.userAgent = 'react-native'

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props)
    const { navigation } = this.props
    this.state = {
      userName: navigation.state.params.username
    }
  }

  componentDidMount() {
    makeGetRequest(checkauthPath)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
        console.log('Check auth failed error')
      })
  }

  onNewGameButtonPress() {
    const { userName } = this.state
    makeNewGameRequest(userName)
      .then(game => {
        this.createSocketConnection(game)
      })
      .catch(err => {
        console.log(err)
        console.log('Create Game Request failed')
      })
  }

  createSocketConnection(game) {
    const { navigation } = this.props
    const { userName } = this.state
    navigation.navigate('WaitingRoom', {
      gameID: game.gameID,
      fullRoom: game.fullRoom,
      userName
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.getStartedContainer}>
          <View style={styles.itemContainer}>
            <View style={styles.messageTextContainer}>
              <Text style={styles.messageText}>
                Welcome to QUIZZY! A f-f-fun Multiplayer Trivia Game. Press New Game to join or start a new game, or
                navigate to stats to see the leaderboard or your own stats.
              </Text>
            </View>

            <TouchableOpacity style={styles.buttonContainer} onPress={() => this.onNewGameButtonPress()}>
              <Text style={styles.textStyle}>NEW GAME</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    height: '80%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#FBFCFC'
  },
  buttonContainer: {
    alignItems: 'center',
    fontSize: 25,
    justifyContent: 'space-around',
    backgroundColor: '#D35400',
    borderWidth: 6,
    borderRadius: 10,
    borderColor: '#D55B0B'
  },

  textStyle: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 7,
    marginRight: 7,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ECF0F1',
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#FBFCFC',
    height: '100%'
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4
  },

  messageText: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
    margin: 13
  },
  messageTextContainer: {
    alignSelf: 'center',
    // backgroundColor: '#D86316',
    borderWidth: 4,
    borderRadius: 5,
    borderColor: '#D55B0B'
  },
  navigationFilename: {
    marginTop: 5
  }
})
