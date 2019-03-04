import React, { Component } from 'react'
import { Text, AsyncStorage, FlatList, ScrollView, View, Platform, StatusBar, ImageBackground, Dimensions, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import styles from "./../../styles/Courses_Home_Styles";
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import image from "./../../assets/Images/header.png";
import Constants from "./../../Utils/Constants";

const maxHeight = Dimensions.get('window').height;
const maxWidth =Dimensions.get('window').width;
class CoursesHome extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Courses',
            tabBarLabel: 'Courses',
            tabBarColor: '#612086',
            tabBarIcon: ({ tintColor, focused }) => (
              <Icon size={20} name={ Platform.OS === 'ios' ? (focused ? 'ios-home' : 'ios-home-outline') : 'md-home' } style={{ color: tintColor }} />
            )
        }
    }

    constructor(props) {
        super(props)
        
        this.state = {
            width: 0,
            height: 0,
            data: []
        }
        this.renderListItem = this.renderListItem.bind(this)
    }

    componentWillMount = () => {
        let source = resolveAssetSource(image);
        const ratio = Math.min(maxWidth / source.width, maxHeight / source.height);
        this.setState({
            width: source.width*ratio,
            height: source.height*ratio
        })
        fetch(`${Constants.BASE_URL}${Constants.get_all_courses}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        }).then((response) => response.text())
        .then((responseJson) => {
            if( responseJson == 'TWO' ) {
                this.setState({ data: null });
            } else {
                let data = responseJson.split("|");
                this.setState({ data });
            }
        })
    }

    redirectToCourseDetails(course) {
        AsyncStorage.setItem('CourseDetails', course.item);
        this.props.navigation.navigate('CourseDetails')
    }

    renderListItem(item) {
        if( item && item != '' && undefined != item && item.item != '' ) {
            let data = item.item.split(":br:");
            let courseTitle = data[1] && data[1] != '' ? data[1] : "Course name is not specify";
            return (
                <TouchableOpacity style={styles.courseContainer}
                onPress={() => this.redirectToCourseDetails(item)}
                key={data[0]}>
                    <ImageBackground source={{uri: `${Constants.BASE_URL}CourseImage/${data[2]}`}}//yourPicture}
                    style={styles.courseImage}>
                        <View style={styles.courseOverView}>
                            <Text style={{color: '#ddd', opacity: 1}}>{courseTitle}</Text>
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
            )
        }
    }

    keyExtractor( item ) {
        let key = item.split(":br:")[0]
        return key
    }

  render() {
    return (
      <ScrollView style={{flex: 1, backgroundColor: '#ddd'}}>
        <StatusBar backgroundColor="#612086" barStyle="light-content" />
        <ImageBackground source={require('./../../assets/Images/header.png')}
        style={[styles.headerImage,{width: this.state.width, height: this.state.height}]}>
            <Text style={{ alignSelf: 'center', marginTop: 20, color: '#ddd', fontSize: 30,}}>COURSE{"\n"}LIBRARY</Text>
        </ImageBackground>
        <View style={{flex: 1, padding: 10}}>
            <FlatList 
                initialNumToRender={50}
                maxToRenderPerBatch={60}
                data={this.state.data}
                extraData={this.state}
                keyExtractor={item => this.keyExtractor(item)}
                renderItem={this.renderListItem}/>
        </View>
      </ScrollView>
    )
  }
}

export default CoursesHome