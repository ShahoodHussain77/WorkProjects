import React, { Component } from 'react'
import { Text, Dimensions, TouchableOpacity, BackHandler, View, StyleSheet, AsyncStorage, TextInput, FlatList, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from "../../../Utils/Constants";
import Toast from 'react-native-easy-toast'
import Loader from '../../../Utils/activity-indicator';
import CheckBox from 'react-native-check-box'
import Statusbar from "./../../statusbar";
const { width, height } = Dimensions.get('window');

export default class CreateGroups extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Noticeboard',
				headerTitleStyle: { flex: 1, color: 'white', textAlign: 'center'},
        headerStyle: {
          backgroundColor: '#303952',
          elevation: 7
		},
		headerLeft: (
				<TouchableOpacity onPress={() => navigation.navigate('SignedIn')}
				style={{ padding: 10 }}>
					<Icon name="md-arrow-round-back" size={20} color="#ddd" />
				</TouchableOpacity>
		),
		headerRight: (
			<View></View>
		),
    })
  
    constructor(props) {
		super(props)
		
		this.state = {
			employees: [],
			isChecked: [],
			selectedEmployeesLists: [],
			groupname: '',
			isLoading: false
		}
		this.SaveGroup = this.SaveGroup.bind(this);
    }

    async componentWillMount() {
		AsyncStorage.getItem("AllEmployees")
		.then(emploeesArray => JSON.parse(emploeesArray))
		.then(jsonArray => {
			this.setState({
				employees: jsonArray
			})
		})
		.catch(error => console.log('errpr',error));
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
	}

	componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

	handleBackButton = () => {
        this.props.navigation.navigate('SignedIn');
        return true;
    }

	async SaveGroup() {
		let cmpID = await AsyncStorage.getItem("CompanyID");
		let groupEmployees = this.state.selectedEmployeesLists.map(item => {
			return item.split(":")[0];
		})
		if( cmpID && cmpID != '' && this.state.groupname && this.state.groupname != '' ) {
			this.setState({
				isLoading: true
			})
			fetch(`${Constants.BASE_URL}create_group.php`,{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					groupName: this.state.groupname,
					cmpID: cmpID,
					groupEmployees: groupEmployees
				})
			}).then((response) => response.json())
			.then((responseJson) => {
				if(responseJson === 'ONE') {
					this.setState({
						isLoading: false
					})
					this.props.navigation.navigate('SignedIn');			
				} else {
					this.setState({
						isLoading: false
					})
					this.refs.toast.show(
						<View style={{width: width-20}}>
							<Text style={{color: '#ddd', alignSelf: 'center'}}>Unable to create group</Text>
						</View>, 2000, () => {
						// something you want to do at close
					});
				}
			}).catch((error) => {
				console.log('error',error)
				this.setState({
					isLoading: false
				})
				this.refs.toast.show(
					<View style={{width: width-20}}>
						<Text style={{color: '#ddd', alignSelf: 'center'}}>Network request failed</Text>
					</View>, 2000, () => {
					// something you want to do at close
				});
			})
		} else {
			this.setState({
				isLoading: false
			})
			this.refs.toast.show(
				<View style={{width: width-20}}>
					<Text style={{color: '#ddd', alignSelf: 'center'}}>Please enter group name</Text>
				</View>, 2000, () => {
				// something you want to do at close
			});
		}
	}

	renderListItem = ({item, index}) => {
		if( item && item != '' && undefined != item ) {
			let details = item.split(":");
			return(
				<View style={styles.employeeView}
				key={details[0]}>
					<Text style={[styles.text, {fontSize: 16, fontWeight: 'bold'}]}>{details[1].toUpperCase()}</Text>
					<View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
						<Text style={[styles.text, {fontSize: 16}]}>{details[3]}</Text>
					</View>
					<CheckBox 
					style={styles.viewGear}
					isChecked={this.state.isChecked[index]}
					onClick={() => this.isIconCheckedOrNot(item,index)}
					checkedImage={<Image source={require('./../../../assets/images/checked.png')} style={{width: 15, height: 15}}/>}
					unCheckedImage={<Image source={require('./../../../assets/images/uncheck.png')} style={{width: 15, height: 15}}/>}
					/>
				</View>
			)
		}
	}

    isIconCheckedOrNot = (item,index) => {
		let { isChecked,selectedEmployeesLists} = this.state;
		isChecked[index] = !this.state.isChecked[index];
		this.setState({ isChecked : isChecked});
		if(isChecked[index] == true){
			selectedEmployeesLists.push(item)
		}else {
			selectedEmployeesLists.pop(item)
		}
	}

	renderSeparator = () => {
        return (
          <View
            style={{
                height: 0.7,
                width: "100%",
                backgroundColor: "#555",
                alignSelf: 'center'
            }}
          />
        );
    };

	SetGroupName(event) {
		this.setState({
			groupname: event
		})
	}

    render() {
		return (
			<View style={styles.contianer}>
				<Loader loading={this.state.isLoading}/>
				<Statusbar />
				<TextInput 
					placeholder="Enter Group Name"
					onChangeText={(event) => this.SetGroupName(event)}
					style={[styles.inputFields, styles.employeeView]}
					returnKeyType={"done"}
					blurOnSubmit={true}
					placeholderTextColor="#ddd" />
				<View style={{flex:1}}>
					<FlatList 
					initialNumToRender={50}
					maxToRenderPerBatch={60}
					data={this.state.employees} 
					extraData={this.state}
					keyExtractor={item => item.split(":")[0]}
					ItemSeparatorComponent={this.renderSeparator}
					renderItem={this.renderListItem}/>
				</View>
				<TouchableOpacity
				onPress={this.SaveGroup}
				style={styles.contianerButton}>
					<Text style={styles.buttonText}> CREATE GROUP </Text>
				</TouchableOpacity>
				<Toast 
				ref="toast"
				position="bottom"
				style={{backgroundColor:'#ee5253'}}/>
			</View>
		)
    }
}

const styles = StyleSheet.create({
    contianer: {
        flex: 1,
        backgroundColor: '#1C1C26',
	},
	inputFields: {
        color: '#ddd',
        fontSize: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ddd',
	},
	contianerButton: {
		backgroundColor: '#337388',
		height: 60,
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 18,
		fontWeight: 'bold',
		alignSelf: 'center',
		color: '#ddd'
	},
	employeeView: {
        padding: 10,
    },
    text: {
        color: '#ddd',
    },
    viewGear: {
        height: 69,
        width: 30,
        position: 'absolute',
        right: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
})