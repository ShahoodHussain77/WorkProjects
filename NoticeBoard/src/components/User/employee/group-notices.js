import React, { Component } from 'react'
import { BackHandler, Alert, FlatList, Animated, ImageBackground, ScrollView, TextInput, Text, View, Modal, Image, TouchableOpacity, AsyncStorage, SafeAreaView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from "../../../Utils/Constants";
import RNFetchBlob from 'rn-fetch-blob';
import Loader from '../../../Utils/activity-indicator';
import styles from "./../../../assets/styles/employer/sending-notice-styles";
import ImagePicker from 'react-native-image-crop-picker';
import Statusbar from "./../../statusbar";

var animationFlag = 1;
class EmployeeGroupNotices extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'NoticeBoard',
            headerTitleStyle: { flex: 1, color: 'white', textAlign: 'center',alignSelf:'center'},
            headerStyle: {
                backgroundColor: '#303952',
                elevation: 7,
            },
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.navigate('EmployeeLogin')}
                style={{ justifyContent: 'center', padding: 10 }}>
                    <Icon name="md-arrow-round-back" size={20} color="#ddd" />
                </TouchableOpacity>
            ),
            headerRight: (<View></View>),
        }
    }

    constructor(props) {
        super(props)
    
        this.state = {
            message: '',
            allMessages: [],
            allImages: [],
            isLoading: false,
            showImageModal: false,
            imagePath: '',
            imageText: '',
            fadeAnim: new Animated.Value(1),
            showImage: false
        }
        this.enableReply = '0';
        this.openCamera = this.openCamera.bind(this);
        this.sendTextNotification = this.sendTextNotification.bind(this);
        this.sendImageNotification = this.sendImageNotification.bind(this);
        this.myname = '';
    }

    async componentWillMount() {
        this.setState({isLoading: true})
        let group_id = await AsyncStorage.getItem('GroupID');
        let email = await AsyncStorage.getItem('emailOrId');
        let cmpID = await AsyncStorage.getItem('CompanyID');
        this.enableReply = await AsyncStorage.getItem('ReplyEnable');
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
            // console.log('responseJson',responseJson)
            if( responseJson && responseJson != '' && undefined != responseJson ) {
                let responseArray = responseJson.split("|");
                let lastSeenNoticeID = responseArray[0].split(":")[0];
                this.setState({
                    allMessages: responseArray,
                    lastSeenNoticeID: lastSeenNoticeID,
                    isLoading: false
                })
            }
        })
        .catch((error) => {
            // console.log('eeor',error)
        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.setState({isLoading: false})
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        AsyncStorage.removeItem('GroupID');
        AsyncStorage.removeItem('ReplyEnable');
    }

    handleBackButton = () => {
        this.props.navigation.navigate('EmployeeLogin');
        return true;
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

    async sendImageNotification() {
        let company_id = await AsyncStorage.getItem('CompanyID');
        let imagesQty = this.state.allImages.length;
        let SenderName = await AsyncStorage.getItem('OwnerName');
        let group_id = await AsyncStorage.getItem('GroupID');
        let message = this.state.message.replace(/'/g, '"');
        this.myname = SenderName;
        this.state.allImages.map((data,key) => {
            if( data && data.path && data.path != '' ) {
                this.setState({ isLoading: true});
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
                    { name: 'group_id', data: group_id.toString() },
                    { name: 'status', data: '1' },
                    { name: 'SenderName', data: SenderName.toString() }
                ]).then((response) => {
                    if( response.data && response.data != '' && response.data != 'TWO') {
                        let data = response.data.split("|")[0];
                        data = data+":"+SenderName;
                        let both = this.state.allMessages;
                        both = this.state.allMessages.concat(data);
                        this.setState({
                            allMessages: both,
                            allImages: [],
                            message: '',
                            showAttachmentModal: false,
                            isLoading: false,
                            showImage: false
                        });
                    } else {
                        this.setState({
                            isLoading: false,
                            allImages: [],
                            showImage: false,
                            message: ''
                        })
                        alert("server is not responding at the moment");
                    }
                }).catch((err) => {
                    // console.log('error',err);
                    this.setState({
                        isLoading: false , 
                        showImage: false
                    });
                })
            }
        })
    }

    // function for sending text notification message
    async sendTextNotification() {
        let company_id = await AsyncStorage.getItem('CompanyID');
        let SenderName = await AsyncStorage.getItem('OwnerName');
        let group_id = await AsyncStorage.getItem('GroupID');
        let message = this.state.message.replace(/'/g, '"');
        this.myname = SenderName;
        if( company_id && company_id != '' && this.state.message && this.state.message != '' && !this.state.message.replace(/\s/g, '').length == 0 ) {
            RNFetchBlob.fetch('POST', `${Constants.BASE_URL}send_text_broadcast_message.php`, {
                Authorization : "Bearer access-token",
                'Content-Type' : 'multipart/form-data',
            }, [
                // elements without property `filename` will be sent as plain text
                { name: 'companyID', data: company_id.toString()  },
                { name: 'message', data: message.toString() },
                { name: 'SenderName', data: SenderName.toString() },
                { name: 'group_id', data: group_id.toString() },
                { name: 'status', data: '1' }
            ]).then((response) => {
                if( response.data && response.data != '' && response.data != 'ERROR SENDING NOTICE') {
                    let data = response.data.split("|")[0];
                    data = data+":"+SenderName;
                    let both = this.state.allMessages;
                    both = this.state.allMessages.concat(data);
                    this.setState({
                        allMessages: both,
                        message: '',
                    });
                }
            }).catch((error) => {
                console.log('error',error);
            })
        }
    }

    openCamera() {
        let imageArray = [];
        ImagePicker.openCamera({
            width: 400,
            height: 500,
            // cropping: true,
        }).then(image => {
            imageArray.push(image)
            this.setState({
                allImages: imageArray,
                imagePath: image.path,
                showImage: true
            })
        });
    }

    renderNotices(item) {
        // console.log('item',item)
        let itemDetails = item.split(":");
        let date = (
            <View style={{ marginBottom: 8, alignSelf: 'center'}}>
                <Text style={{color: '#ddd', fontSize: 12, opacity: 0.7}}>{itemDetails[3]}</Text>
            </View>
        )
        if( itemDetails && itemDetails != '' && itemDetails[1].length > 0 && itemDetails[2].length == 0 ) {
            return(
                <TouchableOpacity style={ styles.innerContainer }>
                    {date}
                    <View style={styles.cardView} >
                        <Text style={styles.senderName}>{itemDetails && itemDetails[4] != '' ? itemDetails[4].toUpperCase() : this.myname}</Text>
                        <Text style={styles.cardText}>{itemDetails[1]}</Text>
                    </View>
                </TouchableOpacity> 
            )
        } else if( itemDetails && itemDetails != '' && itemDetails.length > 0 && itemDetails[2].length > 1 ) {
            let imageUrl = `${Constants.BASE_URL}${itemDetails[2]}`;
            return(
                <TouchableOpacity style={ styles.innerContainer }
                onPress={() => this.showImageModal(imageUrl, itemDetails[1])} >
                    {date}
                    <View style={styles.cardView} >
                        <View style={{flex: 1}}>
                            <Text style={styles.senderName}>{itemDetails && itemDetails[4] != '' ? itemDetails[4].toUpperCase() : this.myname}</Text>
                            <Image source={{uri: imageUrl}} style={styles.ImageStyle} resizeMode='cover'/>
                            {itemDetails[1] && itemDetails[1] != '' ? <Text style={[styles.cardText, styles.textWithImage]}>{itemDetails[1]}</Text> : <View></View>}
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    render() {
        let { fadeAnim } = this.state;
        return (
            <SafeAreaView style={{flex: 1}}>
        		<Loader loading={this.state.isLoading} />
                <Statusbar />
                <View style={styles.contianer}>
                    <FlatList 
                    initialNumToRender={20}
                    maxToRenderPerBatch={20}
                    data={this.state.allMessages} 
                    keyExtractor={item => `${item.split(":")[0]}`}
                    renderItem={({item}) => this.renderNotices(item)}/>
                </View>
                <Modal 
                    animationType="slide"
                    transparent={true}
                    visible={this.state.showImage}
                    onRequestClose={() => {
                        this.setState({
                            showImage: false
                        })
                    }}>
                    <View style={styles.modalContainerImage}>
                        <ImageBackground source={{uri: this.state.imagePath}} style={styles.modalImageStyle} resizeMode='contain'>
                            <View style={styles.showImageModalHeader}>
                                <TouchableOpacity
                                    style={styles.modalButtons}
                                    onPress={() => this.setState({showImage: false})}>
                                    <Icon name="md-arrow-round-back" size={20} color="#ddd" style={styles.buttonIcons}/>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.inputNotice, styles.inputViewModal]}>
                                <TouchableOpacity style={styles.add}
                                    onPress={this.openCamera}>
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
                                    onPress={this.state.allImages.length > 0 ? this.sendImageNotification : this.sendTextNotification}>
                                    <Text style={{fontSize: 16,}}>SEND</Text>
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    </View>
                </Modal>
                {
                    this.enableReply == '1' ? 
                    <View>
                        <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
                            <View style={styles.inputNotice}>
                                <TouchableOpacity style={styles.add}
                                    onPress={this.openCamera}>
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
                                    onPress={this.state.allImages.length > 0 ? this.sendImageNotification : this.sendTextNotification}>
                                    <Text style={{fontSize: 16,}}>SEND</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View> : <View></View>
                }
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

export default EmployeeGroupNotices