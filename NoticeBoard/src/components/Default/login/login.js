import React, { Component } from 'react';
import { TouchableOpacity, Dimensions, Text, View, Image, TextInput, ScrollView, AsyncStorage } from 'react-native';
import BackHeader from '../../header'
import { onSignIn } from "../../../../authentication/authentication";
import Loader from '../../../Utils/activity-indicator';
import Constants from "../../../Utils/Constants";
import styles from "../../../assets/styles/default/login-page-styles";
import Toast from 'react-native-easy-toast'

const { width, height } = Dimensions.get('window');
var validatePass = '';
var validateEmail = '';
var validateCode = '';

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
			isFocusedCode: false,
			companyCode: ''
		}
		this.login = this.login.bind(this);
	}

	handleEmailChange(event) {
		this.setState({
			email: event
		})
		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,15})+$/;
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

	handleCodeChange(event) {
		this.setState({
			companyCode: event
		})
		if (event != '' && event.length < 6) {
			validateCode = <Text style={{ color: 'red' }}>Company code is not valid</Text>;
		} else {
			validateCode = <View></View>;
		}
	}

	componentWillMount() {
		validateEmail = '';
		validatePass = '';
	}

	// user login function to validate and login user
	async login() {
		let userType = await AsyncStorage.getItem('userType');
		let url = '';
		if( userType == 'employer' ) {
			url = `${Constants.BASE_URL}employer_login.php`;
		} else {
			url = `${Constants.BASE_URL}employee_login.php`;
		}
		const UserEmail = this.state.email;
		const UserPassword = this.state.password;
		const CompanyCode = this.state.companyCode;
		if ( UserEmail != '' && UserPassword != '' && CompanyCode != '' ) {
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
					password: UserPassword,
					companycode: CompanyCode
				})
			}).then((response) => response.json())
			.then((responseJson) => {
				AsyncStorage.setItem('emailOrId',UserEmail);
				// If server response message same as Data Matched
				if (responseJson != 'ONE' && responseJson != 'TWO') {
					console.log('if not user found');
					//Then open Profile activity and send user email to profile activity.
					let data = responseJson.split(":");
					if( data && data.length > 0 ) {
						onSignIn(userType).then(() => {
							if(userType == 'employee' && UserEmail && UserEmail != 'undefined' ) {
								AsyncStorage.multiSet([
									['emailOrId', UserEmail],
									['CompanyID', data[0]],
									['OwnerName',data[1]],
									['OwnerDesignation', data[2]],
									['OwnerNumber', data[3]],
									['isLogedIn', "true"],
									['EmployeeID', data[4]]
								],(error) => {
									console.log('error',error)
								});
								this.setState({
									isLoading: false
								})
								this.props.navigation.navigate("EmployeeLogin");
							} else {
								AsyncStorage.multiSet([
									['emailOrId', UserEmail],
									['CompanyID', data[1]],
									['CompanyName', data[2]],
									['CompanyCode', data[3]],
									['OwnerName',data[4]],
									['OwnerDesignation', data[5]],
									['OwnerNumber', data[6]],
									['isLogedIn', "true"]
								],(error) => {
									console.log('error',error)
								});
								this.setState({
									isLoading: false
								})
								this.props.navigation.navigate("SignedIn");
							}
						});							
					}
				} else if( responseJson == 'TWO' ){
					console.log('else user found')
					if( userType == 'employer' ) {
						this.props.navigation.navigate('EmployerVerificationScreen');
					} else {
						this.props.navigation.navigate('EmployeeVerificationScreen');
					}
					//this.showError();
					this.setState({
						isLoading: false
					})
				} else {
					this.showError();
					this.setState({
						isLoading: false
					})
				}
			}).catch((error) => {
				this.refs.toast.show(
					<View style={{width: width-20}}>
						<Text style={{color: '#ddd', alignSelf: 'center'}}>Server Under Maintenance</Text>
					</View>, 2000, () => {
					// something you want to do at close
				});
				this.setState({
					isLoading: false
				});
			});
		} else {
			this.showError();
		}
	}

	showError() {
		this.refs.toast.show(
			<View style={{width: width-20,}}>
				<Text style={{color: '#ddd', alignSelf: 'center'}}>Credential are not valid</Text>
			</View>, 2000, () => {
			// something you want to do at close
		});
	}

	render() {

		const borderEmailColor = {
			borderBottomColor: (this.state.isFocusedEmail || this.state.email != '') ? '#FFC107' : '#E0E0E0'
		}

		const borderPassColor = {
			borderBottomColor: (this.state.isFocusedPass || this.state.password != '') ? '#FFC107' : '#E0E0E0'
		}

		const borderCodeColor = {
			borderBottomColor: (this.state.isFocusedCode || this.state.companyCode != '') ? '#FFC107' : '#E0E0E0'
		}

		return (
			<View style={{flex: 1}}>
				<ScrollView style={styles.maincontainer} behavior="padding" enabled>
					<Loader loading={this.state.isLoading} />
					<View style={styles.viewContainer}>
						<View style={styles.header}>
							<BackHeader onPress={() => this.props.navigation.goBack()} />
						</View>
						<View style={styles.imageContainer}>
							<Image
								source={require('./../../../assets/images/noticeboard-logo.png')}
								resizeMode="contain"
								style={styles.logo} />
						</View>
						<View style={styles.form}>
							<TextInput
								style={[styles.inputFields, borderEmailColor]}
								placeholder="Email"
								placeholderTextColor="#ddd"
								keyboardType="email-address"
								returnKeyType={"next"}
								blurOnSubmit={true}
								onChangeText={(event) => this.handleEmailChange(event)}
								onFocus={() => this.setState({ isFocusedEmail: true })}
								onBlur={() => this.setState({ isFocusedEmail: false })} />
							{
								validateEmail ? validateEmail : <View></View>
							}
							<View style={{ padding: 5 }}></View>
							<TextInput
								style={[styles.inputFields, borderPassColor]}
								placeholder="Password"
								placeholderTextColor="#ddd"
								secureTextEntry={true}
								returnKeyType={"done"}
								blurOnSubmit={true}
								onChangeText={this.handlePassChange.bind(this)}
								onFocus={() => this.setState({ isFocusedPass: true })}
								onBlur={() => this.setState({ isFocusedPass: false })} />
							{
								validatePass ? validatePass : <View></View>
							}
							<View style={{ padding: 5 }}></View>
							<TextInput
								style={[styles.inputFields, borderCodeColor]}
								placeholder="Company Code"
								placeholderTextColor="#ddd"
								returnKeyType={"done"}
								blurOnSubmit={true}
								onChangeText={this.handleCodeChange.bind(this)}
								onFocus={() => this.setState({ isFocusedCode: true })}
								onBlur={() => this.setState({ isFocusedCode: false })} />
							{
								validateCode ? validateCode : <View></View>
							}
							<TouchableOpacity
								style={styles.forgetPassword}>
								<Text style={styles.passwordText}>FORGOT PASSWORD?</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.buttonSection}>
						<TouchableOpacity
							onPress={this.login}
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
				</ScrollView>
				<Toast 
				ref="toast"
				positionValue='100%'
				style={{backgroundColor:'#ee5253'}}/>
			</View>
		);
	}
}
