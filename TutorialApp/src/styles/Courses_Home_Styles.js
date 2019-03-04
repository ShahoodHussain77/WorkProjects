import { StyleSheet, Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
    headerContainer: {
        flex: 1,
    },
    headerImage: {
        resizeMode: 'cover',
    },
    courseContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 5,
        marginTop: 5,
        elevation: 4
    },
    courseImage: {
        height: 200,
        width: '100%',
        justifyContent: 'flex-end'
    },
    courseOverView: {
        padding: 8,
        backgroundColor: '#00000088',
    }
})
export default styles