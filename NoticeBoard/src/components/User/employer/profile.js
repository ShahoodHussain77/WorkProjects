//import liraries
import React, { Component } from 'react';
import { Text, View, StyleSheet,TextInput, AsyncStorage, FlatList, TouchableOpacity, Image} from 'react-native';
import Constants from "./../../../Utils/Constants";

// create a component
class Profile extends Component {

    constructor(props) {
        super(props)

        this.state = {
            allEmployes: []
        }
        this.searchEmployee = this.searchEmployee.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderSeparator = this.renderSeparator.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.arrayholder = [];
    }

    async componentWillMount() {
        fetch(`${Constants.BASE_URL}get_all_employees.php`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cmpID: await AsyncStorage.getItem('CompanyID'),
            })
        }).then((Response) => Response.text())
        .then((responseJson) => {
            // console.log('responseJson',responseJson)
            if( responseJson != 'no employees found' && responseJson != '' ) {
                let data = responseJson.split("|");
                AsyncStorage.setItem("AllEmployees",JSON.stringify(data));
                this.setState({
                    allEmployes: data
                })
                this.arrayholder = data;
            }
        })
    }

    renderItem({item}) {
        if( item && item != '' && undefined != item ) {
            // console.log('item',item)
            let details = item.split(":");
            return(
                <View style={styles.employeeView}
                key={details[0]}>
                    <Image style={styles.gear} source={require('./../../../assets/icons/user_verified.png')}/>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={[styles.text, {fontSize: 18, fontWeight: 'bold'}]}>{details[1].toUpperCase()}</Text>
                        <Text style={[styles.text, {fontSize: 16, opacity: 0.7}]}>{details[2]}</Text>
                    </View>
                    <TouchableOpacity style={styles.viewGear}>
                        {/* <Image style={styles.gear} source={require('./../../../assets/images/settings.png')}/> */}
                    </TouchableOpacity>
                </View>
            )
        }
    }

    renderSeparator() {
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

    searchEmployee(event) {
        let employees = this.arrayholder.filter((item) => {
            let name = item.split(":")[1];
            return String(name).includes(event)
        })
        console.log('employees',employees)
        this.setState({
            allEmployes: employees
        })
    }

    renderHeader() {
        return (
            <View style={styles.inputView}>
                <Image style={styles.search} source={require('./../../../assets/images/search.png')}/>
                <TextInput 
                onChangeText={this.searchEmployee}
                style={styles.searchInput}
                placeholder="Search people..."
                placeholderTextColor="#ddd"
                autoCorrect={false}/>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList 
                ListHeaderComponent={this.renderHeader}
                initialNumToRender={50}
                maxToRenderPerBatch={60}
                data={this.state.allEmployes} 
                extraData={this.state}
                keyExtractor={item => item.split(":")[0]}
                ItemSeparatorComponent={this.renderSeparator}
                renderItem={this.renderItem}/>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1c26',
    },
    inputView: {
        flexDirection: 'row',
        height: 40,
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 0.5,
        borderRadius: 50,
        borderColor: '#ddd',
        borderWidth: 0.7,
        borderBottomColor: '#555',
        alignItems: 'center',
        padding: 0,
        paddingLeft: 15,
        overflow: 'hidden',
    },
    search: {
        height: 16,
        width: 16,
        resizeMode: 'stretch',
        alignItems: 'center',
    },
    searchInput: {
        width: '100%',
        color: '#ddd',
        fontSize: 14,
        marginLeft: 10,
    },
    employeeView: {
        padding: 10,
        flexDirection: 'row'
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
    gear: {
        marginRight: 10,
        alignSelf: 'center',
        width: 40,
        height: 40
    }
});

//make this component available to the app
export default Profile;
