import { StyleSheet, Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
    Container: {
        flex: 1,
    },
    slide: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 10,
    },
    courseImage: {
        width: '100%',
        height: 240
    },
    text: {
        color: '#000',
        fontSize: 30,
        fontWeight: 'bold',
    },
    para: {
        fontSize: 15,
        fontWeight: '100',
        marginBottom: 40,
    },
    webView: {
        width: '100%',
        height: height,
        borderColor: 'red',
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 40,
    }
})
export default styles