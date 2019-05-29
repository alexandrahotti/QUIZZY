import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

const HomeButton = function(props) {
  const { onPress, option } = props

  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <Text style={styles.textStyle}>{option}</Text>
    </TouchableOpacity>
  )
}

const styles = {
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
    backgroundColor: '#D35400',
    alignSelf: 'center',
    color: 'white',
  },
}

export default HomeButton
