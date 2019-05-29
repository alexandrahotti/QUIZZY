import React from 'react'
import { View, TextInput } from 'react-native'

const AnswerInput = function(props) {
  const { onChangeText, option } = props

  return (
    <View style={styles.answerContainer}>
      <TextInput
        style={styles.textStyle}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        placeholder={option}
        placeholderTextColor="rgba(180,180,180,0.8)"
        onChangeText={onChangeText}
      />
    </View>
  )
}
const styles = {
  textStyle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5D6D7E',
    alignSelf: 'center'
  },
  answerContainer: {
    flex: 1,
    marginTop: 5,
    marginBottom: 2,
    marginLeft: 7,
    marginRight: 7,
    justifyContent: 'space-around',
    backgroundColor: '#EBEDEF',
    borderWidth: 4,
    borderRadius: 10,
    borderColor: '#F2F4F4'
  }
}

export default AnswerInput
