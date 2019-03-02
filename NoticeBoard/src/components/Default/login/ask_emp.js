import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import BackHeader from '../../header'
import styles from "../../../assets/styles/default/login-user-type-styles";

class EmpType extends Component {
    static navigationOptions = { header: null };
    constructor(props) {
        super(props);
        this.redirectToEmployerSignUp = this.redirectToEmployerSignUp.bind(this);
        this.redirectToEmployeeSignUp = this.redirectToEmployeeSignUp.bind(this);
    }

    redirectToEmployerSignUp() {
        AsyncStorage.setItem('userType', "employer");
        this.props.navigation.push('SignIn');
    }
    
    redirectToEmployeeSignUp() {
        AsyncStorage.setItem('userType', "employee");
        this.props.navigation.push('SignIn');
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
                            <Image source={require('./../../../assets/images/boss.png')}
                                style={styles.image} />
                            <Text style={styles.text}>SENDER</Text>
                            <Text style={styles.para}>Signin as a sender for your organization's noticeboard account</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{padding: 10}}></View>
                    <TouchableOpacity style={styles.userType}
                    onPress={ this.redirectToEmployeeSignUp }>
                        <View style={styles.items}>
                            <Image source={require('./../../../assets/images/man.png')}
                                style={styles.image} />
                            <Text style={styles.text}>RECIPIENT</Text>
                            <Text style={styles.para}>Signin as an recipient of your organization's noticeboard account</Text>
                        </View>
                    </TouchableOpacity>
            	</View>
            </View>
        )
    }
}

export default EmpType