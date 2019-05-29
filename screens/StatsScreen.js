import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Table, Row, Rows } from 'react-native-table-component'
import { makeGetRequest, personalStatsPath, statsPath } from '../api.js'

export default class StatsScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tableHead: ['Name', 'Win %', 'Games'],
      tableData: [],
      personalTableHead: ['Games', 'Win %', 'Wins', 'Losses'],
      personalTableData: []
    }
  }

  componentDidMount() {
    this._onFocusListener = this.props.navigation.addListener('didFocus', () => { // eslint-disable-line
      this.setState({tableData: []})
      this.setState({personalTableData: []})
      makeGetRequest(statsPath)
        .then(res => {
          res.stats.forEach(stat => {
            const arr = [stat.user.username, ((stat.wins / stat.games_played) * 100).toFixed(0) + '%', stat.games_played] // eslint-disable-line prefer-template
            this.setState(prevState => ({
              tableData: [...prevState.tableData, arr]
            }))
          })
        })
        .catch(err => {
          console.log(err)
          console.log('Error fetching stats.')
        })
      makeGetRequest(personalStatsPath)
        .then(res => {
          console.log(res.personalStats)
          const stats = {
            games: 0,
            wins: 0,
            losses: 0
          }
          res.personalStats.forEach(stat => {
            stats.games += stat.games_played
            stats.wins += stat.wins
            stats.losses += stat.losses
          })
          const arr = [stats.games, ((stats.wins / stats.games) * 100).toFixed(0) + '%', stats.wins, stats.losses] // eslint-disable-line prefer-template
          this.setState(prevState => ({
            personalTableData: [...prevState.personalTableData, arr]
          }))
        })
        .catch(err => {
          console.log(err)
          console.log('Error fetching personal stats.')
        })
      })
  }

  render() {
    const { tableHead, tableData, personalTableData, personalTableHead } = this.state
    return (
      <View style={styles.container}>
        <Text style={styles.tableHeader}>Leaderboard: Last Month</Text>
        <Table style={{ marginBottom: 20 }} borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text} />
          <Rows data={tableData} textStyle={styles.text} />
        </Table>
        <Text style={styles.tableHeader}>Personal Life Time Statistics</Text>
        <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
          <Row data={personalTableHead} style={styles.head} textStyle={styles.text} />
          <Rows data={personalTableData} textStyle={styles.text} />
        </Table>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
  tableHeader: { fontSize: 22 }
})
