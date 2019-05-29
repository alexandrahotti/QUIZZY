import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const Match = function(props) {
  const { data } = props

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.textStyle}>{data.id1.username}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textStyle}>
          {data.player1_score} - {data.player2_score}
        </Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textStyle}>{data.id2.username}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F9F9',
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20
  },
  textStyle: {
    textAlign: 'center',
    fontSize: 18
  }
})

export default Match
