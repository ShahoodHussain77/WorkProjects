/** @format */
global.___DEV___ = false;
console.disableYellowBox = true;
console.reportErrorsAsExceptions = false;
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './src/components/Default/login/login-status';
import KeyBoard from './keyboardavoiding';


AppRegistry.registerComponent(appName, () => App);
