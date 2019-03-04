import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'
import { createRootNavigator } from "./../../../router";
import {createAppContainer} from 'react-navigation';

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      logedIn: false,
      checkedIn: false
    }
  }

  async componentDidMount() {
    let logedIn = await AsyncStorage.getItem('IsLogedIn')
    if( logedIn ) {
      this.setState({ logedIn: true, checkedIn: true })
    } else {
      this.setState({ logedIn: false, checkedIn: true })
    }
  };
  
  render() {
    if( !this.state.checkedIn ) {
      return null
    }
    if( this.state.logedIn ) {
      const App = createAppContainer(createRootNavigator('MainTabs'))
      return <App />
    } else {
      const App = createAppContainer(createRootNavigator('MainScreen'))
      return <App />
    }
  }
}

export default Home