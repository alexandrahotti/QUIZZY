import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

const AnswerButton = function(props) {
  const { onPress, option } = props

  return (
    <TouchableOpacity style={styles.answerContainer} onPress={onPress}>
      <Text style={styles.textStyle}>{option}</Text>
    </TouchableOpacity>
  )
}

const styles = {
  textStyle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ECF0F1',
    alignSelf: 'center'
  },
  answerContainer: {
    flex: 1,
    marginTop: 5,
    marginBottom: 2,
    marginLeft: 7,
    marginRight: 7,
    justifyContent: 'space-around',
    backgroundColor: '#f2c81d',
    borderWidth: 4,
    borderRadius: 10,
    borderColor: '#F1C40F'
  }
}

export default AnswerButton
