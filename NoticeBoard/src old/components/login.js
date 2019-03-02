import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Animated, Dimensions, Text, View, Image, TextInput, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import BackHeader from './header'
import { onSignIn } from "../../authentication/authentication";
import Loader from './Default/activity-indicator';
import Constants from "./../Utils/Constants";
const { width, height } = Dimensions.get('window');

var validatePass = '';
var validateEmail = '';

// login component form
export default class Login extends Component {
	static navigationOptions = { header: null };

	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			isLoading: false,
			error: false,
			isFocusedEmail: false,
			isFocusedPass: false,
		}
	}

	handleEmailChange(event) {
		this.setState({
			email: event
		})
		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (reg.test(event) === false) {
			validateEmail = <Text style={{ color: 'red' }}>Please enter valid email</Text>;
			return false;
		}
		else {
			validateEmail = <View></View>;
		}
	}

	handlePassChange(event) {
		this.setState({
			password: event
		})
		if (event != '' && event.length < 8) {
			validatePass = <Text style={{ color: 'red' }}>Password is not valid</Text>;
		} else {
			validatePass = <View></View>;
		}
	}

	componentWillMount() {
		this._animatedEmailIsFocused = new Animated.Value(this.state.email == '' ? 0 : 1);
		this._animatedPassIsFocused = new Animated.Value(this.state.password == '' ? 0 : 1);
	}

	componentDidUpdate(prevProps, prevState) {
		Animated.timing(this._animatedEmailIsFocused, {
			toValue: (this.state.isFocusedEmail || this.state.email != '') ? 1 : 0,
			duration: 200,
		}).start();
		Animated.timing(this._animatedPassIsFocused, {
			toValue: (this.state.isFocusedPass || this.state.password != '') ? 1 : 0,
			duration: 200,
		}).start();
	}

	// user login function to validate and login user
	async login() {
		let userType = await AsyncStorage.getItem('userType');
		let url = '';
		if( userType == 'employer' ) {
			url = `${Constants.BASE_URL}noticeboard/employer_login.php`;
		} else {
			url = `${Constants.BASE_URL}noticeboard/employee_login.php`;
		}
		const UserEmail = this.state.email;
		const UserPassword = this.state.password;
		if (UserEmail != '' && UserPassword != '') {
			this.setState({
				isLoading: true
			});
			fetch(url, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: UserEmail,
					password: UserPassword
				})
			}).then((response) => response.json())
				.then((responseJson) => {
					// If server response message same as Data Matched
					if (responseJson === 'Data Matched') {
						//Then open Profile activity and send user email to profile activity.
						console.log('if responseJson', responseJson, userType);
						this.setState({
							isLoading: false
						})
						onSignIn(userType).then(() => {
							if(userType == 'employee') {
								this.props.navigation.navigate("EmployeeLogin");
								AsyncStorage.setItem('emailOrId',UserEmail);
								AsyncStorage.setItem('isLogedIn',"true");
							} else {
								this.props.navigation.navigate("SignedIn");
								AsyncStorage.setItem('emailOrId',UserEmail);
								AsyncStorage.setItem('isLogedIn',"true");
							}
						});
					}
					else {
						alert(responseJson);
						this.setState({
							isLoading: false
						})
					}
				}).catch((error) => {
					this.setState({
						isLoading: false
					});
					console.error(error);
				});

		} else {
			alert('Email or password is incorrect');
		}
	}

	render() {

		const emailLabelStyle = {
			position: 'absolute',
			left: 0,
			top: this._animatedEmailIsFocused.interpolate({
				inputRange: [0, 1],
				outputRange: [40, 10]
			}),
			fontSize: this._animatedEmailIsFocused.interpolate({
				inputRange: [0, 1],
				outputRange: [14, 12]
			}),
			color: '#ddd'
		}

		const passLabelStyle = {
			position: 'absolute',
			left: 0,
			top: this._animatedPassIsFocused.interpolate({
				inputRange: [0, 1],
				outputRange: [129, 90]
			}),
			fontSize: this._animatedPassIsFocused.interpolate({
				inputRange: [0, 1],
				outputRange: [14, 12]
			}),
			color: '#ddd'
		}

		const borderEmailColor = {
			borderBottomColor: (this.state.isFocusedEmail || this.state.email != '') ? '#FFC107' : '#E0E0E0'
		}

		const borderPassColor = {
			borderBottomColor: (this.state.isFocusedPass || this.state.password != '') ? '#FFC107' : '#E0E0E0'
		}

		return (
			<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
				<Loader loading={this.state.isLoading} />
				<BackHeader onPress={() => this.props.navigation.goBack()} />
				<View style={styles.imageContainer}>
					<Image
						source={require('./../assets/noticeboard-logo.png')}
						resizeMode="contain"
						style={styles.logo} />
				</View>
				<View style={styles.form}>
					<View style={styles.input}>
						<Animated.Text style={emailLabelStyle}>
							EMAIL
			            </Animated.Text>
						<TextInput
							style={[styles.inputFields, borderEmailColor]}
							keyboardType="email-address"
							returnKeyType={"next"}
							onEndEditing={() => { this.secondTextInput.focus(); }}
							blurOnSubmit={false}
							onChangeText={this.handleEmailChange.bind(this)}
							onFocus={() => this.setState({ isFocusedEmail: true })}
							onBlur={() => this.setState({ isFocusedEmail: false })} />
						{
							validateEmail ? validateEmail : <View></View>
						}
						<View style={{ margin: 10 }}></View>
						<Animated.Text style={passLabelStyle}>
							PASSWORD
            			</Animated.Text>
						<TextInput
							style={[styles.inputFields, borderPassColor]}
							secureTextEntry={true}
							ref={(input) => { this.secondTextInput = input; }}
							returnKeyType={"next"}
							blurOnSubmit={false}
							onChangeText={this.handlePassChange.bind(this)}
							onFocus={() => this.setState({ isFocusedPass: true })}
							onBlur={() => this.setState({ isFocusedPass: false })} />
						{
							validatePass ? validatePass : <View></View>
						}
					</View>
					<View style={styles.buttonSection}>
						<TouchableOpacity
							style={styles.forgetPassword}>
							<Text style={styles.passwordText}>FORGOT PASSWORD?</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => this.login()}
							style={styles.login}>
							<Text style={styles.loginText}>SIGN IN</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => this.props.navigation.push('AccountType')}
							style={styles.signUp}>
							<Text style={styles.signupText}>CREATE AN ACCOUNT</Text>
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#1C1C26',
	},
	imageContainer: {
		marginTop: 50,
		alignItems: 'center',
	},
	logo: {
		width: '100%',
		height: 50,
	},
	welcome: {
		fontWeight: 'bold',
		fontSize: 32,
		color: '#ddd',
		textAlign: 'center',
	},
	para: {
		marginTop: '5%',
		color: '#ddd',
		fontSize: 18
	},
	form: {
		marginTop: 50,
	},
	input: {
		paddingTop: '7%',
	},
	inputFields: {
		color: '#ddd',
		fontSize: 20,
		color: '#FFC107',
		borderBottomWidth: 1,
		borderBottomColor: '#E0E0E0',
		marginBottom: 18
	},
	buttonSection: {
	},
	forgetPassword: {
		marginBottom: 18,
	},
	signUp: {
		marginTop: 8
	},
	signupText: {
		textAlign: 'center',
		alignSelf: 'center',
		color: '#ddd',
		fontSize: 14
	},
	passwordText: {
		alignSelf: 'center',
		color: '#838383',
		fontSize: 14
	},
	login: {
		marginTop: 70,
		alignSelf: 'center',
		height: 60,
		width: width,
		backgroundColor: '#337388',
		justifyContent: 'center',
	},
	loginText: {
		fontWeight: 'bold',
		textAlign: 'center',
		color: 'white',
		fontSize: 15
	},
});
