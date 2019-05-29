import { Dimensions } from 'react-native'
import Colors from './Colors.js'

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

export default {
  window: {
    width,
    height
  },
  isSmallDevice: width < 375,

  navOptions: {
    title: 'Quizzy',
    headerStyle: {
      backgroundColor: Colors.primaryColor
    },
    headerTintColor: '#fff',

    headerTitleStyle: {
      color: '#ECF0F1',
      fontWeight: 'bold',
      fontSize: 35
    }
  }
}
