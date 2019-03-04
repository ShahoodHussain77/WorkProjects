import React, { Component } from 'react'
import { View, AsyncStorage, WebView, BackHandler, Alert, PermissionsAndroid } from 'react-native'
import CoursesHeader from "./Custom_Courses_Header";
import styles from '../../styles/Courses_Details_Styles';
import Constants from "./../../Utils/Constants";
import Swiper from 'react-native-swiper';
import RNFetchBlob from 'rn-fetch-blob'

class CourseDetails extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
       courseTitle: '',
       data: []
    }
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  async requestStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Course metarial download permission',
          message:
            'Allow mindstrom to download course material on your device.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      } else {
      }
    } catch (err) {
      console.warn(err);
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.navigate('SignedIn'); // works best when the goBack is async
    return true;
  }

  async componentWillMount() {
    let course = await AsyncStorage.getItem('CourseDetails');
    fetch(`${Constants.BASE_URL}${Constants.get_course_slide}`, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        CourseID: course.split(":br:")[0]
      })
    }).then((response) => response.text())
    .then((responseJson) => {
      if( responseJson == 'TWO' ) {
          this.setState({ data: null });
      } else {
        this.setState({ 
          data: responseJson.split("|"),
          courseTitle: course.split(":br:")[1]
        });
      }
    }).catch(error => {
      console.log('rerer',error)
    })
  }

  onMessage(m) {
    let ext = this.extention(`${m.nativeEvent.data}`);
    let uri = `${m.nativeEvent.data}`;
    ext = "."+ext[0];
    const { config, fs } = RNFetchBlob;
    let DownloadDir = fs.dirs.DownloadDir;
    let options = {
      fileCache: true,
      addAndroidDownloads : {
        useDownloadManager : true,
        notification : true,
        path:  DownloadDir + "/file_"+Math.floor(new Date().getTime() + new Date().getSeconds() / 2)+ext,
        description : 'course material'
      }
    }
    this.requestStoragePermission().then(() => {
      config(options).fetch('GET', `${Constants.BASE_URL}${uri}`).then((res) => {
        Alert.alert(
          'Download complete',
          'Course material downloaded successfully',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: true},
        );
      });
    }).catch((error) => {
      Alert.alert(
        'Error',
        'Mindstrom might not have storage permission or network problem',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: true},
      );
    })
  }

  extention(filename){
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
  }

  render() {
    return (
      <View style={styles.Container}>
        <CoursesHeader title={this.state.courseTitle} onPress={() => this.props.navigation.navigate('SignedIn')}/>
        <Swiper style={styles.wrapper} loop={false}
        showsPagination={true}
        key={this.state.data.length}>
          {
            this.state.data && this.state.data.length > 0 ? this.state.data.map(( slide, key) => {
              if( slide && slide != '' ) {
                let desc = slide.split(":br:")[3];
                let uri = (Constants.BASE_URL+desc).toString();
                return(
                  <View style={styles.slide} key={slide.split(":br:")[0]}>
                    <View style={{flex: 1}}>
                      <WebView
                        onMessage={m => this.onMessage(m)}
                        injectedJavaScript="true"
                        javaScriptEnabled={true}
                        scalesPageToFit={true}
                        bounces={false}
                        scrollEnabled={false}
                        source={{uri: uri}}
                        style={styles.webView}
                      />
                    </View>
                  </View>
                )
              }
            }) : <View></View>
          }
        </Swiper>
      </View>
    )
  }
}

export default CourseDetails