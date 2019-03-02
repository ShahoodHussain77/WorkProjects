import React, { Component } from 'react'
import { Text, View, TouchableOpacity, AsyncStorage } from 'react-native'
import { onSignOut } from "../../../../authentication/authentication";
import styles from "./../../../assets/styles/employer/employer-options-styles";

export class Options extends Component {

    constructor(props) {
        super(props)

        this.state = {
            code: '',
            number: '',
            name: '',
            designation: ''
        }
    }

    async componentDidMount() {
        this.setState({
            code: await AsyncStorage.getItem('CompanyCode'),
            name: await AsyncStorage.getItem('OwnerName'),
            number: await AsyncStorage.getItem('OwnerNumber'),
            designation: await AsyncStorage.getItem('OwnerDesignation'),
        })
    };

    showMyCode() {
        alert(`Company joining code is: ${this.state.code}`);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.optionsContainer}>
                    <TouchableOpacity style={styles.row}>
                        <Text style={styles.optionText}>Name: <Text style={{fontWeight: 'bold', color: '#fff'}}>{this.state.name}</Text></Text>
                    </TouchableOpacity>
                    <View style={styles.seprator}></View>
                    <TouchableOpacity style={styles.row}>
                        <Text style={styles.optionText}>Designation: <Text style={{fontWeight: 'bold', color: '#fff'}}>{this.state.designation}</Text></Text>
                    </TouchableOpacity>
                    <View style={styles.seprator}></View>
                    <TouchableOpacity style={styles.row}
                    onPress={() => this.showMyCode()}>
                        <Text style={styles.optionText}>Organization Code: <Text style={{fontWeight: 'bold', color: '#fff'}}>{this.state.code}</Text></Text>
                    </TouchableOpacity>
                    <View style={styles.seprator}></View>
                    <TouchableOpacity style={styles.row}>
                        <Text style={styles.optionText}>Contact Number: <Text style={{fontWeight: 'bold', color: '#fff'}}>{this.state.number}</Text></Text>
                    </TouchableOpacity>
                    <View style={styles.seprator}></View>
                    <TouchableOpacity style={styles.row}
                    onPress={() => onSignOut().then(() => this.props.navigation.navigate("SignedOut"))}>
                        <Text style={styles.optionText}>Logout</Text>
                    </TouchableOpacity>
                    <View style={styles.seprator}></View>
                </View>
            </View>
        )
    }
}

export default Options