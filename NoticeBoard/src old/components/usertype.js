//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, AsyncStorage } from 'react-native';
import BackHeader from './header'
const { width, height } = Dimensions.get('window');

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
            <BackHeader onPress={ () => this.props.navigation.goBack()}/>
                <TouchableOpacity style={styles.employer}
                    onPress={ this.redirectToEmployerSignUp }>
                    <View style={styles.items}>
                        <Image source={require('./../assets/boss.png')}
                            style={styles.employerImage} />
                        <Text style={styles.text}>EMPLOYER</Text>
                        <Text style={styles.para}>Register as an employer and create your company or organization</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.employe}
                    onPress={ this.redirectToEmployeeSignUp }>
                    <View style={styles.items}>
                        <Image source={require('./../assets/man.png')}
                            style={styles.employerImage} />
                        <Text style={styles.text}>EMPLOYEE</Text>
                        <Text style={styles.para}>Register as an employee and become part of a company or organization</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1C1C26',
        justifyContent: 'center'
    },
    employer: {
        borderRadius: 10,
        margin: 30,
        backgroundColor: '#eee',
        shadowColor: '#fff',
        elevation: 70,
        zIndex: 70,
    },
    employe: {
        borderRadius: 10,
        margin: 30,
        elevation: 70,
        zIndex: 70,
        backgroundColor: '#eee',
    },
    items: {
    },
    employerImage: {
        alignSelf: 'center',
        margin: 10,
        width: width / 6,
        height: height / 7
    },
    text: {
        alignSelf: 'center',
        color: '#000',
        fontSize: 20
    },
    para: {
        margin: 20,
        textAlign: 'center',
        alignSelf: 'center'
    }
});

//make this component available to the app
export default AccountType;
