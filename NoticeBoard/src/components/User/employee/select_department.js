import React, { Component } from 'react'
import { Text, View, ScrollView, AsyncStorage, StyleSheet, TouchableOpacity } from 'react-native'

class SelectDepartment extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props)
    
        this.state = {
            departments: [],
            select: ''
        }
    }

    async componentWillMount() {
        let cmpID = await AsyncStorage.getItem('CompanyID');
        console.log(cmpID);
        fetch('http://192.168.10.21/noticeboard/load_department.php',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                companyID: cmpID,
            })
        }).then((response) => response.text())
        .then((responseJson) => {
            let arr = responseJson.split("|");
			let items = [];
			arr.map((keys,name) => {
				if( keys != '' ) {
					let deptid = keys.split(":")[0];
					let deptname = keys.split(":")[1];
					let obj = {
						"key": deptid,
						"value": deptname
					};
					items.push(obj);
                }
                this.setState({
                    departments: items
                })
			})
        })
    }

    selectDepartment(keys) {
        this.setState({
            select: keys
        })
    }

    async updateEmployeeDepartment() {
        let empID = await AsyncStorage.getItem('empID');
        console.log('empID ',empID);
        fetch('http://192.168.10.20/noticeboard/update_department.php',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                empID: empID,
                dID: this.state.select
            })
        }).then((response) => response )
        .then((responseJson) => {
            console.log('respoinse',responseJson);
            this.props.navigation.navigate('EmployeeLogin');
        })
    }

    render() {
        let allDeparts = this.state.departments.map((key,mapID) => {
            let keys = key.key;
            let value = key.value;
			return(
                <TouchableOpacity key={mapID} deptID={keys} 
                    style={styles.row}
                    onPress={() => this.selectDepartment(keys)}>
                    <View style={styles.textView}>
                        <Text style={{color: '#ddd', fontSize: 16, flex: 1}}>{value}</Text>
                        <Text style={{color: '#ddd', fontSize: 12}}>
                            {
                                this.state.select == keys ? 'SELECTED' : ''
                            }
                        </Text>
                    </View>
                </TouchableOpacity>
            )
		})

        return (
            <View style={{flex: 1, padding: 10, backgroundColor: '#1c1c26',}}>
                <View style={{paddingTop: 10, paddingBottom: 10, backgroundColor: '#1c1c26',}}>
                    <Text style={{color: '#ddd', fontSize: 16}}>Please Select Department</Text>
                </View>
                <ScrollView style={styles.container}  contentContainerStyle={{flexGrow:1}}>
                    {
                        allDeparts
                    }
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.finsihButton}
                    onPress={this.updateEmployeeDepartment.bind(this)}>
                        <Text style={{color: '#ddd'}}>SAVE</Text>
                    </TouchableOpacity>                    
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C26'
    },
    row: {
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: 'rgba(220,220,220,0.3)',
        borderBottomWidth: 1,
    },
    textView: {
        flexDirection: 'row'
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    finsihButton: {
        height: 50,
        width: '105.5%',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
    }
})
export default SelectDepartment