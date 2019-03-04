import { StyleSheet, Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
    Header: {
        height: 45,
        elevation: 4,
        alignItems: 'center',
        backgroundColor: '#612086',
        flexDirection: 'row',
    },
    backIcon: {
        paddingLeft: 20,
    },
    titleText: {
        marginLeft: 5,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ddd'
    }
})
export default styles