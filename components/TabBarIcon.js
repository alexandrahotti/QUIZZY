import React from 'react'
import { Icon } from 'expo'

import Colors from '../constants/Colors.js'

const TabBarIcon = function(props) {
  const { name, focused } = props

  return (
    <Icon.Ionicons
      name={name}
      size={26}
      style={{ marginBottom: -3 }}
      color={focused ? Colors.primaryColor : Colors.tabIconDefault}
    />
  )
}

export default TabBarIcon
