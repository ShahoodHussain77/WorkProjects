//import liraries
import React, { Component } from 'react';
import { View, StyleSheet, Modal, ActivityIndicator } from 'react-native';

// create a component
class Loader extends Component {
    render() {
        return (
            <Modal style={styles.container}
                transparent={true}
                animationType={'none'}
                visible={this.props.loading}
                onRequestClose={() => { }}>
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator
                            animating={this.props.loading} 
                            color="#ee5253"
                            size="large" />
                    </View>
                </View>
            </Modal>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});

//make this component available to the app
export default Loader;
