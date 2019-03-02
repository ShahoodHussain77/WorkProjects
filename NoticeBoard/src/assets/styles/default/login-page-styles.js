import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	maincontainer: {
		flex: 1,
		backgroundColor: '#1C1C26',
	},
	header: {
		marginTop: 20,//height > 750 ? 40 : 20,
	},
	viewContainer: {
		flex: 1,
//		height: (height * 2) / 3,
		height: height-20,
		paddingLeft: 20,
		paddingRight: 20,
	},
	imageContainer: {
		marginTop: 30,//height < 600 ? 20 : 50,
		alignItems: 'center',
		marginBottom: 30
	},
	logo: {
		width: '100%',
		height: 55,
	},
	form: {
		flex: 1,
//		justifyContent: 'center'
	},
	input: {
	},
	inputFields: {
		color: '#ddd',
		fontSize: 20,
		color: '#FFC107',
		borderBottomWidth: 1,
		borderBottomColor: '#E0E0E0',
		marginBottom: 5
	},
	forgetPassword: {
		marginTop: 20,
	},
	buttonSection: {
//		flex: 1,
//		height: height / 3,
		position: 'absolute',
		bottom:0,
		justifyContent: 'flex-end',
	},
	signUp: {
		marginTop: 10,
		marginBottom: 10
	},
	signupText: {
		textAlign: 'center',
		alignSelf: 'center',
		color: '#ddd',
		fontSize: 14
	},
	passwordText: {
		alignSelf: 'center',
		color: '#838383',
		fontSize: 14
	},
	login: {
		alignSelf: 'center',
		height: 60,
		width: width,
		backgroundColor: '#337388',
		justifyContent: 'center',
	},
	loginText: {
		fontWeight: 'bold',
		textAlign: 'center',
		color: 'white',
		fontSize: 15
	},
});

export default styles