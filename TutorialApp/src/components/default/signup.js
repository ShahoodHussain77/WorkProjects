import React, { Component } from 'react'
import { Text, View, Dimensions, StatusBar, ImageBackground, TouchableOpacity, TextInput, ScrollView } from 'react-native'
// import { Form, Item, Input, Label, Icon, Button } from 'native-base';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import image from "./../../assets/Images/header.png";
import styles from "./../../styles/signin_default_styles";
import LinearGradient from 'react-native-linear-gradient';

const maxHeight = Dimensions.get('window').height;
const maxWidth =Dimensions.get('window').width;
class SignIn extends Component {

  constructor(props) {
    super(props)
    this.state = {
      width: 0,
      height: 0,
      data: []
    }
  }
  
  componentDidMount() {
    let source = resolveAssetSource(image);
    const ratio = Math.min(maxWidth / source.width, maxHeight / source.height);
    this.setState({
      width: source.width*ratio,
      height: source.height*ratio
    })
  }

  render() {
    return (
      <ScrollView contentContainerStyle={{flexGrow:1}}>
        <LinearGradient 
        colors={['#612086', '#c9116b']} 
        locations={[0.55,1]}
        style={styles.mainContainer}>
          <StatusBar backgroundColor="#612086" barStyle="light-content" />
          <ImageBackground source={require('./../../assets/Images/mindstorm.png')}
          style={[styles.headerImage,{width: this.state.width, height: this.state.height}]}>
            <Text style={styles.headerText}>TUTORIAL APP</Text>
          </ImageBackground>
          <View style={styles.form}>
            <TextInput 
            placeholder="Email"
            placeholderTextColor="#ddd"
            style={styles.inputBox}/>
            <View style={{padding: 10}}></View>
            <TextInput 
            placeholder="Password"
            placeholderTextColor="#ddd"
            style={styles.inputBox}/>
            <View style={{padding: 10}}></View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginText}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.signupBotton}>
            <Text style={styles.signupText}>Don't have an account? <Text style={{fontWeight: 'bold'}}>Sign Up</Text></Text>
          </TouchableOpacity>
        </LinearGradient >
      </ScrollView>
    )
  }
}

export default SignIn