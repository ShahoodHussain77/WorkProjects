import React, { Component } from 'react'
import { Text, View, Dimensions, StatusBar, ImageBackground, TouchableOpacity, TextInput, ScrollView, Animated, AsyncStorage } from 'react-native'
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import image from "./../../assets/Images/header.png";
import styles from "./../../styles/signin_default_styles";
import LinearGradient from 'react-native-linear-gradient';
import Constants from "./../../Utils/Constants";

const maxHeight = Dimensions.get('window').height;
const maxWidth = Dimensions.get('window').width;
class SignIn extends Component {

  constructor(props) {
    super(props)
    this.state = {
      width: 0,
      height: 0,
      data: [],
      signIn: true,
      name: '',
      email: '',
      institute: '',
      number: '',
      password: ''
    }
    this.animatedValue1 = new Animated.Value(0);
    this.animatedValue2 = new Animated.Value(maxWidth);
    this.animatedValue3 = new Animated.Value(maxWidth);
    this.animatedValue4 = new Animated.Value(maxWidth);
    this.gotoSignUp = this.gotoSignUp.bind(this);
    this.gotoNum = this.gotoNum.bind(this);
    this.gotoFinish = this.gotoFinish.bind(this);
    this.signInAnimate = this.signInAnimate.bind(this);
    this.inputEmail = this.inputEmail.bind(this);
    this.inputPassword = this.inputPassword.bind(this);
    this.inputName = this.inputName.bind(this);
    this.inputInstitute = this.inputInstitute.bind(this);
    this.inputNumber = this.inputNumber.bind(this);
  }
  
  componentDidMount() {
    let source = resolveAssetSource(image);
    const ratio = Math.min(maxWidth / source.width, maxHeight / source.height);
    this.setState({
      width: source.width*ratio,
      height: source.height*ratio
    })
  }

