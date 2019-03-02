//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Dimensions, Platform, TextInput, AsyncStorage } from 'react-native';
import BackHeader from './header';
const width = Dimensions.get('window').width;
//const height = Dimensions.get('window').height;
import Icon from 'react-native-vector-icons/Ionicons';
import { onSignIn } from "../../authentication/authentication";
import Loader from './Default/activity-indicator';
import Constants from "./../Utils/Constants";

var numberCheck = false;
var validateNumber = '';

// create a component
class SignUpThree extends Component {
    static navigationOptions = { header: null };

    constructor(props) {
        super(props);
        this.state = {
            number: '',
            isLoading: false,
            isFocusedNumber: false,
        }
    }

    setNumber(event) {
        this.setState({
            number: event
        })
        if (this.state.number && this.state.number != '' && event.length == 11) {
            numberCheck = true;
            validateNumber = <View></View>;
        } else {
            validateNumber = <Text style={{ color: 'red' }}>Please enter correct number</Text>;
        }
    }

    gotoNextStep() {
        if (numberCheck === true) {
            const navigation = this.props.navigation;
            this.setState({
                isLoading: true
            })
            // requesting api to register employer or owner
            fetch(`${Constants.BASE_URL}employer_registration.php`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: navigation.getParam('fullName'),
                    email: navigation.getParam('email'),
                    company: navigation.getParam('company'),
                    designation: navigation.getParam('designation'),
                    password: navigation.getParam('password'),
                    number: this.state.number,
                })
            }).then((response) => response.text())
                .then((responseJson) => {
                    let response = responseJson.split("|");
                    // saving info in local store keys
                    AsyncStorage.setItem('emailOrId', navigation.getParam('email'));
                    AsyncStorage.setItem('OwnerName', navigation.getParam('fullName'));
                    AsyncStorage.setItem('designation', navigation.getParam('designation'));
                    AsyncStorage.setItem('CompanyCode', response[0]);
                    AsyncStorage.setItem('CompanyID', response[1]);
                    AsyncStorage.setItem('OwnerID', response[2]);
                    
                    onSignIn('employer').then(() => this.props.navigation.navigate('SignedIn'));
                    this.setState({
                        isLoading: false
                    })
                }).catch((error) => {
                    console.error(error);
                    this.setState({
                        isLoading: false
                    })
                });
        } else {
            console.log('number is required');
        }
    }

    render() {

        const borderNumberColor = {
            borderBottomColor: (this.state.isFocusedNumber || this.state.number != '') ? '#FFC107' : '#E0E0E0',
            color: '#FFC107'
        }

        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled
                keyboardVerticalOffset={
                    Platform.select({
                        ios: () => 0,
                        android: () => 30
                    })
                }>
				<Loader loading={this.state.isLoading} />
                <BackHeader onPress={() => this.props.navigation.goBack()} />
                <View style={styles.headerStyle}>
                    <Text style={styles.register}>Register</Text>
                    <View style={styles.steps}>
                        <Text style={styles.stepOne}>3
                            <Text style={styles.stepsOut}>
                                /3
                            </Text>
                        </Text>
                        <Text style={styles.stepText}>STEPS</Text>
                    </View>
                </View>
                <Text style={styles.details}>Before we get you registered we need few details</Text>
                <View style={styles.secondSection}>
                    <TextInput
                        onChangeText={(event) => this.setNumber(event)}
                        style={[styles.inputFields, borderNumberColor]}
                        returnKeyType={"next"}
                        blurOnSubmit={false}
                        placeholder="Number"
                        placeholderTextColor="#ddd"
                        onFocus={() => this.setState({ isFocusedNumber: true })}
                        keyboardType="phone-pad"
                        onBlur={() => this.setState({ isFocusedNumber: false })} />
                    {
                        validateNumber ? validateNumber : <View></View>
                    }
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
            </KeyboardAvoidingView>
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
        flexDirection: 'row',
        marginBottom: '5%',
    },
    register: {
        flex: 1,
        alignSelf: 'flex-end',
        fontWeight: 'bold',
        fontSize: 28,
        color: '#ddd',
    },
    steps: {
        flex: 1,
    },
    stepOne: {
        alignSelf: 'flex-end',
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
        alignSelf: 'flex-end',
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
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        marginBottom: 10
    },
    next: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
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
    }
});

//make this component available to the app
export default SignUpThree;
