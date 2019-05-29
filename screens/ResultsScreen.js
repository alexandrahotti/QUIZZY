import React from 'react'
import { View, StyleSheet, Text, Image, ActivityIndicator } from 'react-native'
import ResultsComponent from '../components/ResultsComponent.js'
import HomeButton from '../components/HomeButton.js'
import {
  makePlayerFinishedRequest,
  makeDidAllPlayersFinishGameRequest,
  makeGetGameResultsRequest,
  makeAllQuestionsAnsweredRequest,
  makeStoreGameStatisticsAndHistoryRequest
} from '../api.js'

export default class ResultsScreen extends React.Component {
  static navigationOptions = {
    title: 'Results',
    fontSize: 60,
    headerLeft: null,
  }

  constructor(props) {
    super(props)
    const { navigation } = this.props
    this.state = {
      isLoading: true,
      allJoinedResultsRoom:false,
      gameID: navigation.state.params.gameID,
      socket: navigation.state.params.socket,
      message: null,
      results: [[null], [null]],
      userNames: [null, null]
    }
  }

  componentDidMount(){
  
    const { gameID } = this.state
    // first the player notifies the server that it has joined the results room.
    // the server will then update the gameobject in model to let it know that it is here
    makePlayerFinishedRequest(gameID)
    .then((msg) => {
      console.log(msg);

      // next the player checks if the other player also has joined the results room
      makeDidAllPlayersFinishGameRequest(gameID)
      .then((gameFinished) => {

        // if this is the first player to join the room gameFinished = false. else it will equal true
        this.setState({allJoinedResultsRoom:gameFinished})

              // allQuestionsAnswered checks if all questions are answerd
              // i.e. if we should render the reuslt page and fetch the game results or not
              makeAllQuestionsAnsweredRequest(gameID)
              .then(() => {
                this.socketHandler();
                }).catch((err) => {
                  console.log(err);
                  console.log('Checking if all questions answered request failed');
                })
      }).catch((err) => {
        console.log(err);     
        console.log('FAILED: Checking if all players finished. I.e. if all players are here at the results screen and notified/updated the gameobject: games(gameID) about this FAILED');
      })
    }).catch((err) => {
      console.log(err);
      console.log('Notifying the gameobject in model about that the current player finished failed');
    })

}

  getGameResults() {
    const { gameID } = this.state
    makeGetGameResultsRequest(gameID)
      .then(game => {
        this.updateResultsState(game)
      })
      .catch(err => {
        console.log(err);
        console.log('makeGetGameResultsRequest failed')
      })
  }

  recordGameResults() {
    // we make an api request to store the results  from the current game into the database
    // with results I mean statistcs and match history ( the stats and match tables)
    const { gameID } = this.state
    return makeStoreGameStatisticsAndHistoryRequest(gameID)
      .then(msg => {
        return msg
      })
      .catch(err => {
        console.log(err);
        console.log('makeStoreGameStatisticsAndHistoryRequest failed')
      })
  }

  updateResultsState(game) {
    this.setState({
      message: game.message,
      results: game.results
    })
  }

  navigateHome() {
    const { navigation } = this.props
    const { username } = this.state


    const { socket } = this.state


    socket.disconnect(true);
    socket.emit('disconnect');


    navigation.navigate('Home', { username, disableOnPress: false })
  }

  socketHandler() {
    const { gameID, allJoinedResultsRoom } = this.state

    this.state.socket.emit("joinResultsRoom", {gameID: gameID, allJoinedResultsRoom: allJoinedResultsRoom }); // eslint-disable-line
    this.state.socket.on('displayResults', data => {    // eslint-disable-line
      this.setState({ isLoading: false })

      this.recordGameResults()
        .then(() => {})
        .catch(err => {
          console.log(err);

          console.log('recordGameResults failed')
        })

      this.getGameResults()
    })
  }

  render() {
    const { isLoading, results, userNames, message } = this.state
    if (isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <View style={styles.itemContainer}>
          <View style={styles.playersContainer}>
            <View style={styles.playerContainer}>
              <Image
                source={__DEV__ ? require('../users/p1.png') : require('../users/p2.png')}  // eslint-disable-line
                style={styles.playerImage}
              />

              <ResultsComponent option={results[0]} />

              <Text style={styles.playerText}>{userNames[0]}</Text>
            </View>

            <View style={styles.playerContainer}>
              <Image
                source={__DEV__ ? require('../users/p2.png') : require('../users/p2.png')}  // eslint-disable-line
                style={styles.playerImage}
              />

              <ResultsComponent option={results[1]} />

              <Text style={styles.playerText}>{userNames[1]}</Text>
            </View>
          </View>

          <Text style={styles.messageText}>{message}</Text>

          <HomeButton option='HOME' onPress={() => this.navigateHome()} />
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

  messageText: {
    alignSelf: 'center',
    color: '#17202A',
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold'
  },
  playerImage: {
    width: 120,
    height: 100,
    resizeMode: 'contain',
    marginTop: 3,
    marginBottom: 10
  },
  container: {
    backgroundColor: '#F7F9F9',
    flex: 1,
    height: '100%',
    width: '100%'
  }
})
