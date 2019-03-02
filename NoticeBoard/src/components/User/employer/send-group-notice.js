import React, { Component } from 'react'
import { BackHandler, Alert, FlatList, Animated, ImageBackground, Text, View, Modal, Image, TouchableOpacity, ScrollView, TextInput, AsyncStorage, SafeAreaView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from "../../../Utils/Constants";
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Loader from '../../../Utils/activity-indicator';
import styles from "./../../../assets/styles/employer/sending-notice-styles";
import Statusbar from "./../../statusbar";

var animationFlag = 1;
class GroupNotices extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'NoticeBoard',
            headerTitleStyle: { flex: 1, color: 'white', textAlign: 'center',alignSelf:'center'},
            headerStyle: {
                backgroundColor: '#303952',
                elevation: 7,
            },
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.navigate('SignedIn')}
                style={{ justifyContent: 'center', padding: 10 }}>
                    <Icon name="md-arrow-round-back" size={20} color="#ddd" />
                </TouchableOpacity>
            ),
            headerRight: (
                <TouchableOpacity onPress={() => navigation.navigate('SignedIn')}
                style={{ justifyContent: 'center', padding: 10 }}>
                    {/* <Icon name="md-person-add" size={20} color="#ddd" /> */}
                </TouchableOpacity>
            ),
        }
    }

    constructor(props) {
        super(props)
    
        this.state = {
            message: '',
            allMessages: [],
            showAttachmentModal: false,
            allImages: [],
            allVideos: [],
            isLoading: false,
            notificationType: "",
            showImageModal: false,
            imagePath: '',
            imageText: '',
            fadeAnim: new Animated.Value(1),
            lastSeenNoticeID: null
        }
        this.myname = '';
    }

    async componentWillMount() {
        let group_id = await AsyncStorage.getItem('GroupID');
        let email = await AsyncStorage.getItem('emailOrId');
        let cmpID = await AsyncStorage.getItem('CompanyID');
        fetch(`${Constants.BASE_URL}get_group_notices.php`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                group_id: group_id && group_id != null ? group_id : 0,
                cmpID: cmpID
            })
        }).then(( response ) => response.text())
        .then(( responseJson ) => {
            console.log('responseJson',responseJson, typeof responseJson)
            if( responseJson && responseJson != '' && undefined != responseJson ) {
                let responseArray = responseJson.split("|");
                let lastSeenNoticeID = responseArray[0].split(":")[0];
                this.setState({
                    allMessages: responseArray,
                    lastSeenNoticeID: lastSeenNoticeID
                })
            }
        })
        .catch((error) => {
            console.log('eeor',error)
        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        AsyncStorage.removeItem('GroupID');
    }

    handleBackButton = () => {
        this.props.navigation.navigate('SignedIn');
        return true;
    }

    async sendImageNotification() {
        let company_id = await AsyncStorage.getItem('CompanyID');
        let group_id = await AsyncStorage.getItem('GroupID');
    	let SenderName = await AsyncStorage.getItem('OwnerName');
        let imagesQty = this.state.allImages.length;
        let message = this.state.message.replace(/'/g, '"');
        if( imagesQty && imagesQty > 0 ) {
            this.state.allImages.map((data,key) => {
                if( data && data.path && data.path != '' ) {
                    this.setState({ isLoading: true});
                    this.myname = SenderName;
                    RNFetchBlob.fetch('POST', `${Constants.BASE_URL}send_broadcast_message.php`, {
                        Authorization : "Bearer access-token",
                        'Content-Type' : 'multipart/form-data',
                    }, [
                        // element with property `filename` will be transformed into `file` in form data
                        { name : 'image', filename : 'image.png', type:'image/png', data:  RNFetchBlob.wrap(data.path)},
                        // elements without property `filename` will be sent as plain text
                        { name: 'imagesQty', data: imagesQty.toString()},
                        { name: 'companyID', data: company_id.toString()},
                        { name: 'imageURL', data: data.path.toString()},
                        { name: 'message', data: message.toString()},
                        { name: 'status', data: '1' },
                        { name: 'SenderName', data: SenderName.toString() },
                        { name: 'group_id', data: group_id != null ? group_id : '0'}
                    ]).then((response) => {
                        if( response.data && response.data != '' && response.data != 'Error saving notice') {
                            let data = response.data.split("|")[0];
                            data = data+":"+SenderName;
                            let both = [];
                            both.push(data);
                            both = both.concat(this.state.allMessages);
                            this.setState({
                                allMessages: both,
                                allImages: [],
                                message: '',
                                showAttachmentModal: false,
                                isLoading: false,
                                notificationType: ''
                            });
                        } else {
                            this.setState({
                                isLoading: false,
                                notificationType: '',
                                allImages: [],
                                message: ''
                            })
                            alert("server is not responding at the moment");
                        }
                    }).catch((err) => {
                        console.log('error',err);
                        this.setState({ isLoading: false });
                    })
                    this.setState({
                        notificationType: ''
                    })
                }
            })
        }
    }

    // function for sending text notification message
    async sendTextNotification() {
        let company_id = await AsyncStorage.getItem('CompanyID');
    	let SenderName = await AsyncStorage.getItem('OwnerName');
        let group_id = await AsyncStorage.getItem('GroupID');
        let message = this.state.message.replace(/'/g, '"');
        if( company_id && company_id != '' && this.state.message && this.state.message != '' && !this.state.message.replace(/\s/g, '').length == 0) {
            this.myname = SenderName;
            RNFetchBlob.fetch('POST', `${Constants.BASE_URL}send_text_broadcast_message.php`, {
                Authorization : "Bearer access-token",
                'Content-Type' : 'multipart/form-data',
            }, [
                // elements without property `filename` will be sent as plain text
                { name: 'companyID', data: company_id.toString()  },
                { name: 'message', data: message.toString() },
                { name: 'status', data: '1' },
                { name: 'group_id', data: group_id != null ? group_id : '0' },
                { name: 'SenderName', data: SenderName.toString() }
            ]).then((response) => {
                if( response.data != '' || response.data != 'ERROR SENDING NOTICE') {
                    let data = response.data.split("|")[0];
                    data = data+":"+SenderName;
                    let both = [];
                    both.push(data);
                    both = both.concat(this.state.allMessages);
                    this.setState({
                        allMessages: both,
                        message: '',
                        notificationType: ''
                    });
                }
            }).catch((error) => {
                console.log('error',error);
            })
            this.setState({
                notificationType: ''
            })
        }
    }

    async sendVideoNotification() {
        console.log('sendVideoNotification');
        let company_id = await AsyncStorage.getItem('CompanyID');
        let group_id = await AsyncStorage.getItem('GroupID');
        RNFetchBlob.fetch('POST', `${Constants.BASE_URL}send_broadcast_video_message.php`, {
            Authorization : "Bearer access-token",
            'Content-Type' : 'multipart/form-data',
        }, [
            // element with property `filename` will be transformed into `file` in form data
            { name : 'video', filename : 'video.mp4', type:'video/mp4', data:  RNFetchBlob.wrap(video.path)},
            // elements without property `filename` will be sent as plain text
            { name: 'videoURL', data: video.path.toString() },
            { name: 'companyID', data: company_id.toString()},
            { name: 'message', data: this.state.message.toString()},
            { name: 'status', data: 1 }
        ]).then((resp) => {
            console.log('resp',resp);
            this.setState({
                notificationType: ''
            })
        }).catch((err) => {
            console.log('erro',err);
            this.setState({
                notificationType: ''
            })
        })
    }

    openAttachmentModal() {
        this.setState({
            showAttachmentModal: true
        })
    }

    selectImage() {
        let imageArray = [];
        ImagePicker.openPicker({
            mediaType: 'photo',
            // multiple: true,
//            maxFiles: 1,
        }).then(images => {
            if( images && images.length > 1 ) {
                this.setState({
                    allImages: images,
                    showAttachmentModal: false,
                    notificationType: "IMAGE"
                })
            } else {
                imageArray.push(images);
                this.setState({
                    allImages: imageArray,
                    showAttachmentModal: false,
                    notificationType: "IMAGE"
                })
            }
//            notificationType = "IMAGE";
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
//            maxFiles: 1,
//            multiple: true
        }).then((video) => {
            console.log(video);
            this.setState({
                videoPath: video.path,
                allVideos: video,
                showAttachmentModal: false,
                notificationType: "VIDEO"
            })
//            notificationType = "VIDEO";
        }).catch((error) => {
            console.log('errror',error);
            this.setState({
                showAttachmentModal: false
            })    
        })
    }

    downloadImage(url) {
        var ext = this.extention(url);
        ext = "."+ext[0];
        const { config, fs } = RNFetchBlob;
        let PictureDir = fs.dirs.PictureDir;
        let options = {
            fileCache: true,
            addAndroidDownloads : {
              useDownloadManager : true,
              notification : true,
              path:  PictureDir + "/image_"+Math.floor(new Date().getTime() + new Date().getSeconds() / 2)+ext,
              description : 'Image'
            }
        }
        config(options).fetch('GET', url).then((res) => {
            Alert.alert("Success Downloaded");
        });
    }

    extention(filename){
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
    }

    showImageModal(url, imageText) {
        Image.getSize(url, (width, height) => {});
        this.setState({
            showImageModal: true,
            imagePath: url,
            imageText: imageText
        })
    }

    closeImageModal() {
        this.setState({
            showImageModal: false,
            imagePath: '',
            imageText: ''
        })
    }

    fadeImageText() {
        Animated.timing(                  // Animate over time
            this.state.fadeAnim,            // The animated value to drive
            {
                toValue: 0,      // Animate to opacity: 1 (opaque)
                duration: 500,              // Make it take a while
            }
        ).start();
        animationFlag = 0;
    }

    showImageText() {
        Animated.timing(                  // Animate over time
            this.state.fadeAnim,            // The animated value to drive
            {
                toValue: 1,      // Animate to opacity: 1 (opaque)
                duration: 300,              // Make it take a while
            }
        ).start();
        animationFlag = 1;
    }

    deleteNoticePrompt(id) {
        Alert.alert(
            'Delete Notice',
            'Are you sure to delete this notice ?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK', onPress: () => {
                        this.deleteNotice(id)
                    }
                },
            ],
            {cancelable: false},
        );
    }

    deleteNotice(noticeId) {
        fetch(`${Constants.BASE_URL}delete_notice.php`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                noticeId: noticeId
            })
        }).then(( response ) => response.text())
        .then(( responseJson ) => {
            if( responseJson === "Deleted" ) {
                let messages = this.state.allMessages.filter(item => 
                    item.split(":")[0] != noticeId
                )
                this.setState({
                    allMessages: messages
                })
            } else {
                Alert.alert(
                    'Error',
                    'Message can not be deleted at the moment',
                    [
                        {
                            text: 'OK', onPress: () => {}
                        },
                    ],
                    {cancelable: true},
                );
            }
        })
        .catch((error) => {
            Alert.alert(
                'Network Error',
                'Unable to delete message',
                [
                    {
                        text: 'OK', onPress: () => {}
                    },
                ],
                {cancelable: true},
            );
            console.log('error 123',error)
        })
    }

    render() {
        let { fadeAnim } = this.state;
        let selectedImage = [];
        this.state.allImages.map((image,key) => {
            selectedImage.push(
                <View style={{width: 120, height: 120}}>
                    <Image key={key} source={{uri: image.path}} style={[styles.modalImageStyle, {resizeMode: 'contain'}]}/>
                </View>
            )
        })

        return (
            <SafeAreaView style={{flex: 1}}>
                <Statusbar />
        		<Loader loading={this.state.isLoading} />
                <View style={styles.contianer}>
                    <FlatList 
                    initialNumToRender={20}
                    maxToRenderPerBatch={20}
                    data={this.state.allMessages} 
                    keyExtractor={item => `${item.split(":")[0]}`}
                    renderItem={({item}) => {
                        let itemDetails = item.split(":");
                        let date = (
                            <View style={{ marginBottom: 8, alignSelf: 'center'}}>
                                <Text style={{color: '#ddd', fontSize: 12, opacity: 0.7}}>{itemDetails[3]}</Text>
                            </View>
                        )
                        if( itemDetails && itemDetails != '' && itemDetails[1].length > 0 && itemDetails[2].length == 0 ) {
                            return(
                                <TouchableOpacity style={ styles.innerContainer }
                                onLongPress={() => this.deleteNoticePrompt(itemDetails[0])}>
                                    {date}
                                    <View style={styles.cardView} >
                                        <Text style={styles.senderName}>{itemDetails && itemDetails[4] != '' ? itemDetails[4].toUpperCase() : this.SenderName}</Text>
                                        <Text style={styles.cardText}>{itemDetails[1]}</Text>
                                    </View>
                                </TouchableOpacity> 
                            )
                        } else if( itemDetails && itemDetails != '' && itemDetails.length > 0 && itemDetails[2].length > 1 ) {
                            let imageUrl = `${Constants.BASE_URL}${itemDetails[2]}`;
                            return(
                                <TouchableOpacity style={ styles.innerContainer }
                                onLongPress={() => this.deleteNoticePrompt(itemDetails[0])}
                                onPress={() => this.showImageModal(imageUrl, itemDetails[1])} >
                                    {date}
                                    <View style={styles.cardView} >
                                        <Text style={styles.senderName}>{itemDetails[4].toUpperCase()}</Text>
                                        <View style={{flex: 1}}>
                                            <Image source={{uri: imageUrl}} style={styles.ImageStyle} resizeMode='cover'/>
                                            {itemDetails[1] && itemDetails[1] != '' ? <Text style={[styles.cardText, styles.textWithImage]}>{itemDetails[1]}</Text> : <View></View>}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    }}/>
                </View>
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
                                onPress={() => {
                                    this.state.notificationType == "IMAGE" ? this.sendImageNotification() : this.state.notificationType == "VIDEO" ? this.sendVideoNotification() : this.sendTextNotification()
                                }
                            }>
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
                <Modal 
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showImageModal}
                    onRequestClose={() => {
                        this.setState({
                            showImageModal: false
                        })
                    }}>
                    <TouchableOpacity activeOpacity={1} style={styles.modalContainerImage}  onPress={() => {animationFlag == 0 ? this.showImageText() : this.fadeImageText() }}>
                        <ImageBackground source={{uri: this.state.imagePath}} style={styles.modalImageStyle} resizeMode='contain'>
                            <Animated.View style={[styles.modalHeaderButton, {opacity: fadeAnim}]}>
                                <TouchableOpacity
                                    style={styles.modalButtons}
                                    onPress={() => this.closeImageModal()}>
                                    <Icon name="md-arrow-round-back" size={20} color="#ddd" style={styles.buttonIcons}/>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.modalButtons}
                                    onPress={() => this.downloadImage(this.state.imagePath)}>
                                    <Image source={require('./../../../assets/icons/icon.png')} style={styles.buttonIcons}/>
                                </TouchableOpacity>
                            </Animated.View>
                            <Animated.View style={[styles.modalImageText, {opacity: fadeAnim}]}>
                                <Text style={styles.imageText}>{this.state.imageText}</Text>
                            </Animated.View>
                        </ImageBackground>
                    </TouchableOpacity>
                </Modal>
            </SafeAreaView>
        )
    }
}

export default GroupNotices