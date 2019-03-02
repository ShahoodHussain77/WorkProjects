import {
  createStackNavigator,
  createSwitchNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation';
// default sign up and sign in screens for employer and employee
import DefaultScreen from './src/components/Default/default';
import AccountType from './src/components/usertype';
import EmpType from './src/components/Default/ask_emp';
import Login from './src/components/login';
import SignUp from './src/components/signup';
import SignUpTwo from './src/components/signup-step-two';
import SignUpThree from './src/components/signup-step-three';
import EmployeeRegTwo from "./src/components/Default/registration/employee-signup-step-two";
import EmployeeRegThree from "./src/components/Default/registration/employee-signup-step-three";

// user dashboard screen GROUPS, EMPLOYEES, DEPARTMENT
import GroupsTab from './src/components/User/dashboard';
import Profile from './src/components/User/profile';
import Department from './src/components/User/department';
import Notice from './src/components/User/owner/notice';

//employee dashboard 
import EmployeeDashboard from './src/components/User/employee/employee-dashboard';
import SelectDepartment from './src/components/User/employee/select_department';
import EmployeeHome from './src/components/User/employee/employee-home';

import React from 'react';
import { Picker, View, AsyncStorage } from "react-native";
// settings and creating groups screen
import Settings from "./src/components/User/profile/settings";
import Groups from "./src/components/User/groups/create-groups";

export const name = AsyncStorage.getItem('name');


var config = {
    apiKey: "AIzaSyCVlp4zy38VGi-OaTzfOE8Xc0JVykw3120",
    authDomain: "notification-cf9a8.firebaseapp.com",
    databaseURL: "https://notification-cf9a8.firebaseio.com",
    projectId: "notification-cf9a8",
    storageBucket: "",
    messagingSenderId: "45610608895"
};

export const SignedOut = createStackNavigator({

  Home: {
    screen: DefaultScreen,
  },
  SignIn: {
    screen: Login
  },
  AccountType: {
    screen: AccountType
  },
  AskUser: {
    screen: EmpType
  },
  SignUpStepOne: {
    screen: SignUp
  },
  SignUpStepTwo: {
    screen: SignUpTwo
  },
  SignUpStepThree: {
    screen: SignUpThree
  },
  EmpSignUpStepTwo: {
    screen: EmployeeRegTwo
  },
  EmployeeRegThree: {
    screen: EmployeeRegThree
  }
});

// creating setting page with stack navigator
export const Setting = createStackNavigator({
  Home: {
    screen: Settings
  }
})

// making groups with groups page
export const Group = createStackNavigator({
  Home: {
    screen: Groups
  }
})

// making groups with groups page
export const EmployeeSignedIn = createStackNavigator({
  Home: {
    screen: EmployeeDashboard
  },
  SelectDeparts: {
    screen: SelectDepartment
  }
})

export const EmployeeLogin = createStackNavigator({
  Home: {
    screen: EmployeeHome
  }
})

export const NoticeBoard = createStackNavigator({
  Home: {
    screen: Notice
  }
})

// tabnavigator 
export const SignedIn = createStackNavigator({
  Home: {
    screen: createMaterialTopTabNavigator({
      Home: {
        screen: GroupsTab,
        navigationOptions: {
          tabBarOptions: {
            activeTintColor: '#ddd',
            labelStyle: {
              fontWeight: 'bold',
              fontSize: 12,
            },
            style: {
              backgroundColor: '#303952',
            },
            indicatorStyle: {
              backgroundColor: '#ddd',
            },
          },
          tabBarLabel: "GROUPS",
          tabBarIcon: ({ tintColor }) => (
            <FontAwesome name="home" size={30} color={tintColor} />
          )
        }
      },
      Employees: {
        screen: Profile,
        navigationOptions: {
          tabBarOptions: {
            activeTintColor: '#ddd',
            labelStyle: {
              fontWeight: 'bold',
              fontSize: 12,
            },
            style: {
              backgroundColor: '#303952',
            },
            indicatorStyle: {
              backgroundColor: '#ddd',
            },
          },
          tabBarLabel: "EMPLOYEES",
          tabBarIcon: ({ tintColor }) => (
            <FontAwesome name="user" size={30} color={tintColor} />
          )
        }
      },
      Department: {
        screen: Department,
        navigationOptions: {
          tabBarOptions: {
            activeTintColor: '#ddd',
            labelStyle: {
              fontWeight: 'bold',
              fontSize: 12,
            },
            style: {
              backgroundColor: '#303952',
            },
            indicatorStyle: {
              backgroundColor: '#ddd',
            },
          },
          tabBarLabel: "DEPARTMENT",
          tabBarIcon: ({ tintColor }) => (
            <FontAwesome name="user" size={30} color={tintColor} />
          )
        }
      }
    }),
    navigationOptions: ({ navigation }) => ({
      title: 'NoticeBoard',//this.props.navigation.getParam('email'),
      headerTitleStyle: { color: 'white' },
      headerStyle: {
        backgroundColor: '#303952',
        elevation: 0
      },
      headerRight: (
        <View style={{ height: 50, width: 40}}>
          <Picker
            selectedValue=""
            style={{ }}
            mode="dropdown"
            onValueChange={(itemValue, itemIndex) => navigateTo(itemValue,navigation) }>
            <Picker.Item label="hello" value="" style={{color: '#ddd'}} />
            <Picker.Item label="SETTINGS" value="java" style={{color: '#ddd'}} />
            <Picker.Item label="padasdas" value="js" />
            <Picker.Item label="JavaScript" value="profile" />
          </Picker>
        </View>
      ),
    }),
  }
});

// header options navigation function to navigate seperate rootnavigator
navigateTo = (itemValue,navigation) => {
  if(itemValue === 'profile') {
    navigation.navigate('Setting')
  }
}

// setting rootnavigator to check user state for login and logout
export const createRootNavigator = (signedIn = false) => {
  return createSwitchNavigator(
    {
      SignedIn: {
        screen: SignedIn
      },
      SignedOut: {
        screen: SignedOut
      },
      Setting: {
        screen: Setting
      },
      Groups: {
        screen: Group
      },
      EmployeeSignedIn: {
        screen: EmployeeSignedIn
      },
      EmployeeLogin: {
        screen: EmployeeLogin
      },
      Notice: {
        screen: NoticeBoard
      }
    },
    {
//      initialRouteName: signedIn
       initialRouteName: signedIn === 'employee' ? "EmployeeLogin" : signedIn === 'employer' ? "SignedIn" : "SignedOut"

    }
  )
}