import { StyleSheet, Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    headerImage: {
        resizeMode: 'cover',
        opacity: 0.8,
        justifyContent: 'center',
    },
    headerText: { 
        alignSelf: 'center', 
        marginTop: 20, 
        color: '#fff', 
        fontSize: 20,
        textAlign: 'center'
    },
    form: {
        // flex: 1,
        width: width,
        flexDirection: 'column',
        padding: 20,
    },
    inputBox: {
        backgroundColor: 'rgba(215,215,215,0.3)',
        padding: 15,
        color: '#ddd'
    },
    buttonContainer: {
        flex: 1,
    },
    loginButton: {
        borderColor: '#ddd',
        borderWidth: 0.7,
        padding: 20,
        alignItems: 'center',
    },
    loginText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    signupBotton: {
        backgroundColor: 'rgba(215,215,215,0.3)',
        paddingBottom: 20,
        paddingTop: 20,
        alignItems: 'center'
    },
    signupText: {
        color: '#ddd'
    }
})
export default styles