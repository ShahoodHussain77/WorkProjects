//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

// create a component
class DefaultScreen extends Component {
    static navigationOptions = { header: null };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('./../../assets/noticeboard-logo.png')}
                        resizeMode="contain"
                        style={styles.logo} />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => this.props.navigation.push('AskUser')}>
                        <Text style={styles.signinText}>SIGN IN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.signUp}
                        onPress={() => this.props.navigation.push('AccountType')}>
                        <Text style={styles.signupText}>SIGN UP</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.loginGoogle}>
                        <Text style={styles.googleText}>LOGIN WITH GOOGLE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#1C1C26'
    },
    buttonContainer: {
        flex: 1,
        marginTop: 150,
        justifyContent: 'center'
    },
    signIn: {
        alignSelf: 'center',
        marginBottom: '10%',
        width: '80%',
        height: '18%',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ddd'
    },
    signUp: {
        width: '80%',
        alignSelf: 'center',
        marginBottom: '10%',
        borderRadius: 50,
        height: '18%',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#fff'
    },
    signinText: {
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000'
    },
    signupText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff'
    },
    imageContainer: {
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: '100%',
        height: 53,
    },
    welcome: {
        fontSize: 26,
        color: '#2196F3',
        textAlign: 'center',
        margin: 10,
    },
    loginGoogle: {
        alignSelf: 'center',
        height: '18%',
        width: '80%',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
    },
    googleText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ddd'
    },
    tagLine: {
        marginTop: 40,
        textAlign: 'center',
        alignSelf: 'center',
        color: '#ddd'
    }
});

//make this component available to the app
export default DefaultScreen;
