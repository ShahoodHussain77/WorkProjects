//import liraries
import React, { Component } from 'react';
import { View, AsyncStorage, ScrollView, Dimensions, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import BackHeader from './header'
const { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Ionicons';

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
            formValidation: false
        }
    }

    // validate email
    validateEmail(event) {
        this.setState({
            email: event
        });
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(this.state.email) === false) {
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
            let state = this.state;
            if (emailCheck === true && confPass === true && passCheck === true) {
                this.props.navigation.push('SignUpStepTwo', {
                    email: state.email,
                    password: state.password,
                    confirmPassword: state.confirmPass
                });
            } else {
            }
        } else if( userType === 'false' ) {
            let state = this.state;
            if (emailCheck === true && confPass === true && passCheck === true) {
                this.props.navigation.push('EmpSignUpStepTwo', {
                    email: state.email,
                    password: state.password,
                    confirmPassword: state.confirmPass
                });
            } else {
            }
        }
    }

    render() {

        // setting border color on field focus
        const borderEmailColor = {
            borderBottomColor: (this.state.isFocusedEmail || this.state.email != '') ? '#FFC107' : '#E0E0E0',
            //            borderBottomColor: ( this.state.emailValidate === true || this.state.isFocusedEmail || this.state.email != '' ) ? '#FFC107' : 'red'
        }

        const borderPassColor = {
            borderBottomColor: (this.state.isFocusedPass || this.state.password != '') ? '#FFC107' : '#E0E0E0'
        }

        const borderConfirmPassColor = {
            borderBottomColor: (this.state.isFocusedConfirmPass || this.state.confirmPass != '') ? '#FFC107' : '#E0E0E0'
        }

        return (
            <View style={{flex: 1}}>
                <ScrollView style={styles.container}  contentContainerStyle={{flexGrow:1}}>
                    <View>
                        <BackHeader onPress={() => this.props.navigation.goBack()} />
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
                    <View style={styles.secondSection}>
                        <TextInput
                            onChangeText={(event) => this.validateEmail(event) }
                            placeholder="EMAIL"
                            placeholderTextColor="#ddd"
                            style={[styles.inputFields, borderEmailColor]}
                            keyboardType="email-address"
                            returnKeyType={"next"}
                            blurOnSubmit={false}
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
                            blurOnSubmit={false}
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
                            blurOnSubmit={false}
                            onFocus={() => this.setState({ isFocusedConfirmPass: true })}
                            onBlur={() => this.setState({ isFocusedConfirmPass: false })} />
                            {
                                confirmPassError ? confirmPassError : <View></View>
                            }
                    </View>
                    <View>
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
                    </View>
                </ScrollView>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1C1C26',//'#2c3e50',
    },
    headerStyle: {
        marginTop: 10,
        flexDirection: 'row',
        marginBottom: '5%',
    },
    register: {
        fontWeight: 'bold',
        fontSize: 28,
        color: '#ddd',
    },
    steps: {
        flex: 1,
    },
    stepOne: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#ddd',
    },
    stepsOut: {
        marginTop: 5,
        color: '#ddd',
        fontWeight: '100',
        fontSize: 20,
    },
    stepText: {
        color: '#ddd'
    },
    details: {
        fontSize: 18,
        color: '#ddd',
        marginBottom: '7%',
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

SignUp.propTypes = {
    account_types: PropTypes.bool,
    number: PropTypes.number,
    email: PropTypes.string
};

//make this component available to the app
export default SignUp;
