import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TextInput, Dimensions, TouchableOpacity } from 'react-native';
const { width, height } = Dimensions.get('window');
import BackHeader from '../../../header';
import Toast from 'react-native-easy-toast'
import Icon from 'react-native-vector-icons/Ionicons';

var NameCheck = false;
var DesignationCheck = false;
var NumberCheck = false;
var NameError = '';
var DesignationError = '';
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
            companyCode: ''
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

    // navigate to 2nd step for registration and validate current input
    gotoNextStep() {
        let state = this.state;
        if (NameCheck === true && DesignationCheck === true && this.state.companyCode != '' ) {
            this.props.navigation.push('EmployeeRegThree', {
                email: this.props.navigation.getParam('email'),
                password: this.props.navigation.getParam('password'),
                fullName: state.FullName,
                designation: state.designation,
                companyCode: state.companyCode
            });
        } else {
            this.refs.toast.show(
                <View style={{paddingLeft: (width-200)/1.6, paddingRight: (width-200)/1.6}}>
                    <Text style={{color: '#ddd', width: '100%'}}>Input required fields</Text>
                </View>, 2000, () => {
                // something you want to do at close
            });
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
        // setting border color on field focus
        const borderCodeColor = {
            borderBottomColor: (this.state.isFocusedCompanyCode || this.state.companyCode != '') ? '#FFC107' : '#E0E0E0',
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
                                    <Text style={styles.stepOne}>2<Text style={styles.stepsOut}>/3</Text></Text>
                                    <Text style={styles.stepText}>STEPS</Text>
                                </View>
                            </View>
                            <Text style={styles.details}>Before we get you registered we need few details</Text>
                        </View>
                        <View style={{padding: 10}}></View>
                        <View style={styles.secondSection}>
                            <TextInput
                                onChangeText={(event) => this.validateName(event) }
                                placeholder="NAME"
                                placeholderTextColor="#ddd"
                                style={[styles.inputFields, borderNameColor]}
                                returnKeyType={"next"}
                                blurOnSubmit={true}
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
                                blurOnSubmit={true}
                                onFocus={() => this.setState({ isFocusedDesignation: true })}
                                onBlur={() => this.setState({ isFocusedDesignation: false })} />
                            {
                                DesignationError ? DesignationError : <View></View>
                            }
                            <View style={{ margin: 10 }}></View>
                            <TextInput
                                onChangeText={(event) => this.setState({ companyCode: event }) }
                                placeholder="Enter Company Code"
                                placeholderTextColor="#ddd"
                                style={[styles.inputFields, borderCodeColor]}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onFocus={() => this.setState({ isFocusedCompanyCode: true })}
                                onBlur={() => this.setState({ isFocusedCompanyCode: false }) } />
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
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C26'
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
    },
    emailErrorText: {
        color: 'red'
    }
})

export default EmployeeRegTwo
