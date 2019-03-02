import { StyleSheet, Dimensions } from 'react-native';
//const { width, height } = Dimensions.get('window');

// define your styles
const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1,
        backgroundColor: '#1C1C26',
    },
    buttonContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    allButtons: {
        width: '100%',
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonsText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    signIn: {
        backgroundColor: '#ddd'
    },
    signinText: {
        color: '#000'
    },
    signUpAndGoogle: {
        borderWidth: 1,
        borderColor: '#fff'
    },
    signupTextAndgoogleText: {
        color: '#fff'
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        marginTop: 50,
        width: '100%',
        height: 55,
    }
});
export default styles;