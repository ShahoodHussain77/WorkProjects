//import liraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import styles from "../../assets/styles/default/default-screen-styles";
import Statusbar from "./../statusbar";
import firebase from 'react-native-firebase';

// create a component
class DefaultScreen extends Component {
    static navigationOptions = { header: null };

    async componentDidMount() {
        this.checkPermission();
        this.createNotificationListeners();
    }

    componentWillUnmount() {
        this.notificationListener();
        this.notificationOpenedListener();
    }

    async createNotificationListeners() {
        /*
        * Triggered when a particular notification has been received in foreground
        * */
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            this.showAlert(title, body);
        });
      
        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        });
      
        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        }
        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
          //process data message
          console.log(JSON.stringify(message));
        });
    }

    showAlert(title, body) {
        Alert.alert(
          title, body,
          [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false },
        );
    }

    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken', value);
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                // user has a device token
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }
    }

    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
    }

    render() {
        return (
            <View style={{flex: 1,}}>
                <Statusbar />
                <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}} behavior="padding" enabled>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('./../../assets/images/noticeboard-logo.png')}
                            resizeMode="contain"
                            style={styles.logo} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.allButtons, styles.signIn]}
                            onPress={() => this.props.navigation.push('AskUser')}>
                            <Text style={[styles.buttonsText, styles.signinText]}>SIGN IN </Text>
                        </TouchableOpacity>
                        <View style={{padding: 10}}></View>
                        <TouchableOpacity
                            style={[styles.allButtons, styles.signUpAndGoogle]}
                            onPress={() => this.props.navigation.push('AccountType')}>
                            <Text style={[styles.buttonsText, styles.signupTextAndgoogleText]}>SIGN UP </Text>
                        </TouchableOpacity>
                        <View style={{padding: 10}}></View>
                        {/* <TouchableOpacity
                            style={[styles.allButtons, styles.signUpAndGoogle]}>
                            <Text style={[styles.buttonsText, styles.signupTextAndgoogleText]}>LOGIN WITH GOOGLE</Text>
                        </TouchableOpacity> */}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

//make this component available to the app
export default DefaultScreen;
