import React, { Component } from 'react'
import { Text, Dimensions, View, Modal, Image, TouchableOpacity, ScrollView, TextInput, StyleSheet, AsyncStorage } from 'react-native'
const { width, height } = Dimensions.get('window');
import PushNotification from 'react-native-push-notification';
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from "./../../../Utils/Constants";
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';

class Notice extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'NoticeBoard',
            headerTitleStyle: { flex: 1, color: 'white', textAlign: 'center',alignSelf:'center'},
            headerStyle: {
                backgroundColor: '#303952',
                elevation: 7,
            },
            headerLeft: (
                <View style={{ justifyContent: 'center', paddingLeft: 10}}>
                    <TouchableOpacity onPress={() => navigation.navigate('SignedIn')}>
                        <Icon name="md-arrow-round-back" size={20} color="#ddd" />
                    </TouchableOpacity>
                </View>
            ),  
            headerRight: (
                <View style={{ }}>
                </View>
            ),
        }
    }

    constructor(props) {
        super(props)
    
        this.state = {
            message: '',
            allMessages: [],
            showAttachmentModal: false,
            imagePath: '',
            allImages: [],
            videoPath: ''
        }
        this.sendnotification = this.sendnotification.bind(this);
    }

    async componentWillMount() {
        PushNotification.configure({
            onNotification: function(notification) {
                console.log('NOTIFICATION: ', notification);
            },
            popInitialNotification: true,
        });
        let company_id = await AsyncStorage.getItem('CompanyID');
        fetch(`${Constants.BASE_URL}get_all_notices.php`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                companyID: company_id,
            })
        }).then(( response ) => response.text())
        .then(( responseJson ) => {
            console.log('responseJson',responseJson);
        })
    }

    async sendnotification() {
        let company_id = await AsyncStorage.getItem('CompanyID');
        let group_id = await AsyncStorage.getItem('GroupID');
        let imagesQty = this.state.allImages.length;
        if( imagesQty && imagesQty > 0 ) {
            this.state.allImages.map((data,key) => {
                console.log('allimages',data);
                if( data && data.path && data.path != '' ) {
                    const uriPart = data.path.split('.');
                    const fileExtension = uriPart[uriPart.length - 1];
                    if( fileExtension && fileExtension != 'exe' ) {
                        if( key === ( imagesQty -1 ) ) {
                            RNFetchBlob.fetch('POST', `${Constants.BASE_URL}noticeboard/send_broadcast_message.php`, {
                                Authorization : "Bearer access-token",
                                'Content-Type' : 'multipart/form-data',
                            }, [
                                // element with property `filename` will be transformed into `file` in form data
                                { name : 'image', filename : 'image.png', type:'image/png', data:  RNFetchBlob.wrap(data.path)},
                                // elements without property `filename` will be sent as plain text
                                { name: 'imagesQty', data: imagesQty.toString()},
                                { name: 'companyID', data: company_id.toString()},
                                { name: 'imageURL', data: data.path.toString()},
                                { name: 'groupID', data:  group_id.toString()},
                                { name: 'message', data: this.state.message.toString()},
                                { name: 'date', data: new Date().toString()},
                                { name: 'status', data: '1' }
                            ]).then((response) => {
                                if( response.data && response.data != '' && response.data == 'Notice Saved') {
                                    console.log('response.data',response.data,this.state.allMessages);
                                    this.setState({
                                        imagePath: data.path,
                                    })
                                    let both = this.state.allMessages;
                                    this.state.allMessages.map((data,key) => {
                                        //both.push(data);
                                    });
                                    console.log('both',both);
                                    if( this.state.imagePath != '' ) {
                                        both.push(this.state.imagePath);
                                    }
                                    console.log('after pushboth',both);
                                    if( this.state.message != '' ){ 
                                        both.push(this.state.message);
                                    }
                                    this.setState({
                                        allMessages: both,
                                        allImages: [],
                                        message: ''
                                    });
                                }
                            });
                        } else {
                            console.log('else');
                            RNFetchBlob.fetch('POST', `${Constants.BASE_URL}noticeboard/send_broadcast_message.php`, {
                                Authorization : "Bearer access-token",
                                'Content-Type' : 'multipart/form-data',
                            }, [
                                // element with property `filename` will be transformed into `file` in form data
                                { name : 'image', filename : 'image.png', type:'image/png', data:  RNFetchBlob.wrap(data.path)},
                                // elements without property `filename` will be sent as plain text
                                { name: 'imagesQty', data: imagesQty},
                            ]).then((response) => console.log('response',response));
                        }
                    } else {
                    }
                }
            })
        } else {
            console.log('else',imagesQty);
            RNFetchBlob.fetch('POST', `${Constants.BASE_URL}noticeboard/send_text_broadcast_message.php`, {
                Authorization : "Bearer access-token",
                'Content-Type' : 'multipart/form-data',
            }, [
                // elements without property `filename` will be sent as plain text
                { name: 'companyID', data: company_id.toString()  },
//                            { name: 'groupID', data:  group_id.toString() },
                { name: 'message', data: this.state.message.toString() },
                { name: 'status', data: '1' }
            ]).then((response) => {
                if( response.data && response.data != '' && response.data == 'Notice Saved') {
                    console.log('response.data',response.data,this.state.allMessages);
                    let both = this.state.allMessages;
                    both = this.state.allMessages.concat(this.state.message);
                    this.setState({
                        allMessages: both,
                        message: ''
                    });
                }
            });
        }
        

        // if( fileExtension && fileExtension != 'exe' ){
        //     if( group_id && group_id !== '' ) {
        //         console.log('group_id',group_id, company_id);
        //     } else {
        //         RNFetchBlob.fetch('POST', `${Constants.BASE_URL}noticeboard/send_broadcast_message.php`, {
        //             Authorization : "Bearer access-token",
        //             'Content-Type' : 'multipart/form-data',
        //         }, [
        //             // element with property `filename` will be transformed into `file` in form data
        //             { name : 'image[0]', filename : 'image.png', type:'image/png', data:  RNFetchBlob.wrap(this.state.imagePath)},
        //             { name : 'image[1]', filename : 'image.png', type:'image/png', data:  RNFetchBlob.wrap(this.state.imagePath)},
        //             { name : 'image[2]', filename : 'image.png', type:'image/png', data:  RNFetchBlob.wrap(this.state.imagePath)},
        //             { name : 'image[3]', filename : 'image.png', type:'image/png', data:  RNFetchBlob.wrap(this.state.imagePath)},
        //             { name : 'image[4]', filename : 'image.png', type:'image/png', data:  RNFetchBlob.wrap(this.state.imagePath)},
        //             // elements without property `filename` will be sent as plain text
        //             { name: 'companyID', data: company_id.toString()  },
        //             { name: 'imageURL', data: this.state.imagePath.toString()  },
        //             { name: 'groupID', data:  group_id.toString() },
        //             { name: 'message', data: this.state.message.toString() },
        //             { name: 'date', data: new Date() },
        //             { name: 'status', data: 1 }
        //         ]).then((resp) => {
        //             console.log('resp',resp);
        //         }).catch((err) => {
        //             console.log('erro',err);
        //         })
        //     }
        // }
        // this.setState({
        //     message: '',
        //     imagePath: ''
        // })
        // PushNotification.localNotification({
        //     autoCancel: true,
        //     largeIcon: "ic_launcher",
        //     smallIcon: "ic_notification",
        //     bigText: "Click on notification to see datails of new NoticeBoard Notification",
        //     color: "green",
        //     vibrate: true,
        //     vibration: 300,
        //     title: "NoticeBoard",
        //     message: this.state.message,
        //     playSound: true,
        //     soundName: 'default',
        //     actions: '["Accept", "Reject"]',
        // });
    }

    openAttachmentModal() {
        this.setState({
            showAttachmentModal: true
        })
    }

    selectImage() {
        ImagePicker.openPicker({
            multiple: true,
            maxFiles: 5,
        }).then(images => {
            console.log(images);
            this.setState({
                allImages: images,
                showAttachmentModal: false
            })
        }).catch((error) => {
            console.log('errror',error);
            this.setState({
                showAttachmentModal: false
            })    
        })
    }

    selectVideo() {
        ImagePicker.openPicker({
            mediaType: "video",
        }).then((video) => {
            console.log(video);
            this.setState({
                videoPath: video.path,
                showAttachmentModal: false
            })
//            let company_id = await AsyncStorage.getItem('CompanyID');
//            let group_id = await AsyncStorage.getItem('GroupID');
            RNFetchBlob.fetch('POST', `${Constants.BASE_URL}noticeboard/send_broadcast_video_message.php`, {
                Authorization : "Bearer access-token",
                otherHeader : "foo",
                'Content-Type' : 'multipart/form-data',
            }, [
                // element with property `filename` will be transformed into `file` in form data
                { name : 'video', filename : 'video.mp4', type:'video/mp4', data:  RNFetchBlob.wrap(video.path)},
                // elements without property `filename` will be sent as plain text
                { name: 'videoURL', data: video.path.toString() },
                { name: 'date', data: new Date() },
                { name: 'status', data: 1 }
            ]).then((resp) => {
                console.log('resp',resp);
            }).catch((err) => {
                console.log('erro',err);
            })
        }).catch((error) => {
            console.log('errror',error);
            this.setState({
                showAttachmentModal: false
            })    
        })
    }
    
    render() {
        let items = [];
        this.state.allMessages.map((data,key) => {
//            console.log('data',data);
            let imageUrl = '';
            let path = data.split(".");
            if( path[path.length - 1] == 'jpg' ) {
                imageUrl = data;
            }
            if( data != '' ) {
                items.push (
                    <View style={ styles.innerContainer } key={key}>
                       <View style={styles.cardView} >
                            { 
                                imageUrl != '' ? <Image source={{uri: imageUrl}} style={styles.ImageStyle} /> : <Text style={styles.cardText}>{data}</Text> 
                            }
                        </View>
                        <View style={{marginTop: 5, marginBottom: 5, alignSelf: 'center'}}>
                            <Text style={{color: '#ddd', fontSize: 12}}>{new Date().toLocaleString()}</Text>
                        </View>
                    </View>
                )
            }
        })
        let selectedImage = [];
        if( this.state.allImages && this.state.allImages.length > 0 ) {
            this.state.allImages.map((data,key) => {
                selectedImage.push(
                    <Image key={key} source={{uri: data.path}} style={[styles.ImageStyle, {resizeMode: 'contain'}]}/>
                )
            })
        }

        return (
            <View style={{flex: 1}}>
                <ScrollView style={styles.contianer} contentContainerStyle={{flexGrow: 1}}
                ref={ref => this.scrollView = ref}
                onContentSizeChange={(contentWidth, contentHeight)=>{        
                this.scrollView.scrollToEnd({animated: true});}}>
                    {
                        items
                    }
                </ScrollView>
                <View style={styles.imagesBox}>
                    <ScrollView horizontal={true} contentContainerStyle={{flexGrow: 1}} >
                    {
                        selectedImage
                    }
                    </ScrollView>
                </View>
                <View>
                    <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
                        <View style={styles.inputNotice}>
                            <TouchableOpacity style={styles.add}
                                onPress={() => this.openAttachmentModal()}>
                                <Text style={{fontSize: 16,}}>+</Text>
                            </TouchableOpacity>
                            <TextInput 
                            onChangeText={(event) => this.setState({message: event})}
                            value={this.state.message}
                            style={styles.noticeText}
                            placeholder="Enter Message"
                            multiline={true}
                            blurOnSubmit={true}/>
                            <TouchableOpacity style={styles.sendButton}
                                onPress={this.sendnotification}>
                                <Text style={{fontSize: 16,}}>SEND</Text>
                            </TouchableOpacity>
                        </View>
                        <Modal 
                            animationType="slide"
                            transparent={true}
                            visible={this.state.showAttachmentModal}
                            onRequestClose={() => { this.setState({ showAttachmentModal: false }) }}>
                            <View style={styles.settingContainer}>
                                <View style={styles.modalContainer}>
                                    <TouchableOpacity style={styles.attachmentBoxes}
                                    onPress={() => this.selectImage()}>
                                        <Icon name="md-photos" size={40} color="#000" />
                                        <Text>Upload Photo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.attachmentBoxes}
                                    onPress={() => this.selectVideo()}>
                                        <Icon name="md-videocam" size={40} color="#000" />
                                        <Text>Upload Video</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.attachmentBoxes}>
                                        <Icon name="md-mic" size={40} color="#000" />
                                        <Text>Upload Audio</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contianer: {
        paddingTop: 5,
        backgroundColor: '#1c1c26',
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
    },
    cardText: {
        fontSize: 14
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
    modalContainer: {
        backgroundColor: '#ddd',
        flexDirection: 'row',
        width: width,
        height: '20%'
    },
    imagesBox: {
        flexDirection: 'row',
    },
    ImageStyle: {
        margin: 5,
        width: 100,
        height: 100,
    },
    attachmentBoxes: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default Notice