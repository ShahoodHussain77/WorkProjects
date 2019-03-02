//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, AsyncStorage, FlatList, Image, TouchableOpacity } from 'react-native';
import Constants from "../../../Utils/Constants";
import Statusbar from "./../../statusbar";
import { SwipeRow } from 'react-native-swipe-list-view';
import Loader from "./../../../Utils/activity-indicator";

// create a component
class GroupsTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            isLoading: false
        }
        this.getAllGroups = this.getAllGroups.bind(this);
        this.component = [];
        this.selectedRow;
    }

    componentWillMount() {
        this.getAllGroups();
    }

    async getAllGroups() {
        let cmpID = await AsyncStorage.getItem('CompanyID');
        if( cmpID && cmpID != '' ) { 
            this.setState({isLoading: true})
            fetch(`${Constants.BASE_URL}get_all_groups.php`,{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cmpID: cmpID,
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

    groupReply(groupID) {
        fetch(`${Constants.BASE_URL}enable_group_reply.php`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                groupID: groupID,
            })
        }).then((response) => response.text())
        .then((responseJson) => {
            if(responseJson == "TWO") {}
            else {
                this.selectedRow.closeRow();
                this.getAllGroups();
            }
        }).catch((error) => {
            console.log('err',error);
        })
    }

    renderListItem = ({item}) => {
        if( this.state.groups && this.state.groups.length > 1 ) {
            if( item && item != '' && undefined != item ) {
                let details = item.split(":");
                return(
                    <SwipeRow rightOpenValue={-75} closeOnRowPress={true}
                    friction={10}
                    ref={(c) => { this.component[details[0]] = c }}
                    onRowOpen={() => {
                        if (this.selectedRow && this.selectedRow != this.component[details[0]]) { this.selectedRow.closeRow(); }
                        this.selectedRow = this.component[details[0]]
                    }}
                    preview={true}
                    previewDuration={100}>
                        {
                        details && details[3] == '0' ? 
                        <View style={styles.unlockReply}>
                            <Text></Text>
                            <TouchableOpacity
                            onPress={() => this.groupReply(details[0])}>
                                <Text style={[styles.backTextWhite,{opacity: 0.7}]}>Enable{"\n"}Reply</Text>
                            </TouchableOpacity>
                        </View> : 
                        <View style={styles.lockReply}>
                            <Text></Text>
                            <TouchableOpacity 
                            onPress={() => this.groupReply(details[0])}>
                                <Text style={[styles.backTextWhite,{opacity: 0.7}]}>Disable{"\n"}Reply</Text>
                            </TouchableOpacity>
                        </View>
                        }
                        <TouchableOpacity style={styles.employerView}
                        activeOpacity={0.8}
                        onPress={() => {
                            AsyncStorage.setItem('GroupID', details[0]);
                            this.props.navigation.navigate('GroupNotice')
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
                    </SwipeRow>
                )
            }
        }
	}

    render() {
        return(
            <View style={styles.contianer}>
                <Statusbar />
                <Loader loading={this.state.isLoading} />
                {/* // open braodcast notice screen */}
                <TouchableOpacity style={styles.broadCastButton}
                onPress={() => this.props.navigation.navigate('Notice',{navigation: this.props.navigation})}>
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
					renderItem={this.renderListItem}/>
				</View>
                {/* // Setting floating action button */}
                <TouchableOpacity activeOpacity={1} 
                    onPress={() => this.props.navigation.navigate('Groups')}
                    style={styles.TouchableOpacityStyle} >
                    <Image source={require('./../../../assets/images/FB.png')}
                        style={styles.FloatingButtonStyle} />
                </TouchableOpacity>
          </View>
        )
    }
}

// define your styles
const styles = StyleSheet.create({
    contianer: {
        flex: 1,
        backgroundColor: '#ddd',
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
    employerView: {
        padding: 15,
        backgroundColor: '#ddd',
        borderColor: '#1c1c26',
        borderBottomWidth: 0.4,
        flexDirection: 'row'
    },
    text: {
        color: '#1c1c26',
    },
    unlockReply: {
        alignItems: 'center',
        backgroundColor: '#414963',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
    },
    lockReply: {
        alignItems: 'center',
        backgroundColor: '#414963',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
    },
    backTextWhite: {
        textAlign: 'center',
        fontSize: 14,
        color: '#FFF',
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
export default GroupsTab;
