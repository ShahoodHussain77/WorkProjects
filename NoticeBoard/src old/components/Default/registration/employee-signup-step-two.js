import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TextInput, Dimensions, TouchableOpacity } from 'react-native';
const { width, height } = Dimensions.get('window');
import BackHeader from '../../header';
import Icon from 'react-native-vector-icons/Ionicons';

var NameCheck = false;
var DesignationCheck = false;
var NumberCheck = false;
var NameError = '';
var DesignationError = '';
var NumberError = '';

class EmployeeRegTwo extends Component {
    // setting navigation 
    static navigationOptions = { header: null }
 
    constructor(props) {
        super(props)

        this.state = {
            FullName: '',
            designation: '',
            number: '',
            isFocusedName: false,
            isFocusedDesignation: false,
            isFocusedNumber: false,
        }
    }

    // validate email
    validateName(event) {
        this.setState({
            FullName: event
        });
        if (this.state.FullName && this.state.FullName != '') {
            NameError = <View></View>;
            NameCheck = true;
        } else {
            NameError = <Text style={styles.emailErrorText}>Enter Valid Name</Text>;
            return false;
        }
    }

    // validate designation
    validateDesignation(event) {
        this.setState({
            designation: event
        })
        if (this.state.designation && this.state.designation != '') {
            DesignationError = <View></View>;
            DesignationCheck = true;
        } else {
            DesignationError = <Text style={styles.emailErrorText}>Enter Designation</Text>;
            DesignationCheck = false;
            return false;
        }
    }

    // validate Number
    validateNumber(event) {
        this.setState({
            number: event
        })
        if (this.state.number && this.state.number != '' && event.length == 11) {
            NumberCheck = true;
            NumberError = <View></View>;
        } else {
            NumberError = <Text style={{ color: 'red' }}>Please enter correct number</Text>;
        }
    }

    // navigate to 2nd step for registration and validate current input
    gotoNextStep() {
        let state = this.state;
        if (NameCheck === true && DesignationCheck === true && NumberCheck === true) {
            this.props.navigation.push('EmployeeRegThree', {
                email: this.props.navigation.getParam('email'),
                password: this.props.navigation.getParam('password'),
                fullName: state.FullName,
                designation: state.designation,
                number: state.number
            });
        } else {
        }
    }

    render() {
        
        // setting border color on field focus
        const borderNameColor = {
            borderBottomColor: (this.state.isFocusedName || this.state.FullName != '') ? '#FFC107' : '#E0E0E0',
        }

        const borderDesignationColor = {
            borderBottomColor: (this.state.isFocusedDesignation || this.state.designation != '') ? '#FFC107' : '#E0E0E0'
        }

        const borderNumberColor = {
            borderBottomColor: (this.state.isFocusedNumber || this.state.number != '') ? '#FFC107' : '#E0E0E0'
        }
        return (
            <View style={{flex: 1}}>
                <ScrollView style={styles.container} contentContainerStyle={{flexGrow:1}}>
                    <View>
                        <BackHeader onPress={() => this.props.navigation.goBack()} />
                        <View style={styles.headerStyle}>
                            <View style={{flex: 1}}>
                                <Text style={styles.register}>Register</Text>
                            </View>
                            <View>
                                <Text style={styles.stepOne}>2<Text style={styles.stepsOut}>/3</Text></Text>
                                <Text style={styles.stepText}>STEPS</Text>
                            </View>
                        </View>
                        <Text style={styles.details}>Before we get you registered we need few details</Text>
                    </View>
                    <View style={styles.secondSection}>
                        <TextInput
                            onChangeText={(event) => this.validateName(event) }
                            placeholder="NAME"
                            placeholderTextColor="#ddd"
                            style={[styles.inputFields, borderNameColor]}
                            returnKeyType={"next"}
                            blurOnSubmit={false}
                            onFocus={() => this.setState({ isFocusedName: true })}
                            onBlur={() => this.setState({ isFocusedName: false }) } />
                        {
                            NameError ? NameError : <View></View>
                        }
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
                        {
                            DesignationError ? DesignationError : <View></View>
                        }
                        <View style={{ margin: 10 }}></View>
                        <TextInput
                            placeholder="NUMBER"
                            placeholderTextColor="#ddd"
                            keyboardType="phone-pad"
                            onChangeText={(event) => this.validateNumber(event)}
                            style={[styles.inputFields, borderNumberColor]}
                            returnKeyType={"next"}
                            blurOnSubmit={false}
                            onFocus={() => this.setState({ isFocusedNumber: true })}
                            onBlur={() => this.setState({ isFocusedNumber: false })} />
                            {
                                NumberError ? NumberError : <View></View>
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
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#1C1C26'
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
})

export default EmployeeRegTwo
