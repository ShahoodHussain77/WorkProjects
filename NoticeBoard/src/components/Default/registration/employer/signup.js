//import liraries
import React, { Component } from 'react';
import { View, AsyncStorage, ScrollView, Dimensions, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import BackHeader from '../../../header'
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-easy-toast'
import Constants from "./../../../../Utils/Constants";
const { width, height } = Dimensions.get('window');

var emailCheck = false;
var passCheck = false;
var confPass = false;
var emailError = '';
var passwordError = '';
var confirmPassError = '';

// create a component
class SignUp extends Component {
    static navigationOptions = { header: null };

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmPass: '',
            emailValidate: false,
            isFocusedEmail: false,
            isFocusedPass: false,
            isFocusedConfirmPass: false,
        }
        emailError = '';
        passwordError = '';
        confirmPassError = '';
        emailCheck = false;
        passCheck = false;
        confPass = false;
        this.employerEmailVerification = this.employerEmailVerification.bind(this);
        this.employeeEmailVerification = this.employeeEmailVerification.bind(this);
        this.error = this.error.bind(this);
    }

    // validate email
    validateEmail(event) {
        this.setState({
            email: event
        });
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,15})+$/;
        if (reg.test(event) === false) {
            emailError = <Text style={styles.emailErrorText}>Please enter valid email address</Text>;
            return false;
        }
        else {
            this.setState({
                emailValidate: true
            })
            emailError = <View></View>;
            emailCheck = true;
        }
    }

    // validate password
    validatePassword(event) {
        this.setState({
            password: event
        })
        let pass = this.state.password;
        if (event != '' && event.length < 8) {
            passwordError = <Text style={styles.emailErrorText}>Password should be 8 characters long</Text>;
            if (pass.indexOf(' ') >= 0) {
                passwordError = <Text style={styles.emailErrorText}>Password should not have white space</Text>;
            }
        } else {
            passwordError = <View></View>;
            passCheck = true;
        }
    }

    // validate confirm password
    validateConfirmPass(event) {
        this.setState({
            confirmPass: event,
        })
        if (this.state.password === event) {
            confirmPassError = <View></View>;
            confPass = true;
        } else {
            confirmPassError = <Text style={styles.emailErrorText}>Password mismatch</Text>;
        }
    }

    // navigate to 2nd step for registration and validate current input
    async gotoNextStep() {
        let userType = await AsyncStorage.getItem('isEmployer');
        if( userType === 'true' ) {
            if (emailCheck === true && confPass === true && passCheck === true) {
                this.employerEmailVerification();
            } else {
                this.error('field');
            }
        } else if( userType === 'false' ) {
            if (emailCheck === true && confPass === true && passCheck === true) {
                this.employeeEmailVerification();
            } else {
                this.error('field');
            }
        }
    }

    // setting error toast
    error(type) {
        switch (type) {
            case 'field':
                this.refs.toast.show(
                    <View style={{paddingLeft: (width-200)/2, paddingRight: (width-200)/2}}>
                        <Text style={{color: '#ddd', width: '100%'}}>Please enter required fields</Text>
                    </View>, 2000);
            break;
            case 'registered':
                this.refs.toast.show(
                    <View style={{width: width-20,}}>
                        <Text style={{color: '#ddd', alignSelf: 'center'}}>EMAIL IS ALREADY REGISTERED</Text>
                    </View>, 2000);
            break;
            default:
                this.refs.toast.show(
                    <View style={{width: width-20,}}>
                        <Text style={{color: '#ddd', alignSelf: 'center'}}>Network request failed</Text>
                    </View>, 2000);
            break;
        }
    }

    employerEmailVerification() {
        let state = this.state;
        fetch(`${Constants.BASE_URL}employer_email_verification.php`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email
            })
        }).then((response) => response.text())
        .then((responseJson) => {
            if( responseJson == "ONE" ) {
                this.error('registered');
            } else {
                this.props.navigation.push('SignUpStepTwo', {
                    email: state.email,
                    password: state.password,
                    confirmPassword: state.confirmPass
                });
            }
        }).catch((error, statusCode) => {
            this.error('network');
        })
    }

    employeeEmailVerification() {
        let state = this.state;
        fetch(`${Constants.BASE_URL}employee_email_verification.php`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email
            })
        }).then((response) => response.text())
        .then((responseJson) => {
            if( responseJson == "ONE" ) {
                this.error('registered');
            } else {
                this.props.navigation.push('EmpSignUpStepTwo', {
                    email: state.email,
                    password: state.password,
                    confirmPassword: state.confirmPass
                });
            }
        }).catch((error, statusCode) => {
            this.error('network');
        })
    }

    render() {

        // setting border color on field focus
        const borderEmailColor = {
            borderBottomColor: (this.state.isFocusedEmail || this.state.email != '') ? '#FFC107' : '#E0E0E0',
        }

        const borderPassColor = {
            borderBottomColor: (this.state.isFocusedPass || this.state.password != '') ? '#FFC107' : '#E0E0E0'
        }

        const borderConfirmPassColor = {
            borderBottomColor: (this.state.isFocusedConfirmPass || this.state.confirmPass != '') ? '#FFC107' : '#E0E0E0'
        }

        return (
            <View style={{flex: 1}}>
                <ScrollView style={styles.container} contentContainerStyle={{flexGrow:1}}>
                    <View style={styles.mainContainer}>
                        <View style={styles.header}>
                            <BackHeader onPress={() => this.props.navigation.goBack()} />
                        </View>
                        <View>
                            <View style={styles.headerStyle}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.register}>Register</Text>
                                </View>
                                <View>
                                    <Text style={styles.stepOne}>1<Text style={styles.stepsOut}>/3</Text></Text>
                                    <Text style={styles.stepText}>STEPS</Text>
                                </View>
                            </View>
                            <Text style={styles.details}>Before we get you registered we need few details</Text>
                        </View>
                        <View style={{padding: 10}}></View>
                        <View style={styles.secondSection}>
                            <TextInput
                                onChangeText={(event) => this.validateEmail(event) }
                                placeholder="EMAIL"
                                placeholderTextColor="#ddd"
                                style={[styles.inputFields, borderEmailColor]}
                                keyboardType="email-address"
                                returnKeyType={"next"}
                                blurOnSubmit={true}
                                onFocus={() => this.setState({ isFocusedEmail: true })}
                                onBlur={() => this.setState({ isFocusedEmail: false }) } />
                            {
                                emailError ? emailError : <View></View>
                            }
                            <View style={{ margin: 10 }}></View>
                            <TextInput
                                placeholder="PASSWORD"
                                placeholderTextColor="#ddd"
                                onChangeText={(event) => this.validatePassword(event)}
                                style={[styles.inputFields, borderPassColor]}
                                secureTextEntry={true}
                                returnKeyType={"next"}
                                blurOnSubmit={true}
                                onFocus={() => this.setState({ isFocusedPass: true })}
                                onBlur={() => this.setState({ isFocusedPass: false })} />
                            {
                                passwordError ? passwordError : <View></View>
                            }
                            <View style={{ margin: 10 }}></View>
                            <TextInput
                                placeholder="CONFIRM PASSWORD"
                                placeholderTextColor="#ddd"
                                onChangeText={(event) => this.validateConfirmPass(event)}
                                style={[styles.inputFields, borderConfirmPassColor]}
                                secureTextEntry={true}
                                returnKeyType={"next"}
                                blurOnSubmit={true}
                                onFocus={() => this.setState({ isFocusedConfirmPass: true })}
                                onBlur={() => this.setState({ isFocusedConfirmPass: false })} />
                                {
                                    confirmPassError ? confirmPassError : <View></View>
                                }
                        </View>
                    </View>
                    <View style={styles.next}>
                        <TouchableOpacity
                            style={styles.submit}
                            onPress={this.gotoNextStep.bind(this)}>
                            <View style={styles.nextText}>
                                <Text style={styles.submitText}>NEXT</Text>
                                <Icon style={styles.arrrow} name="md-arrow-round-forward" size={20} color="#ddd" />
                            </View>
                        </TouchableOpacity>
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

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C26',//'#2c3e50',
    },
    mainContainer: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    header: {
    	marginTop: 20,
    },
    headerStyle: {
        marginTop: 10,
        flexDirection: 'row',
        marginBottom: 10,
    },
    register: {
        fontWeight: 'bold',
        fontSize: 28,
        color: '#ddd',
    },
    stepOne: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#ddd',
    },
    stepsOut: {
        color: '#ddd',
        fontWeight: '100',
        fontSize: 18,
    },
    stepText: {
        color: '#ddd'
    },
    details: {
        fontSize: 18,
        color: '#ddd',
    },
    // input section start
    secondSection: {
        flex: 1,
    },
    inputFields: {
        color: '#ddd',
        fontSize: 20,
        color: '#FFC107',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        marginBottom: 10
    },
    next: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    submit: {
        width: width,
        alignSelf: 'center',
        height: 60,
        backgroundColor: '#337388',
        justifyContent: 'center'
    },
    nextText: {
        alignContent: 'center',
    },
    arrrow: {
        position: 'absolute',
        alignSelf: 'flex-end',
        top: 5,
        right: 10,
    },
    submitText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 20,
        fontWeight: '900'
    },
    emailErrorText: {
        color: 'red'
    }
});

//make this component available to the app
export default SignUp;
