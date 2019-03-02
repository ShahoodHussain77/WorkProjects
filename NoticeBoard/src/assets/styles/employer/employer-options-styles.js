import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1c26',
    },
    optionsContainer: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    row: {
        height: 50,
        justifyContent: 'flex-end',
    },
    optionText: {
        marginBottom: 5,
        color: '#ddd',
        fontSize: 18,
    },
    seprator: {
        opacity: 0.5,
        borderWidth: 0.5,
        borderColor: '#ddd',
    }
})

export default styles