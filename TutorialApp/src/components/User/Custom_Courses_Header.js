import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../styles/Courses_Details_Header_styles';
import Icon from 'react-native-vector-icons/Ionicons';

export default class CoursesHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.Header}>
        <TouchableOpacity style={styles.backIcon}
        onPress={this.props.onPress}>
            <Icon size={20} name={ 'md-arrow-back' } style={{color: '#ddd'}} />
        </TouchableOpacity>
        <Text style={styles.titleText}> {this.props.title} </Text>
      </View>
    );
  }
}
