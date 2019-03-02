//import liraries
import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, AsyncStorage, ScrollView, Image, TouchableOpacity, Modal, Picker } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from "./../../Utils/Constants";
// create a component
class GroupsTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            employees: [],
            modalVisible: false,
            groupModalVisible: false,
            departs: [],
            selectedDepartment: 'Select Department',
            groupname: ''
        }
    }

    async componentWillMount() {
        let OwnerID = await AsyncStorage.getItem('OwnerID');
        let email = await AsyncStorage.getItem('emailOrId');
        let logedIn = await AsyncStorage.getItem('isLogedIn');
        if( logedIn && logedIn != '' ) {
            fetch(`${Constants.BASE_URL}noticeboard/get_emp_details.php`,{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                })
            }).then((response) => {
                return response.text();
            }).then((responseJson) => {
                let id = responseJson.split(":")[0];
                let name = responseJson.split(":")[1];
                let designation = responseJson.split(":")[2];
                OwnerID = responseJson.split(":")[0];
                AsyncStorage.setItem('OwnerID',id);
                AsyncStorage.setItem('OwnerName',name);
                AsyncStorage.setItem('designation',designation);
                return( 
                    fetch(`${Constants.BASE_URL}noticeboard/load_company_by_id.php`,{
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: id,
                        })
                    })
                )
            }).then((response) => response.text())
            .then((responseJson) => {
                let cmpID = responseJson.split(":")[0];
                let cmpCode = responseJson.split(":")[1];
                AsyncStorage.setItem('CompanyID',cmpID);
                AsyncStorage.setItem('CompanyCode',cmpCode);
                return(
                    fetch(`${Constants.BASE_URL}noticeboard/get_all_groups.php`,{
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            OwnerID: OwnerID,
                        })
                    })        
                )
            }).then((response) => response._bodyText)
            .then((responseJson) => {
                let obj = responseJson.split("|");
                this.setState({
                    groups: obj
                })
            }).catch((error) => {
                console.log('err',error);
            })
        }
        if( OwnerID && OwnerID != '' ) { 
            fetch(`${Constants.BASE_URL}noticeboard/get_all_groups.php`,{
            // fetch(`${Constants.BASE_URL}${Constants.getAllGroups}`,{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    OwnerID: OwnerID,
                })
            }).then((response) => response._bodyText)
            .then((responseJson) => {
                let obj = responseJson.split("|");
                this.setState({
                    groups: obj
                })
            }).catch((error) => {
                console.log('err',error);
            })
        }
    }

    async groupDetails() {
        this.setState({
            groupModalVisible: true
        })
        let cmpID = await AsyncStorage.getItem('CompanyID');
        fetch(`${Constants.BASE_URL}noticeboard/get_all_employees.php`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cmpID: cmpID,
            })
        }).then((response) => response._bodyText)
        .then((responseJson) => {
            let obj = responseJson.split("|");
            this.setState({
                employees: obj,
                modalVisible: false
            })
        }).catch((error) => {
            console.log('err',error);
        })
    }

    async createGroup() {
        this.setState({
            groupModalVisible: true
        })
        let cmpID = await AsyncStorage.getItem("companyID");
		fetch(`${Constants.BASE_URL}noticeboard/get_all_departments.php`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                companyID: cmpID,
            })
        }).then(( response ) => response.text() )
        .then(( responseJson ) => {
			let arr = responseJson.split("|");
			let items = [];
			arr.map((keys,name) => {
				if( keys != '' ) {
					let key = keys.split(":")[0];
					let value = keys.split(":")[1];
					let obj = {
						"key": key,
						"value": value
					};
					items.push(obj);
				}
			})
			this.setState({
				departs: items,
			})
	    }).catch((error) => {
            console.log('err',error);
        })
    }

    SelectDepartment = (service) => {
		this.setState({
			selectedDepartment: service
		})
    }

    async SaveGroup() {
		let OwnerID = await AsyncStorage.getItem('OwnerID');
		if( OwnerID && OwnerID != '' && this.state.groupname && this.state.groupname != '' && this.state.selectedDepartment != '' && this.state.selectedDepartment != 'Select Department' ) {
			fetch(`${Constants.BASE_URL}noticeboard/create_group.php`,{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					OwnerID: OwnerID,
					groupName: this.state.groupname,
					departmentID: this.state.selectedDepartment
				})
			}).then((response) => response.json())
			.then((responseJson) => {
				if(responseJson === 'saved') {
                    this.setState({
                        groupModalVisible: false
                    })
				}
			}).catch((error) => {
				console.log('error',error);
			})
		}
	}

    render() {
        let picker = this.state.departs.map((key,picID) => {
			let keys = key.key;
			let value = key.value;
			return <Picker.Item key={picID} label={value} value={keys} />
		})

        var items = [];
        {
            this.state.groups.map((key,mapKey) => {
                if( key != '' ) {
                    let keys = key.split(":")[0];
                    items.push(
                        <TouchableOpacity key={key.split(":")[0]} style={styles.cardView} mapKey={mapKey} departID={key.split(":")[2]}
                        onPress={() => console.log('key',keys)}>
                            <View style={styles.imageContainer}>
                                <Image 
                                    resizeMode="contain"
                                    source={require('./../../assets/maju-logo.jpg')}
                                    style={styles.logo}/>
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={[styles.label, styles.departName ]}>{key.split(":")[1]}</Text>
                                <Text style={styles.label}>MEMBERS</Text>
                            </View>
                            <View >
                                <Icon style={styles.arrrow} name="md-menu" size={20} color="#ddd" />
                            </View>
                        </TouchableOpacity>
                    )
                }
            })
        }
        var allEmployees = [];
        {
            this.state.employees.map((key,mapKey) => {
                console.log('key',key);
                if( key != '' ) {
                    let keys = key.split(":")[0];
                    allEmployees.push(
                        <TouchableOpacity key={key.split(":")[0]} style={{marginTop: 20, marginLeft: 10}} mapKey={mapKey} departID={key.split(":")[2]}
                        onPress={() => this.groupDetails(keys)}>
                            <View style={styles.textContainer}>
                                <Text style={[styles.label, styles.departName ]}>{key.split(":")[1]}</Text>
                                <Text style={styles.label}>{key.split(":")[2]}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }
            })
        }

        return(
            <View style={styles.contianer}>

                {
                    // Scroll of all departments added by employer
                }
                <ScrollView style={{flex:1}}>
                    <TouchableOpacity style={styles.broadCastButton}
                    onPress={() => this.props.navigation.navigate('Notice')}>
                        <View style={{flexDirection: 'row'}}>
                            <Icon style={{color: '#000'}} name="md-menu" size={20} color="#ddd" />
                            <Text style={[styles.broadCastText, {flex:1, marginLeft: 20}]}>SEND BROADCAST MESSAGE</Text>
                        </View>
                    </TouchableOpacity>
                { items }
                </ScrollView>

                {
                    // Setting floating action button
                }
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({
                            modalVisible: false
                        })
                    }}>
                    <View style={{backgroundColor: '#1c1c26'}}>
                        <Text style={{color: '#ddd', padding: 20, fontSize: 18}}>SELECT EMPLOYEES </Text>
                    </View>
                    <ScrollView style={{backgroundColor: '#1c1c26'}}>
                        {
                            allEmployees
                        }
                    </ScrollView>
                </Modal>
                
                {
                    // button for opening create department
                }
                <TouchableOpacity activeOpacity={1} 
                    onPress={() => this.groupDetails()}
                    style={styles.TouchableOpacityStyle} >
                    <Image source={require('./../../assets/Floating_Button.png')}
                        style={styles.FloatingButtonStyle} />
                </TouchableOpacity>

                {
                    // modal for creating groups
                }
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.groupModalVisible}
                    onRequestClose={() => {
                        this.setState({
                            groupModalVisible: false
                        })
                    }}>
                    <View style={styles.contianer}>
                        {/* <View style={styles.pickerContainer}>
                            <Picker selectedValue={this.state.selectedDepartment} onValueChange={(service) => this.SelectDepartment(service)} mode="dropdown">
                                <Picker.Item label="Select Department"/>
                                {
                                    picker
                                }
                            </Picker>
                        </View> */}
                        <TextInput 
                            placeholder="Enter Group Name"
                            onChangeText={(event) => this.SetGroupName(event)}
                            style={styles.inputFields}
                            returnKeyType={"done"}
                            blurOnSubmit={false}
                            placeholderTextColor="#ddd" />
                            <ScrollView >
                                {
                                    allEmployees
                                }
                            </ScrollView>
                        <TouchableOpacity
                            onPress={this.SaveGroup.bind(this)}
                            style={styles.savebutton}>
                            <Text style={styles.buttonText}>SAVE</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
          </View>
        )
    }
}

// define your styles
const styles = StyleSheet.create({
    contianer: {
        flex: 1,
        backgroundColor: '#1C1C26',
    },
    cardView: {
        height: 100,
        margin: 10,
        flexDirection: 'row',
        backgroundColor: '#1C1C26',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    },
    imageContainer: {
        margin: 10,
        justifyContent: 'center'
    },
    logo: {
        borderRadius: 50,
        width: 70,
        height: 70,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 5,
    },
    label: {
        color: '#ddd'
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
    departName: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    modalContainer: {
        backgroundColor: '#ddd'
    },
    pickerContainer: {
		backgroundColor: '#ddd'
	},
	inputFields: {
		marginTop: 10,
        color: '#ddd',
        fontSize: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        marginBottom: 10
	},
	savebutton: {
		borderColor: '#ddd',
		borderWidth: 1,
		borderRadius: 50,
		height: 50,
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 22,
		fontWeight: 'bold',
		alignSelf: 'center',
		color: '#ddd'
    },
    broadCastButton: {
        backgroundColor: '#ddd',
        width: '100%',
        padding: 20,
    },
    broadCastText: {
        color: '#1c1c26',
    }
});

//make this component available to the app
export default GroupsTab;
