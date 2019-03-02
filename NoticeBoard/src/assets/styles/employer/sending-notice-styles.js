import { Dimensions, StyleSheet } from 'react-native'
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    contianer: {
        paddingTop: 5,
        backgroundColor: '#1c1c26',
        flex: 1,
    },
    innerContainer: {
        flex: 1,
    },
    cardView: {
        backgroundColor: '#ddd',
        borderWidth: 1,
        padding: 15,
        borderRadius: 10,
        marginRight: 10,
        marginLeft: 10,
        elevation: 4,
        marginBottom: 8,
    },
    senderName: {
        color: '#cb2326',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5
    },
    cardText: {
        fontSize: 16
    },
    closeButton: {
        color: '#ddd',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 3,
        textAlign: 'center',
        padding: 8,
        margin: 10,
        alignSelf: 'flex-end',
    },
    inputNotice: {
        flexDirection: 'row',
        backgroundColor: '#ddd'
    },
    noticeText: {
        flex: 1,
        borderColor: '#ddd',
        borderWidth: 1,
        fontSize: 16
    },
    sendButton: {
        padding: 10,
        justifyContent: 'center'
    },
    add: {
        padding: 10,
        justifyContent: 'center'
    },
    settingContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    closeDialog: {
        padding: 7,
        backgroundColor: '#ddd',
    },
    modalContainer: {
        backgroundColor: '#ddd',
        flexDirection: 'row',
        width: width,
        height: '20%'
    },
    imagesBox: {
        flexDirection: 'row',
    },
    modalImageStyle: {
        width: 100,
        height: 100,
    },
    ImageStyle: {
        width: "100%",
        height: width - 50,
//        resizeMode: 'cover'
    },
    attachmentBoxes: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textWithImage: {
        margin: 10,
        alignSelf: 'flex-start'
    },
    modalContainerImage: {
        backgroundColor: 'rgba(0,0,0,1)',
        flex: 1
    },
    modalImageStyle: {
        height: '100%',
        width: '100%',
    },
    modalHeaderButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalButtons: {
        margin: 15,
    },
    buttonIcons: {
        width: 20,
        height: 20,
        opacity: 0.9
    },
    modalImageText: {
        width: '100%',
        position: 'absolute',
        bottom: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    imageText: {
        alignSelf: 'center',
        color: '#fff',
        padding: 10,
    },
    inputViewModal: {
        margin:10,
    },
    showImageModalHeader: {
        flex: 1,
        flexDirection: 'row',
    }
})
export default styles