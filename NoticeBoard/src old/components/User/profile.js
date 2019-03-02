//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { onSignOut } from "../../../authentication/authentication";

// create a component
class Profile extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Profile</Text>
                <Button title="signout" onPress={() => onSignOut().then(() => this.props.navigation.navigate("SignedOut"))}/>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1c1c26',
    },
});

//make this component available to the app
export default Profile;
