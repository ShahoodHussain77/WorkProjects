import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, AppState, Image, AsyncStorage } from 'react-native'
import Constants from "./../../../Utils/Constants";

class EmployeeHome extends Component {
    static navigationOptions = ({
        title: 'NoticeBoard',
        headerTitleStyle: { color: 'white' },
        headerStyle: {
          backgroundColor: '#303952',
          elevation: 7
        }
    })

    constructor(props) {
        super(props)

        this.state = {
            allMessages: [],
            path: ''
        }
        this.handleAppStateChange = this.handleAppStateChange.bind(this);
    }

    async componentWillMount() {
        let email = await AsyncStorage.getItem('emailOrId');
        fetch(`${Constants.BASE_URL}noticeboard/get_all_notices.php`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email
            })
        }).then(( response ) => response.text())
        .then(( responseJson ) => {
            responseJson = responseJson.split("|");
            let mess = this.state.allMessages.concat(responseJson)
//            console.log('responseJson',responseJson);
            this.setState({
                allMessages: mess
            })
        }).catch((errorMessage, statusCode) => {
            // error handling
            console.log('errorMessage,',errorMessage,'statusCode',statusCode);
        })
    }

    componentDidMount = () => {
        AppState.addEventListener('change', this.handleAppStateChange);
    };
    
    componentWillUnmount = () => {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }
    
    handleAppStateChange(appState) {
        if( appState === 'backgournd' ) {
            // sending notification
        }
    }

    render() {
        let items = [];
        this.state.allMessages.map((data,key) => {
            data = data.split(":");
            console.log('data',data);
            if(data.length > 1) {
                let path = data[2] != '' ? data[2].split(".") : '';
                if( path[1] == 'jpg' ) {
                    let imageUrl = data[2];
                    imageUrl = `${Constants.BASE_URL}noticeboard/${imageUrl}`;
                    items.push (
                        <View style={ styles.innerContainer } key={key}>
                            <View style={styles.cardView} >
                            { 
                                imageUrl != '' ? <Image source={{uri: imageUrl}} style={styles.ImageStyle} /> : <Text style={styles.cardText}>{data[1]}</Text> 
                            }
                            </View>
                            <View style={{marginTop: 5, marginBottom: 5, alignSelf: 'center'}}>
                                <Text style={{color: '#ddd', fontSize: 12}}>date</Text>
                            </View>
                        </View>
                    )
                } else {
                    items.push (
                        <View style={ styles.innerContainer } key={key}>
                            <View style={styles.cardView} >
                                <Text style={styles.cardText}>{data[1]}</Text>
                            </View>
                            <View style={{marginTop: 5, marginBottom: 5, alignSelf: 'center'}}>
                                <Text style={{color: '#ddd', fontSize: 12}}>date</Text>
                            </View>
                        </View>
                    )
                }
            }
        })
        return (
            <View style={{flex: 1}}>
                <ScrollView style={styles.container}>
                    {
                        items
                    }
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1c1c26',
    },
    innerContainer: {
        flex: 1,
    },
    cardView: {
        backgroundColor: '#ddd',
        borderWidth: 1,
        padding: 15,
        borderRadius: 10,
        marginRight: 10,
        marginLeft: 10,
        elevation: 4,
    },
    cardText: {
        fontSize: 14
    },
    ImageStyle: {
        width: 100,
        height: 100,
        alignSelf: 'center'
    }
})

export default EmployeeHome