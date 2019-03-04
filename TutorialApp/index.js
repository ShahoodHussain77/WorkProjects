/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import Home from './src/components/User/home';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Home);
