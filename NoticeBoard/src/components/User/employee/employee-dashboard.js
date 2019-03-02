//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, AsyncStorage, FlatList, TouchableOpacity, Image } from 'react-native';
import Constants from "../../../Utils/Constants";
import Statusbar from "./../../statusbar";
import Loader from "./../../../Utils/activity-indicator";

// create a component
class EmployeeDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            isLoading: false
        }
    }

    async componentWillMount() {
        let cmpID = await AsyncStorage.getItem('CompanyID');
        let empID = await AsyncStorage.getItem('EmployeeID');
        if( cmpID && cmpID != '' && empID && empID != '' ) { 
            this.setState({isLoading: true})
            fetch(`${Constants.BASE_URL}get_all_employee_groups.php`,{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cmpID: cmpID,
                    empID: empID
                })
            }).then((response) => response.text())
            .then((responseJson) => {
                if(responseJson == "TWO"){
                    this.setState({
                        groups: []
                    })
                }
                else{
                    let obj = responseJson.split("|");
                    this.setState({
                        groups: obj
                    })
                }
                this.setState({isLoading: false})
            }).catch((error) => {
                this.setState({isLoading: false})
                console.log('err',error);
            })
        }
    }

    renderListItem = ({item}) => {
        if( this.state.groups && this.state.groups.length > 1 ) {
            if( item && item != '' && undefined != item ) {
                let details = item.split(":");
                return(
                    <TouchableOpacity style={styles.employeeView}
                    onPress={() => {
                        AsyncStorage.setItem('GroupID', details[0]);
                        AsyncStorage.setItem('ReplyEnable', details[3]);
                        this.props.navigation.navigate('EmployeeGroupNotice')
                    }}>
                        <Image source={require('./../../../assets/icons/user.png')} style={styles.groupIcon}/>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text style={[styles.text, {fontSize: 16, fontWeight: 'bold'}]}>{details[1]}</Text>
                            <Text style={[styles.text, {fontSize: 16, opacity: 0.7}]}>{details[2]} members</Text>
                        </View>
                        {
                            details && details[3] == '0' ? 
                            <Image source={require('./../../../assets/icons/locked.png')} style={styles.lockIcon}/>
                            :
                            <Image source={require('./../../../assets/icons/unlocked.png')} style={styles.lockIcon}/>
                        }
                    </TouchableOpacity>
                )
            }
        } else {
            <TouchableOpacity style={styles.employeeView}
            onPress={() => console.log('key',details[0])}>
                <Text style={[styles.text, {fontSize: 16, fontWeight: 'bold'}]}>No Groups Found</Text>
            </TouchableOpacity>
        }
	}

    render() {
        return(
            <View style={styles.contianer}>
                <Statusbar />
                <Loader loading={this.state.isLoading} />
                {/* // open braodcast notice screen */}
                <TouchableOpacity style={styles.broadCastButton}
                onPress={() => this.props.navigation.navigate('EmployeeBroadcastNotices')}>
                    <View style={{flexDirection: 'row'}}>
                        <Image source={require('./../../../assets/icons/broadcast_logo.png')} style={styles.broadCastImage}/>
                        <Text style={styles.broadCastText}>BROADCAST NOTICES </Text>
                    </View>
                </TouchableOpacity>
                <View style={{flex:1}}>
					<FlatList 
					initialNumToRender={50}
					maxToRenderPerBatch={60}
					data={this.state.groups} 
					extraData={this.state}
					keyExtractor={item => item.split(":")[0]}
					ItemSeparatorComponent={this.renderSeparator}
					renderItem={this.renderListItem}/>
				</View>
          </View>
        )
    }
}

// define your styles
const styles = StyleSheet.create({
    contianer: {
        flex: 1,
        backgroundColor: '#ddd'//'#1C1C26',
    },
    TouchableOpacityStyle:{ 
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
    },
    FloatingButtonStyle: {
        resizeMode: 'contain',
        width: 60,
        height: 60,
    },
    broadCastButton: {
        backgroundColor: '#ddd',
        width: '100%',
        padding: 15,
        borderBottomColor: '#1c1c26',
        borderBottomWidth: 0.5,
    },
    broadCastText: {
        fontSize: 18,
        color: '#1c1c26',
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    broadCastImage: {
        marginRight: 10,
        alignSelf: 'center',
        width: 40,
        height: 40,
    },
    employeeView: {
        padding: 15,
        backgroundColor: '#ddd',
        borderColor: '#1c1c26',
        borderBottomWidth: 0.4,
        flexDirection: 'row'
    },
    text: {
        color: '#1c1c26',
    },
    lockIcon: {
        alignSelf: 'center',
        width: 16,
        height: 16
    },
    groupIcon: {
        marginRight: 10,
        alignSelf: 'center',
        width: 40,
        height: 40
    }
});

//make this component available to the app
export default EmployeeDashboard;