import React, { Component } from 'react'
import { Text, View, AsyncStorage, ScrollView, StyleSheet, Dimensions, TextInput, TouchableOpacity  } from 'react-native'
const { width, height } = Dimensions.get('window');
import BackHeader from '../../header';
import Icon from 'react-native-vector-icons/Ionicons';
import { onSignIn } from "../../../../authentication/authentication";
import Loader from './../activity-indicator';

class EmployeeRegThree extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props)

        this.state = {
            isFocusedCompanyCode: false,
            isLoading: false,
            companyCode: ''
        }
    }
    

    componentWillMount = () => {
        console.log('props',this.props.navigation);
    }
    
    validateAndSignUp() {
        this.setState({
            isLoading: true
        })
        if( this.state.companyCode && this.state.companyCode != '' ) {
            let navigation = this.props.navigation;
            fetch('http://192.168.8.123/noticeboard/validate_company_and_emp_signup.php',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: navigation.getParam('fullName'),
                    email: navigation.getParam('email'),
                    designation: navigation.getParam('designation'),
                    password: navigation.getParam('password'),
                    number: navigation.getParam('number'),
                    companyCode: this.state.companyCode
                })
            }).then((response) => response.text() )
            .then((responseJson) => {
                if(responseJson && responseJson != ''){
                    this.setState({
                        isLoading: false
                    })
                    AsyncStorage.setItem('empID',responseJson.split(":")[0]);
                    AsyncStorage.setItem('emailOrId', navigation.getParam('email'));
                    AsyncStorage.setItem('EmployeeName', navigation.getParam('fullName'));
                    AsyncStorage.setItem('designation', navigation.getParam('designation'));
                    AsyncStorage.setItem('CompanyCode', this.state.companyCode);
                    AsyncStorage.setItem('CompanyID', responseJson.split(":")[1]);
                    AsyncStorage.setItem('CompanyName', responseJson.split(":")[2]);
                    onSignIn('employee').then(() => this.props.navigation.navigate('EmployeeSignedIn'));
                }
            }).catch((error) => {
                console.log('error',error);
                this.setState({
                    isLoading: false
                })
            })
        }
    }

    render() {
        // setting border color on field focus
        const borderCodeColor = {
            borderBottomColor: (this.state.isFocusedCompanyCode || this.state.companyCode != '') ? '#FFC107' : '#E0E0E0',
        }
        
        return (
            <View style={{flex: 1}}>
                <ScrollView style={styles.container} contentContainerStyle={{flexGrow:1}}>
                    <View>
                        <Loader loading={this.state.isLoading} />
                        <BackHeader onPress={() => this.props.navigation.goBack()} />
                        <View style={styles.headerStyle}>
                            <View style={{flex: 1}}>
                                <Text style={styles.register}>Register</Text>
                            </View>
                            <View>
                                <Text style={styles.stepOne}>3<Text style={styles.stepsOut}>/3</Text></Text>
                                <Text style={styles.stepText}>STEPS</Text>
                            </View>
                        </View>
                        <Text style={styles.details}>Before we get you registered we need few details</Text>
                    </View>
                    <View style={styles.secondSection}>
                        <TextInput
                            onChangeText={(event) => this.setState({ companyCode: event }) }
                            placeholder="Enter Company Code"
                            placeholderTextColor="#ddd"
                            style={[styles.inputFields, borderCodeColor]}
                            returnKeyType={"next"}
                            blurOnSubmit={false}
                            onFocus={() => this.setState({ isFocusedCompanyCode: true })}
                            onBlur={() => this.setState({ isFocusedCompanyCode: false }) } />
                        <View style={{ margin: 10 }}></View>
                    </View>
                    <View>
                        <View style={styles.next}>
                            <TouchableOpacity
                                style={styles.submit}
                                onPress={this.validateAndSignUp.bind(this)}>
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

export default EmployeeRegThree