import React, { Component } from 'react'
const { width, height } = Dimensions.get('window');
import { StyleSheet, ScrollView,Dimensions, Text, View, Button, TextInput } from 'react-native'

export default class KeyBoard extends Component {
  render() {
    return (
      <ScrollView style={styles.container} >
          
		  <View style={styles.goBack}>
        	<Text> textInComponent </Text>
          </View>
		  
		  <View style={styles.registerHeader}>
			<View style={{flex: 1}}>
				<Text style={{fontSize: 38}}>Register</Text>
			</View>
			<View style={styles.steps}>
				<Text><Text style={{fontSize: 32}}>1</Text>/2</Text>
				<Text>steps</Text>
			</View>
		  </View>
		  
		  <View style={styles.inputs}>
			<TextInput placeholder="email"/>
			<TextInput placeholder="password"/>
			<TextInput placeholder="confirm password"/>
			<TextInput placeholder="email"/>
			<TextInput placeholder="password"/>
			<TextInput placeholder="confirm password"/>
			<TextInput placeholder="email"/>
			<TextInput placeholder="password"/>
			<TextInput placeholder="confirm password"/>

		  </View>
		  <View style={{flex:1, width: width}}>
		  	<Button title="yes">Hello</Button>
		  </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		borderColor: 'blue',
		borderWidth: 2,
	},
	goBack: {
		borderWidth: 1,
		borderColor: 'pink'
	},
	registerHeader: {
		flexDirection: 'row',
		borderWidth: 1,
		borderColor: 'green'
	},
	inputs: {
		borderWidth: 1,
		borderColor: 'red'
	},
	steps: {
		borderWidth: 1,
		borderColor: 'purple'
	}
});