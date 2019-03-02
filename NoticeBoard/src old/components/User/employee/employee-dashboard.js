import React, { Component } from 'react'
import { Text, View, AsyncStorage, StyleSheet, TouchableOpacity } from 'react-native'

class EmployeeDashboard extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props)

        this.state = {
            companyname: ''
        }
    }
    

    async componentWillMount() {
        cmpName = await AsyncStorage.getItem('CompanyName');
        if( cmpName && cmpName != '' ) {
            this.setState({
                companyname: cmpName
            })
        }
    }

    gotoDeparts() {
        this.props.navigation.navigate('SelectDeparts');
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headingText}>
                    <Text style={{fontWeight: 'bold', color: '#ddd', fontSize: 24}}>CONGRATULATIONS!</Text>
                </View>
                <View style={styles.paraContainer}>
                    <Text style={styles.joinedLabel}>You have successfully joined</Text>
                    <Text style={styles.joinedLabel}>{this.state.companyname}</Text>
                    <Text style={styles.joinedLabel}>Noticeboard Network</Text>
                </View>
                <View style={styles.buttonContianer}>
                    <TouchableOpacity style={styles.button}
                        onPress={this.gotoDeparts.bind(this)}>
                        <Text style={{color: '#ddd'}}>CONTINUE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1c1c26',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -100
    },
    headingText: {
        marginTop: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paraContainer: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    joinedLabel: {
        fontSize: 20,
        color: '#ddd'
    },
    buttonContianer: {
        width: '100%',
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        height: 50,
        width: '60%',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default EmployeeDashboard