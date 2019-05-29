import React from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'
// import Colors from '../constants/Colors'
import Match from '../components/Match.js'
import { makeGetRequest, userPath, matchHistoryPath, logoutPath } from '../api.js'

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      matches: []
    }
    this.onLogoutPress = this.onLogoutPress.bind(this)
    this.onAddUserQuestion = this.onAddUserQuestion.bind(this)
  }

  componentDidMount() {
    this._onFocusListener = this.props.navigation.addListener('didFocus', () => { // eslint-disable-line
      this.setState({matches: []})
      makeGetRequest(matchHistoryPath)
      .then(res => {
        res.matches.forEach(array => {
          array.forEach(match => {
            this.setState(prevState => ({
              matches: [...prevState.matches, match]
            }))
          })
        })
      })
      .catch(err => {
        console.log(err)
        console.log('Error fetching matches')
      })
    });
    makeGetRequest(userPath)
      .then(res => {
        console.log(res.user)
      })
      .catch(err => {
        console.log(err)
        console.log('Fetching User Error')
      })
  }

  onLogoutPress() {
    const { navigation } = this.props
    makeGetRequest(logoutPath)
      .then(res => {
        if (res.message === 'LOGOUT') {
          navigation.navigate('Auth')
        }
      })
      .catch(err => {
        console.log(err)
        console.log('Logout request failed')
      })
  }

  onAddUserQuestion() {
    const { navigation } = this.props
    navigation.navigate('AddUserQuestion')
  }

  matchHistoryList() {
    const { matches } = this.state
    return matches.map(data => {
      return <Match style={{height:40}} key={data.id} data={data} />
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.logoutContainer} onPress={this.onLogoutPress}>
          <Text style={styles.buttonText}>LOGOUT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress={this.onAddUserQuestion}>
          <Text style={styles.textStyle}>ADD USER QUESTION</Text>
        </TouchableOpacity>

        <Text style={styles.headerText}>Match History:</Text>
          {this.matchHistoryList()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F7F9F9',
    flex: 1,
    height: '100%'
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  },
  headerText: {
    marginTop: 10,
    fontSize: 24,
    paddingLeft: 5
  },
  buttonContainer: {
    alignItems: 'center',
    fontSize: 25,
    justifyContent: 'space-around',
    backgroundColor: '#388E3C',
    borderWidth: 6,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#43A047'
  },
  logoutContainer: {
    marginTop: 5,
    marginBottom: 10,
    alignItems: 'center',
    fontSize: 25,
    justifyContent: 'space-around',
    backgroundColor: '#cc0000',
    borderWidth: 6,
    borderRadius: 10,
    borderColor: '#ff0000'
  },

  buttonText: {
    margin: 5,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 23
  },
  textStyle: {
    margin: 5,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18
  }
})