  login() {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if( !re.test(this.state.email) || this.state.password.length < 8 ) {
      alert('invalid email or password')
    } else {
      fetch(`${Constants.BASE_URL}${Constants.user_login}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password
        })
      }).then((response) => response.text())
      .then((responseJson) => {
        if( responseJson == 'ONE' ) {
          AsyncStorage.setItem('IsLogedIn',"true")
          this.props.navigation.navigate('SignedIn')
        } else {
          alert('server is not responding')
          // alert('server not responding')
        }
      })
    }
  }

  // validating user input and signup
  validateAndSignup() {
    if( this.state.password.length < 8 ) {
      alert('password is not valid')
    } else {
      fetch(`${Constants.BASE_URL}${Constants.user_registration}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
          number: this.state.number,
          name: this.state.name,
          institute: this.state.institute
        })
      }).then((response) => response.text())
      .then((responseJson) => {
        if( responseJson == 'ONE' ) {
          AsyncStorage.setItem('IsLogedIn',"true")
          this.props.navigation.navigate('SignedIn')
        } else {
          alert('server not responding')
        }
      })
    }
  }

  // signup screen animation
  gotoSignUp() {
    Animated.parallel([
      Animated.timing(this.animatedValue1, {
        toValue: -maxWidth,
        duration: 500
      }),
      Animated.timing(this.animatedValue2, {
        toValue: -maxWidth,
        duration: 500
      })
    ]).start()
    this.setState({
      signIn: false
    })
  }

  // signup further screen animation
  gotoNum() {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if( this.state.name.length < 3 || !re.test(this.state.email) ) {
      alert('fields are empty')
    } else {
      Animated.parallel([
        Animated.timing(this.animatedValue2, {
          toValue: -maxWidth * 2,
          duration: 500
        }),
        Animated.timing(this.animatedValue3, {
          toValue: -maxWidth * 2,
          duration: 500
        }),
      ]).start()
    }
  }

  // signup further screen animation
  gotoFinish() {
    if( this.state.institute.length < 2 || this.state.number.length < 10 ) {
      alert('fields are not valid')
    } else {
      Animated.parallel([
        Animated.timing(this.animatedValue3, {
          toValue: -maxWidth * 3,
          duration: 500
        }),
        Animated.timing(this.animatedValue4, {
          toValue: -maxWidth * 3,
          duration: 500
        }),
      ]).start()
    }
  }

  // return to sign in screen animation
  signInAnimate() {
    Animated.parallel([
      Animated.timing(this.animatedValue1, {
        toValue: 0,
        duration: 500
      }),
      Animated.timing(this.animatedValue2, {
        toValue: maxWidth,
        duration: 500
      }),
      Animated.timing(this.animatedValue3, {
        toValue: maxWidth,
        duration: 500
      }),
      Animated.timing(this.animatedValue4, {
        toValue: maxWidth,
        duration: 500
      })
    ]).start()
    this.setState({
      signIn: true
    })
  }

  inputEmail(email) {
    this.setState({
      email: email
    })
  }

  inputPassword(pass) {
    this.setState({
      password: pass
    })
  }

  inputName(name) {
    this.setState({
      name
    })
  }

  inputInstitute(ins) {
    this.setState({
      institute: ins
    })
  }

  inputNumber(num) {
    this.setState({
      number: num
    })
  }

  render() {
    const animateStyle1 = {
      transform: [ { translateX: this.animatedValue1 } ]
    }
    const animateStyle2 = {
      transform: [ { translateX: this.animatedValue2 } ]
    }
    const animateStyle3 = {
      transform: [ { translateX: this.animatedValue3 } ]
    }
    const animateStyle4 = {
      transform: [ { translateX: this.animatedValue4 } ]
    }

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
          <View style={{ flex: 1, flexDirection: 'row'}}>
            <Animated.View style={[styles.form, animateStyle1]}>
              <TextInput 
              placeholder="Email"
              placeholderTextColor="#ddd"
              keyboardType="email-address"
              onChangeText={this.inputEmail}
              style={styles.inputBox}/>
              <View style={{padding: 10}}></View>
              <TextInput 
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={this.inputPassword}
              placeholderTextColor="#ddd"
              style={styles.inputBox}/>
              <View style={{padding: 10}}></View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.loginButton}
                onPress={() => this.login()}>
                  <Text style={styles.loginText}>Log In</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            <Animated.View style={[styles.form, animateStyle2]}>
              <TextInput 
              placeholder="Full Name"
              placeholderTextColor="#ddd"
              onChangeText={this.inputName}
              style={styles.inputBox}/>
              <View style={{padding: 10}}></View>
              <TextInput 
              placeholder="Email"
              keyboardType="email-address"
              placeholderTextColor="#ddd"
              onChangeText={this.inputEmail}
              style={styles.inputBox}/>
              <View style={{padding: 10}}></View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.loginButton}
                onPress={this.gotoNum}>
                  <Text style={styles.loginText}>Next</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            <Animated.View style={[styles.form, animateStyle3]}>
              <TextInput 
              placeholder="Institute Name"
              placeholderTextColor="#ddd"
              onChangeText={this.inputInstitute}
              style={styles.inputBox}/>
              <View style={{padding: 10}}></View>
              <TextInput 
              placeholder="Number"
              keyboardType="phone-pad"
              placeholderTextColor="#ddd"
              onChangeText={this.inputNumber}
              style={styles.inputBox}/>
              <View style={{padding: 10}}></View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.loginButton}
                onPress={this.gotoFinish}>
                  <Text style={styles.loginText}>Next</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            <Animated.View style={[styles.form, animateStyle4]}>
              <TextInput 
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={this.inputPassword}
              placeholderTextColor="#ddd"
              style={styles.inputBox}/>
              <View style={{padding: 10}}></View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.loginButton}
                onPress={() => this.validateAndSignup()}>
                  <Text style={styles.loginText}>Finish</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
          {
            this.state.signIn ? 
            <TouchableOpacity style={styles.signupBotton}
            onPress={this.gotoSignUp}>
              <Text style={styles.signupText}>Don't have an account? <Text style={{fontWeight: 'bold'}}>Sign Up</Text></Text>
            </TouchableOpacity> :
            <TouchableOpacity style={styles.signupBotton}
            onPress={this.signInAnimate}>
              <Text style={styles.signupText}><Text style={{fontWeight: 'bold'}}>Sign In</Text></Text>
            </TouchableOpacity>
          }
        </LinearGradient >
      </ScrollView>
    )
  }
}

export default SignIn