import React, { Component } from 'react'
import { Text, TouchableOpacity, View, StyleSheet, AsyncStorage, Picker, TextInput } from 'react-native'

export default class Groups extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Notice Board',
        headerTitleStyle: { color: 'white' },
        headerStyle: {
          backgroundColor: '#303952',
          elevation: 7
        }
    })
  
    constructor(props) {
      super(props)
    
      this.state = {
		departs: [],
		selectedDepartment: 'Select Department',
		groupname: ''
      }
    }

    async componentWillMount() {
        let cmpID = await AsyncStorage.getItem("companyID");
		fetch('http://192.168.10.6/noticeboard/get_all_departments.php', {
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
			fetch('http://192.168.10.6/noticeboard/create_group.php',{
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
					this.props.navigation.navigate('SignedIn');
				}
			}).catch((error) => {
				console.log('error',error);
			})
		}
	}

	SetGroupName(event) {
		this.setState({
			groupname: event
		})
	}

    render() {
		let picker = this.state.departs.map((key,picID) => {
			let keys = key.key;
			let value = key.value;
			return <Picker.Item key={picID} label={value} value={keys} />
		})
		return (
			<View style={styles.contianer}>
				<View style={styles.pickerContainer}>
					<Picker selectedValue={this.state.selectedDepartment} onValueChange={(service) => this.SelectDepartment(service)} mode="dropdown">
						<Picker.Item label="Select Department"/>
						{
							picker
						}
					</Picker>
				</View>
				<TextInput 
					placeholder="Enter Group Name"
					onChangeText={(event) => this.SetGroupName(event)}
					style={styles.inputFields}
					returnKeyType={"done"}
					blurOnSubmit={false}
					placeholderTextColor="#ddd" />
				<View style={{flex:1}}></View>
				<TouchableOpacity
				onPress={this.SaveGroup.bind(this)}
				style={styles.savebutton}>
					<Text style={styles.buttonText}>SAVE</Text>
				</TouchableOpacity>
				<View style={{height: 20}}></View>
				<TouchableOpacity
				onPress={() => this.props.navigation.navigate('SignedIn')}
				style={styles.savebutton}>
					<Text style={styles.buttonText}>CANCEL</Text>
				</TouchableOpacity>
			</View>
		)
    }
}

const styles = StyleSheet.create({
    contianer: {
        flex: 1,
        backgroundColor: '#1C1C26',
        padding: 10,
	},
	pickerContainer: {
		backgroundColor: '#ddd'
	},
	inputFields: {
		marginTop: 20,
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
	}
})