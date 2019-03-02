//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import BackHeader from '../../../header';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-easy-toast'
const { width, height } = Dimensions.get('window');

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
        nameCheck = false;
        companyCheck = false;
        designationCheck = false;
    }

    gotoNextStep() {
        if (designationCheck === true && companyCheck === true && designationCheck === true) {
            this.props.navigation.push('SignUpStepThree', {
                email: this.props.navigation.getParam('email'),
                password: this.props.navigation.getParam('password'),
                confirmPassword: this.props.navigation.getParam('confirmPassword'),
                fullName: this.state.fullName,
                company: this.state.company,
                designation: this.state.designation
            });
        } else {
            this.refs.toast.show(
                <View style={{paddingLeft: (width-200)/1.9, paddingRight: (width-200)/1.9}}>
                    <Text style={{color: '#ddd', width: '100%'}}>Please enter required fields</Text>
                </View>, 2000, () => {
                // something you want to do at close
            });
        }
    }

    validateDesignation(event) {
        this.setState({
            designation: event
        })
        if (event && event != '') {
            designationCheck = true;
        } else {
            this.setState({
                designation: ''
            })
            designationCheck = false;
        }
    }

    validateCompany() {
        this.setState({
            isFocusedCompany: false
        })
        if (this.state.company && this.state.company != '') {
            companyCheck = true;
        } else {
            companyCheck = false;
        }
    }

    validateName() {
        this.setState({
            isFocusedName: false
        })
        if (this.state.fullName && this.state.fullName != '') {
            nameCheck = true;
        } else {
            nameCheck = false;
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
                                <View style={styles.steps}>
                                    <Text style={styles.stepOne}>2
                                        <Text style={styles.stepsOut}>/3</Text>
                                    </Text>
                                    <Text style={styles.stepText}>STEPS</Text>
                                </View>
                            </View>
                            <Text style={styles.details}>Before we get you registered we need few details</Text>
                        </View>
                        <View style={{padding: 10}}></View>
                        <View style={styles.secondSection}>
                            <TextInput
                                placeholder="FULL NAME"
                                placeholderTextColor="#ddd"
                                onChangeText={(event) => this.setState({ fullName: event })}
                                style={[styles.inputFields, borderNameColor]}
                                returnKeyType={"next"}
                                blurOnSubmit={true}
                                onFocus={() => this.setState({ isFocusedName: true })}
                                onBlur={() => this.validateName()} />
                            <View style={{ margin: 10 }}></View>
                            <TextInput
                                placeholder="COMPANY"
                                placeholderTextColor="#ddd"
                                onChangeText={(event) => this.setState({ company: event })}
                                style={[styles.inputFields, borderCompanyColor]}
                                returnKeyType={"next"}
                                blurOnSubmit={true}
                                onFocus={() => this.setState({ isFocusedCompany: true })}
                                onBlur={() => this.validateCompany()} />
                            <View style={{ margin: 10 }}></View>
                            <TextInput
                                placeholder="DESIGNATION"
                                placeholderTextColor="#ddd"
                                onChangeText={(event) => this.validateDesignation(event)}
                                style={[styles.inputFields, borderDesignationColor]}
                                returnKeyType={"next"}
                                blurOnSubmit={true}
                                onFocus={() => this.setState({ isFocusedDesignation: true })}
                                onBlur={() => this.setState({ isFocusedDesignation: false })} />
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
    header: {
    	marginTop: 20,
    },
    mainContainer: {
        paddingLeft: 20,
        paddingRight: 20,
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
    }
});

//make this component available to the app
export default SignUpTwo;
