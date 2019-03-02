import React, { Component } from 'react'
import { Text, View, TouchableOpacity, TextInput, Dimensions, AsyncStorage, StyleSheet } from 'react-native'
import Constants from "./../../../../Utils/Constants";
import Toast from 'react-native-easy-toast'
import Loader from '../../../../Utils/activity-indicator';
import BackHeader from './../../../header'
const { width, height } = Dimensions.get('window');

export class EmployerVerification extends Component {

    constructor(props) {
        super(props)

        this.state = {
            verificationCode: '',
            verified: false,
            showButton: true,
            isLoading: false,
            isFocusedCode: false
        }
    }

    async verifyUser() {
        let email = await AsyncStorage.getItem('emailOrId');
        this.setState({
            isLoading: true
        })
        fetch(`${Constants.BASE_URL}check_employer_verification_code.php`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: this.state.verificationCode,
                email: email
            })
        }).then((response) => response._bodyText)
        .then((responseJson) => {
            let response = responseJson;
            if( response == "code matched" ) {
                this.setState({
                    verified: true,
                    showButton: false,
                    isLoading: false
                })
            } else {
                this.refs.toast.show(
                    <View style={{width: width-20,}}>
                        <Text style={{color: '#ddd', alignSelf: 'center'}}>Code is not valid</Text>
                    </View>, 2000, () => {
                    // something you want to do at close
                });
                this.setState({
                    isLoading: false
                })
            }
        }).catch((error) => {
            console.log('err',error);
            this.refs.toast.show(
                <View style={{width: width-20,}}>
                    <Text style={{color: '#ddd', alignSelf: 'center'}}>Network request failed</Text>
                </View>, 2000, () => {
                // something you want to do at close
            });
            this.setState({
                isLoading: false
            })
        })
    }

    render() {
        const borderCodeColor = {
			borderBottomColor: (this.state.isFocusedCode || this.state.verificationCode != '') ? '#FFC107' : '#E0E0E0'
		}

        let verifiedUser = <View style={styles.codematchtext}>
            <Text style={[styles.text, {textAlign: 'center'}]}>Your account has been successfully verified, Thank you!</Text>
            <View style={{padding: 10}}>
                <TouchableOpacity
                onPress={() => this.props.navigation.navigate('SignedOut')}
                style={styles.button}>
                    <Text style={[styles.text, {color: '#000'}]}>CONTINUE</Text>
                </TouchableOpacity>
            </View>
        </View>
        return (
            <View style={styles.MainContainer}>
                <Loader loading={this.state.isLoading} />
                <View style={styles.container}>
                    <View style={styles.goback}>
                        <BackHeader onPress={() => this.props.navigation.navigate('SignedOut')} />
                    </View>
                    <Text style={[styles.text, styles.headingText]}>A verification code has been sent to your Email address. Please type-in the verification code below</Text>
                    <View style={{padding: 10}}>
                        <TextInput 
                        placeholder="5-DIGIT PIN"
                        placeholderTextColor="#ddd"
                        onChangeText={(event) => this.setState({verificationCode: event})}
                        returnKeyType={"done"}
                        blurOnSubmit={true} 
                        style={[styles.inputcode, {fontSize: 18}, borderCodeColor]}
                        onFocus={() => this.setState({ isFocusedCode: true})}
                        onBlur={() => this.setState({isFocusedCode: false})}/>
                        {
                            this.state.showButton ? <TouchableOpacity
                            onPress={() => this.verifyUser()}
                            style={styles.button}>
                                <Text style={[styles.text, {color: '#000'}]}>VERIFY ACCOUNT!</Text>
                            </TouchableOpacity> : <View></View>
                        }
                    </View>
                    {
                        this.state.verified ? verifiedUser : <View></View>
                    }
                </View>
                <Toast 
				ref="toast"
				positionValue='100%'
				style={{backgroundColor:'#ee5253'}}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: '#1c1c26'
    },
    container: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    goback: {
        paddingTop: 20
    },
    text: {
        color: '#ddd',
        fontSize: 20,
    },
    headingText: {
        textAlign: 'center',
        marginTop: 30,
    },
    inputcode: {
        color: '#FFC107',
        marginTop: 30,
        borderBottomWidth: 1,
		borderBottomColor: '#E0E0E0',
		marginBottom: 5
    },
    button: {
        padding: 15,
        marginTop: 30,
        alignItems: 'center',
        backgroundColor: '#ddd',
        borderRadius: 50,
    },
    codematchtext: {
        marginTop: 20,
    }
})

export default EmployerVerification
