import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C26',
        paddingLeft: 20,
        paddingRight: 20,
    },
    header: {
        marginTop: 20//height < 600 ? 50 : 20,
    },
    typeStyles: {
        flex: 1,
        justifyContent: 'center',
    },
    userType: {
        borderRadius: 10,
        backgroundColor: '#eee',
        shadowColor: '#fff',
        elevation: 70,
        zIndex: 70,
    },
    items: {
    },
    image: {
        alignSelf: 'center',
        margin: 10,
        width: width / 6,
        height: height / 7
    },
    text: {
        alignSelf: 'center',
        color: '#000',
        fontSize: 20
    },
    para: {
        margin: 20,
        textAlign: 'center',
        alignSelf: 'center'
    }
});

export default styles;