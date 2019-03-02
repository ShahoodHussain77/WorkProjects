import React, { Component } from 'react'
import { Modal, AsyncStorage, TextInput, Text, View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'

export class Department extends Component {
    static navigationOptions = { header: null };

    constructor(props) {
      super(props)
    
      this.state = {
        modalVisible: false,
        department: '',
        departs: []
      }
    }

    async componentWillMount() {
        let cmpID = await AsyncStorage.getItem("companyID");
        this.getDepartments(cmpID);
    }

    // fetching all departments by company id
    getDepartments = (code) => {
        fetch('http://192.168.10.3/noticeboard/get_all_departments.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                companyID: code,
            })
        }).then(( response ) => response.text() )
        .then(( responseJson ) => {
            let obj = responseJson.split("|");
            this.setState({
                departs: obj
            })
        }).catch((error) => {
            console.log('err',error);
        })
    }

    // setting modal visiblity true or false
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    async saveDepartment() {
        let cmp_code = await AsyncStorage.getItem('companyID');
        if( this.state.department != '' ) {
            fetch('http://192.168.10.3/noticeboard/save_department.php',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    department: this.state.department,
                    companyID: cmp_code,
                })
            }).then((response) => response.json())
            .then((responseJson) => {
                this.getDepartments(cmp_code);
                this.setModalVisible(!this.state.modalVisible);
            }).catch((error) => {
                console.log(error);
                this.setModalVisible(!this.state.modalVisible);
            })    
        } else {
            this.setModalVisible(!this.state.modalVisible);
        }
    }

    render() {
        var items = [];
        {
            this.state.departs.map((key,name) => {
                if( key != '' ) {
                    items.push(
                        <View key={key.split(":")[0]} style={styles.cardView} mapKey={name}>
                            <View style={styles.imageContainer}>
                                <Image 
                                    resizeMode="contain"
                                    source={require('./../../assets/maju-logo.jpg')}
                                    style={styles.logo}/>
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={[styles.label, styles.departName]}>{key.split(":")[1]}</Text>
                                <Text style={styles.label}>MEMBERS</Text>
                            </View>
                        </View>  
                    )
                }
            })
        }
    return (
      <View style={styles.contianer}>

        {
            // Scroll of all departments added by employer
        }
        <ScrollView style={{flex:1}}>
           { items && items.length > 0 ? items : <Text style={{fontSize: 18, color: '#ddd'}}>DEPARTMENTS WILL APPEAR HERE</Text>}
        </ScrollView>

        {
            // Setting modal container to get department name
        }
        <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
                alert('Modal has been closed.');
            }}>
            <View style={styles.modalContainer}>
                <View style={styles.modal}>
                    <View style={styles.headingContainer}>
                        <Text style={styles.headingText}>Enter Department Name</Text>
                    </View>
                    <View style={{borderBottomColor: '#ddd', borderBottomWidth: 1}}></View>
                    <TextInput 
                        onChangeText={(event) => this.setState({ department: event })}
                        style={styles.inputFields}
                        placeholderTextColor="#ddd"
                        placeholder="Enter Department Name"/>
                    <View style={styles.buttons}>
                        <TouchableOpacity 
                            style={[styles.buttonsBorder, styles.doneButton ]}
                            onPress={ this.saveDepartment.bind(this)}>
                            <Text style={{fontSize: 18}}>DONE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.buttonsBorder, styles.cancelButton]}
                            onPress={() => {
                                this.setModalVisible(!this.state.modalVisible);
                            }}>
                            <Text style={{fontSize: 18}}>CANCEL</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
      
        {
            // Setting floating action button
        }
        <TouchableOpacity activeOpacity={1} 
            onPress={() => {
                this.setModalVisible(true);
            }}
            style={styles.TouchableOpacityStyle} >
            <Image source={require('./../../assets/Floating_Button.png')}
                style={styles.FloatingButtonStyle} />
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    modal: {
        backgroundColor: '#576574',
        width: '100%',
        height: '40%'
    },
    headingContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    headingText: {
        color: '#ddd',
        fontSize: 28
    },
    inputFields: {
        margin: 10,
        color: '#ddd',
        fontSize: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        marginBottom: 10
    },
    buttons: {
        flex: 1,
        alignItems: 'center'
    },
    buttonsBorder: {
        width: '90%',
        borderWidth: 1,
        borderRadius: 50,
        borderColor: '#ddd',
        alignItems: 'center',
        margin: 5,
    },
    doneButton: {
        backgroundColor: 'lightblue'
    },
    cancelButton: {
        backgroundColor: 'orange'
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
    departName: {
        fontSize: 24,
        fontWeight: 'bold'
    }
})

export default Department