//import liraries
import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// create a component
class BackHeader extends Component {
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={this.props.onPress}>
                    <Icon name="md-arrow-round-back" size={20} color="#ddd" />
                </TouchableOpacity>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        width: 20,
    },
});

//make this component available to the app
export default BackHeader;
