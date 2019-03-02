import React, { Component } from 'react'
import { Text, View, TouchableOpacity, AsyncStorage } from 'react-native'
import { onSignOut } from "../../../../authentication/authentication";
import styles from "./../../../assets/styles/employee/employee-options-styles";

export class EmpOptions extends Component {

    constructor(props) {
        super(props)

        this.state = {
            number: '',
            name: '',
            designation: ''
        }
    }

    async componentDidMount() {
        this.setState({
            name: await AsyncStorage.getItem('OwnerName'),
            number: await AsyncStorage.getItem('OwnerNumber'),
            designation: await AsyncStorage.getItem('OwnerDesignation'),
        })
    };

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
                    <TouchableOpacity style={styles.row}>
                        <Text style={styles.optionText}>Contact Number: <Text style={{fontWeight: 'bold', color: '#fff'}}>{this.state.number}</Text></Text>
                    </TouchableOpacity>
                    <View style={styles.seprator}></View>
                    <TouchableOpacity style={styles.row}
                    onPress={() => onSignOut().then(() => this.props.navigation.navigate("SignedOut"))}>
                        <Text style={styles.optionText}>LOGOUT</Text>
                    </TouchableOpacity>
                    <View style={styles.seprator}></View>
                </View>
            </View>
        )
    }
}

export default EmpOptions