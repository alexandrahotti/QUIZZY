import React from 'react'
import { View, StyleSheet, Text, Image, ActivityIndicator } from 'react-native'
import io from 'socket.io-client/dist/socket.io'
import { makeGetUserNamesRequest, socketAdressPath, randomQuotePath, makeGetRequest } from '../api.js'

export default class WaitingRoomScreen extends React.Component {

  static navigationOptions = {
    headerLeft: null,
  }

  constructor(props) {
    super(props)

    const { navigation } = this.props

    this.state = {
      allPlayersJoined: navigation.state.params.fullRoom,
      gameID: navigation.state.params.gameID,
      userName: navigation.state.params.userName,
      userNames: [null, null],
      timer: 2, // set the timer count here
      quote: null
    }
  }

  componentDidMount() {
    console.log('MOUNTING')

    const { gameID, userName, allPlayersJoined } = this.state
    this.socket = io(socketAdressPath, { transports: ['websocket'] })
    this.socket.emit('join', { gameID, userName, allPlayersJoined })
    this.socketHandler(this.socket)

    this.getRandomQuote()
  }

  getRandomQuote() {
    makeGetRequest(randomQuotePath)
      .then(quoteObject => {
        this.setState({ quote: `${quoteObject.quote.quote}-${quoteObject.quote.author}` })
      })
      .catch(err => {
        console.log(err)
        console.log('makeGetRequest failed')
      })
  }

  socketHandler(socket) {
    const { gameID, userName, timer } = this.state
    const { navigation } = this.props
    socket.on('timer', countdown => {
      this.setState({ timer: countdown })
    })

    socket.on('stoppingTimer', () => {
      navigation.navigate('Game', { gameID, userName, socket })
    })

    socket.on('getReady', () => {
      makeGetUserNamesRequest(gameID)
        .then(userNames => {
          this.setState({ userNames })
          socket.emit('timer', { gameID, countDownTime: timer })
          this.setState({ allPlayersJoined: true })
        })
        .catch(err => {
          console.log(err)
          console.log('makeGetUserNamesRequest failed')
        })
    })
  }

  render() {
    const { allPlayersJoined, userName, quote, timer, userNames } = this.state
    if (!allPlayersJoined) {
      return (
        <View style={styles.container}>
          <View style={styles.itemContainer}>
            <View style={styles.playersContainer}>
              <View style={styles.playerContainer}>
                <Image
                  source={__DEV__ ? require('../users/p1.png') : require('../users/p2.png')}  // eslint-disable-line
                  style={styles.playerImage}
                />
                <Text style={styles.playerText}>{userName}</Text>
              </View>
              <View style={styles.playerContainer}>
                <Text style={styles.playerText}>PLAYER 2</Text>
              </View>
            </View>
            <Text style={styles.messageText}>Waiting for another player...</Text>
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText}>{quote}</Text>
            </View>
            <ActivityIndicator size="large" color="black" />
          </View>
        </View>
      )
    } 
    return (
      <View style={styles.container}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timer}s</Text>
        </View>

        <View style={styles.itemContainer}>
          <View style={styles.playersContainer}>
            <View style={styles.playerContainer}>
              <Image
                source={__DEV__ ? require('../users/p1.png') : require('../users/p2.png')} // eslint-disable-line
                style={styles.playerImage}
              />
              <Text style={styles.playerText}>{userNames[0]}</Text>
            </View>

            <View style={styles.playerContainer}>
              <Image
                source={__DEV__ ? require('../users/p2.png') : require('../users/p2.png')}  // eslint-disable-line
                style={styles.playerImage}
              />
              <Text style={styles.playerText}>{userNames[1]}</Text>
            </View>
          </View>

          <View style={styles.messageContainer}>
            <Text style={styles.readyText}>GET READY</Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainText: {
    alignSelf: 'center',
    color: '#17202A',
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold'
  },
  timerContainer: {
    height: '10%',

    alignItems: 'flex-end',
    marginLeft: 7,
    justifyContent: 'space-around',
    backgroundColor: '#fff'
  },
  timerText: {
    color: '#17202A',
    marginRight: 10,
    fontWeight: 'bold',
    fontSize: 20
  },
  messageContainer: {
    height: '20%',

    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#fff'
  },
  itemContainer: {
    height: '80%',

    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#fff'
  },
  playersContainer: {
    width: '100%',
    height: '50%',
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  playerContainer: {
    marginBottom: 1
  },
  playerText: {
    alignSelf: 'center',
    color: '#17202A',
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold'
  },
  quoteText: {
    alignSelf: 'center',
    color: '#212F3C',
    alignItems: 'center',
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic'
  },

  quoteContainer: {
    width: '70%',
    flex: 1,
    marginTop: 11,
    alignItems: 'center'
  },
  readyText: {
    alignSelf: 'center',
    color: '#17202A',
    marginTop: 10,
    fontSize: 30,
    fontWeight: 'bold'
  },
  messageText: {
    alignSelf: 'center',
    color: '#17202A',
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold'
  },
  playerImage: {
    width: 125,
    height: 105,
    resizeMode: 'contain',
    marginTop: 14,
    marginBottom: 10
  },
  container: {
    backgroundColor: '#F7F9F9',
    flex: 1,
    height: '100%',
    width: '100%'
  }
})
