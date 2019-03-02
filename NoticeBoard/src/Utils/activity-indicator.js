//import liraries
import React, { Component } from 'react';
import { View, Modal, ActivityIndicator } from 'react-native';
import styles from "./../assets/styles/utils-style/activity-indicator-styles";
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
//make this component available to the app
export default Loader;