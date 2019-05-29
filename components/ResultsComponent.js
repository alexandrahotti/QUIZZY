import React from 'react'
import { Text, View } from 'react-native'

const ResultsComponent = function(props) {
  const { option } = props

  return (
    <View style={styles.resultsContainer}>
      <View style={styles.answerContainer}>
        <Text style={styles.textStyle}>{option[0]}</Text>
      </View>
      <View style={styles.answerContainer}>
        <Text style={styles.textStyle}>{option[1]}</Text>
      </View>
      <View style={styles.answerContainer}>
        <Text style={styles.textStyle}>{option[2]}</Text>
      </View>
    </View>
  )
}
const styles = {
  textStyle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ECF0F1',
    alignSelf: 'center',
    margin: 5
  },
  answerContainer: {
    flex: 1,
    alignSelf: 'center',
    backgroundColor: '#D35400',
    borderWidth: 4,
    borderColor: '#D55B0B'
  },
  resultsContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  resultContainer: {}
}

export default ResultsComponent
