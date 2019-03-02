//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, AsyncStorage } from 'react-native';
import BackHeader from './../header'
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
        		<View style={styles.header}>
		            <BackHeader onPress={ () => this.props.navigation.goBack()}/>
                </View>
                <View style={styles.typeStyles}>
                    <TouchableOpacity style={styles.userType}
                        onPress={ this.redirectToEmployerSignUp }>
                        <View style={styles.items}>
                            <Image source={require('./../../assets/images/boss.png')}
                                style={styles.employerImage} />
                            <Text style={styles.text}>SENDER</Text>
                            <Text style={styles.para}>Register as a sender and create your organization's noticeboard account</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{padding: 10}}></View>
                    <TouchableOpacity style={styles.userType}
                        onPress={ this.redirectToEmployeeSignUp }>
                        <View style={styles.items}>
                            <Image source={require('./../../assets/images/man.png')}
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

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C26',
        paddingLeft: 20,
        paddingRight: 20,
    },
    header: {
        marginTop: 20
    },
    typeStyles: {
        flex: 1,
        justifyContent: 'center',
    },
    userType: {
        borderRadius: 10,
        backgroundColor: '#eee',
        shadowColor: '#fff',
        elevation: 70,
        zIndex: 70,
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
