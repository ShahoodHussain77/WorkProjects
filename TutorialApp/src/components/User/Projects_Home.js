import React, { Component } from 'react'
import { Text, View, Platform, Button, AsyncStorage} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';

class ProjectsHome extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
        title: 'Projects',
        tabBarLabel: 'Projects',
        tabBarColor: '#1c1c26',
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon size={20} name={ Platform.OS === 'ios' ? (focused ? 'ios-home' : 'ios-home-outline') : 'md-home' } style={{ color: tintColor }} />
        )
    }
  }

  render() {
    return (
      <View>
        <Button title="Log out" onPress={() => {
          this.props.navigation.navigate('SignedOut')
          AsyncStorage.removeItem('IsLogedIn')
         }}></Button>
      </View>
    )
  }
}

export default ProjectsHome