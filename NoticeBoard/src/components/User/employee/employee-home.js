import React, { Component } from 'react'
import { Text, Animated, BackHandler, FlatList, Modal, Dimensions, View, StyleSheet, Image, ImageBackground, AsyncStorage, TouchableOpacity } from 'react-native'
import Constants from "./../../../Utils/Constants";
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/Ionicons';
import Loader from '../../../Utils/activity-indicator';
import Statusbar from "./../../statusbar";
const { width, height } = Dimensions.get('window');

var animationFlag = 1;
class EmployeeAllNotices extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Noticeboard',
        headerTitleStyle: { flex: 1, color: 'white', textAlign: 'center',alignSelf:'center'},
        headerStyle: {
          backgroundColor: '#303952',
          elevation: 7
        },
        headerLeft: (
            <TouchableOpacity onPress={() => navigation.navigate('EmployeeLogin')}
            style={{ justifyContent: 'center', padding: 10 }}>
                <Icon name="md-arrow-round-back" size={20} color="#ddd" />
            </TouchableOpacity>
        ),
        headerRight: ( <View></View> ),
    })

    constructor(props) {
        super(props)

        this.state = {
            allMessages: [],
            imagePath: '',
            showImageModal: false,
            imageText: '',
            fadeAnim: new Animated.Value(1),
            lastSeenNoticeID: null,
            isLoading: false
        }
        this.myname = '';
    }

    async componentWillMount() {
        this.setState({isLoading: true})
        let email = await AsyncStorage.getItem('emailOrId');
        let SenderName = await AsyncStorage.getItem('OwnerName');
        this.myname = SenderName;
        fetch(`${Constants.BASE_URL}get_all_notices.php`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email
            })
        }).then(( response ) => response.text())
        .then(( responseJson ) => {
            // console.log('responseJson',responseJson);
            responseJson = responseJson.split("|");
            let lastSeenNoticeID = responseJson[0].split(":")[0];
            this.setState({
                allMessages: responseJson,
                lastSeenNoticeID: lastSeenNoticeID,
                isLoading: false
            })
        }).catch((errorMessage, statusCode) => {
            // error handling
            // console.log('errorMessage,',errorMessage,'statusCode',statusCode);
        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.setState({isLoading: false})
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        this.props.navigation.navigate('EmployeeLogin');
        return true;
    }

    downloadImage(url) {
        let ext = this.extention(url);
        ext = "."+ext[0];
        const { fs } = RNFetchBlob;
        let PictureDir = `${fs.dirs.PictureDir}/Noticeboard`;
        fs.mkdir(PictureDir)
        .then(() => {
            this.downloadToDirectory(PictureDir, ext, url);
        })
        .catch((err) => { 
            this.downloadToDirectory(PictureDir, ext, url);
        })
    }

    extention(filename){
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
    }

    downloadToDirectory(dir, ext, url) {
        const { config } = RNFetchBlob;
        let options = {
            fileCache: true,
            addAndroidDownloads : {
              useDownloadManager : true,
              notification : true,
              path: dir + "/image_"+Math.floor(new Date().getTime() + new Date().getSeconds() / 2)+ext,
              description : 'Image'
            }
        }
        config(options).fetch('GET', url).then((res) => {
            alert('Image saved');
        });
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

    render() {
        let { fadeAnim } = this.state;
        return (
            <View style={{flex: 1}}>
        		<Loader loading={this.state.isLoading} />
                <Statusbar />
                <View style={styles.container}>
                    <FlatList 
                    initialNumToRender={20}
                    maxToRenderPerBatch={20}
                    data={this.state.allMessages} 
                    keyExtractor={item => `${item.split(":")[0]}`}
                    renderItem={({item}) => {
                        console.log('item',item)
                        if(item && item != "") {
                            let itemDetails = item.split(":");
                            let date = (
                                <View style={{ marginBottom: 8, alignSelf: 'center'}}>
                                    <Text style={{color: '#ddd', fontSize: 12, opacity: 0.7}}>{itemDetails[3]}</Text>
                                </View>
                            )
                            itemDetails == this.state.lastSeenNoticeID ? newMessage = (<Text>New Messages</Text>) : <Text></Text>;
                            if( itemDetails && itemDetails != '' && itemDetails[1].length > 0 && itemDetails[2].length == 0 ) {
                                return(
                                    <View style={ styles.innerContainer }>
                                        {date}
                                        <View style={styles.cardView} >
                                            <Text style={styles.senderName}>{itemDetails && itemDetails[4] != '' ? itemDetails[4].toUpperCase() : this.myname}</Text>
                                            <Text style={styles.cardText}>{itemDetails[1]}</Text>
                                        </View>
                                    </View> 
                                )
                            } else if( itemDetails && itemDetails != '' && itemDetails.length > 0 && itemDetails[2].length > 1 ) {
                                let imageUrl = `${Constants.BASE_URL}${itemDetails[2]}`;
                                return(
                                    <View style={ styles.innerContainer }>
                                        {date}
                                        <View style={styles.cardView} >
                                            <Text style={styles.senderName}>{itemDetails && itemDetails[4] != '' ? itemDetails[4].toUpperCase() : this.myname}</Text>
                                            <TouchableOpacity 
                                            style={{flex: 1}}
                                            onPress={() => this.showImageModal(imageUrl, itemDetails[1])}>
                                                <Image source={{uri: imageUrl}} style={styles.ImageStyle} resizeMode='cover'/>
                                                <Text style={[styles.cardText, styles.textWithImage]}>{itemDetails[1]}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            }
                        }
                    }}/>
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
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
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
        fontSize: 14
    },
    ImageStyle: {
        width: '100%',
        height: width,
    },
    textWithImage: {
        margin: 10,
        alignSelf: 'flex-start'
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
    modalContainer: {
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
    },
    modalButtons: {
        margin: 15,
        backgroundColor: '#000000'
    },
    buttonIcons: {
        width: 20,
        height: 20,
        opacity: 0.9
    },
    imageText: {
        alignSelf: 'center',
        color: '#ddd',
        position: 'absolute',
        bottom: 20,
        padding: 10
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
        position: 'absolute',
        bottom: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    imageText: {
        alignSelf: 'center',
        color: '#fff',
        padding: 10,
    },
    senderName: {
        color: '#cb2326',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5
    }
})

export default EmployeeAllNotices