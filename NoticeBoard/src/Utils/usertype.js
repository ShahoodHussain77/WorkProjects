//import liraries
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import BackHeader from '../components/header'
import styles from "./../assets/styles/utils-style/user-type-styles";

// create a component
class AccountType extends Component {
    static navigationOptions = { header: null };
    constructor(props) {
        super(props);
        this.redirectToEmployerSignUp = this.redirectToEmployerSignUp.bind(this);
        this.redirectToEmployeeSignUp = this.redirectToEmployeeSignUp.bind(this);
    }

    redirectToEmployerSignUp() {
        AsyncStorage.setItem('isEmployer', "true");
        this.props.navigation.push('SignUpStepOne');
    }
    
    redirectToEmployeeSignUp() {
        AsyncStorage.setItem('isEmployer', "false");
        this.props.navigation.push('SignUpStepOne');
    }

    render() {
        return (
            <View style={styles.container}>
        		<View style={styles.header}>
		            <BackHeader onPress={ () => this.props.navigation.goBack()}/>
                </View>
                <View style={styles.typeStyles}>
                    <TouchableOpacity style={styles.userType}
                        onPress={ this.redirectToEmployerSignUp }>
                        <View style={styles.items}>
                            <Image source={require('./../assets/images/boss.png')}
                                style={styles.employerImage} />
                            <Text style={styles.text}>SENDER</Text>
                            <Text style={styles.para}>Register as a sender and create your organization's noticeboard account</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{padding: 10}}></View>
                    <TouchableOpacity style={styles.userType}
                        onPress={ this.redirectToEmployeeSignUp }>
                        <View style={styles.items}>
                            <Image source={require('./../assets/images/man.png')}
                                style={styles.employerImage} />
                            <Text style={styles.text}>RECIPIENT</Text>
                            <Text style={styles.para}>Register as an recipient and become part of your organization's noticeboard</Text>
                        </View>
                    </TouchableOpacity>
        		</View>
            </View>
        );
    }
}
//make this component available to the app
export default AccountType;