//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Dimensions, Platform, TextInput } from 'react-native';
import BackHeader from './header'
const { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Ionicons';

// custom validation variables
var nameCheck = false;
var companyCheck = false;
var designationCheck = false;

// create a component
class SignUpTwo extends Component {
    static navigationOptions = { header: null };

    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            company: '',
            designation: '',
            isFocusedName: false,
            isFocusedCompany: false,
            isFocusedDesignation: false
        }
    }

    gotoNextStep() {
        let state = this.state;
        console.log('state', state);
        console.log('var', nameCheck, companyCheck, designationCheck);
        if (designationCheck === true && companyCheck === true && designationCheck === true) {
            this.props.navigation.push('SignUpStepThree', {
                email: this.props.navigation.getParam('email'),
                password: this.props.navigation.getParam('password'),
                confirmPassword: this.props.navigation.getParam('confirmPassword'),
                fullName: this.state.fullName,
                company: this.state.company,
                designation: this.state.designation
            });
        }
    }

    validateDesignation(event) {
        this.setState({
            designation: event
        })
        if (this.state.designation && this.state.designation != '') {
            console.log('state designation', this.state.designation);
            designationCheck = true;
        } else {
            console.log('error designation', this.state.designation);
        }
    }

    validateCompany() {
        this.setState({
            isFocusedCompany: false
        })
        if (this.state.company && this.state.company != '') {
            console.log('state comapny', this.state.company);
            companyCheck = true;
        } else {
            console.log('error comapny', this.state.company);
        }
    }

    validateName() {
        this.setState({
            isFocusedName: false
        })
        if (this.state.fullName && this.state.fullName != '') {
            console.log('state fullName', this.state.fullName);
            nameCheck = true;
        } else {
            console.log('error fullName', this.state.fullName);
        }
    }

    render() {

        const borderNameColor = {
            borderBottomColor: (this.state.isFocusedName || this.state.fullName != '') ? '#FFC107' : '#E0E0E0'
        }

        const borderCompanyColor = {
            borderBottomColor: (this.state.isFocusedCompany || this.state.company != '') ? '#FFC107' : '#E0E0E0'
        }

        const borderDesignationColor = {
            borderBottomColor: (this.state.isFocusedDesignation || this.state.designation != '') ? '#FFC107' : '#E0E0E0',
        }

        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled
                keyboardVerticalOffset={
                    Platform.select({
                        ios: () => 0,
                        android: () => 30
                    })
                }>
                <BackHeader onPress={() => this.props.navigation.goBack()} />
                <View style={styles.headerStyle}>
                    <Text style={styles.register}>Register</Text>
                    <View style={styles.steps}>
                        <Text style={styles.stepOne}>2
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
                        placeholder="FULL NAME"
                        placeholderTextColor="#ddd"
                        onChangeText={(event) => this.setState({ fullName: event })}
                        style={[styles.inputFields, borderNameColor]}
                        returnKeyType={"next"}
                        blurOnSubmit={false}
                        onFocus={() => this.setState({ isFocusedName: true })}
                        onBlur={() => this.validateName()} />
                    <View style={{ margin: 10 }}></View>
                    <TextInput
                        placeholder="COMPANY"
                        placeholderTextColor="#ddd"
                        onChangeText={(event) => this.setState({ company: event })}
                        style={[styles.inputFields, borderCompanyColor]}
                        returnKeyType={"next"}
                        blurOnSubmit={false}
                        onFocus={() => this.setState({ isFocusedCompany: true })}
                        onBlur={() => this.validateCompany()} />
                    <View style={{ margin: 10 }}></View>
                    <TextInput
                        placeholder="DESIGNATION"
                        placeholderTextColor="#ddd"
                        onChangeText={(event) => this.validateDesignation(event)}
                        style={[styles.inputFields, borderDesignationColor]}
                        returnKeyType={"next"}
                        blurOnSubmit={false}
                        onFocus={() => this.setState({ isFocusedDesignation: true })}
                        onBlur={() => this.setState({ isFocusedDesignation: false })} />
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
    }
});

//make this component available to the app
export default SignUpTwo;
