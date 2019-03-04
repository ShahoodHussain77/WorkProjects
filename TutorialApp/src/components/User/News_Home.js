import React, { Component } from 'react'
import { Text, View, Platform } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';

class NewsHome extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'News',
      tabBarLabel: 'News',
      tabBarColor: '#1c1c26',
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon size={20} name={ Platform.OS === 'ios' ? (focused ? 'ios-home' : 'ios-home-outline') : 'md-home' } style={{ color: tintColor }} />
      )
    }
  }

  render() {
    return (
      <View>
        <Text> All News </Text>
      </View>
    )
  }
}

export default NewsHome