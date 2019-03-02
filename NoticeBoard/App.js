import {
  createStackNavigator,
  createSwitchNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation';

// default sign up and sign in screens for employer and employee
import DefaultScreen from './src/Utils/default';
import AccountType from './src/Utils/usertype';
import EmpType from './src/components/Default/login/ask_emp';
import Login from './src/components/Default/login/login';
import SignUp from './src/components/Default/registration/employer/signup';
import SignUpTwo from './src/components/Default/registration/employer/signup-step-two';
import SignUpThree from './src/components/Default/registration/employer/signup-step-three';
import EmployerVerification from "./src/components/Default/registration/employer/employer-verification";
import EmployeeRegTwo from "./src/components/Default/registration/employee/employee-signup-step-two";
import EmployeeRegThree from "./src/components/Default/registration/employee/employee-signup-step-three";
import EmployeeVerification from "./src/components/Default/registration/employee/employee-verification";

// user or employer dashboard screen GROUPS, EMPLOYEES, DEPARTMENT
import GroupsTab from './src/components/User/employer/dashboard';
import Profile from './src/components/User/employer/profile';
//import Department from './src/components/User/employer/department';
import Notice from './src/components/User/employer/notice';
import Options from './src/components/User/employer/options';
import GroupNotices from "./src/components/User/employer/send-group-notice";
// settings and creating groups screen
import CreateGroups from "./src/components/User/employer/create-groups";

//employee dashboard 
import EmployeeDashboard from './src/components/User/employee/employee-dashboard';
//import SelectDepartment from './src/components/User/employee/select_department';
import EmployeeAllNotices from './src/components/User/employee/employee-home';
import EmpOptions from './src/components/User/employee/employee-options';
import EmployeeGroupNotices from "./src/components/User/employee/group-notices";

import React from 'react';
import { View, AsyncStorage, Dimensions, Image } from "react-native";
const { width, height } = Dimensions.get('window');

export const name = AsyncStorage.getItem('name');

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

// making groups with groups page
export const Group = createStackNavigator({
  Home: {
    screen: CreateGroups
  }
})

// sending group notice screen
export const GroupNotice = createStackNavigator({
  Home: {
    screen: GroupNotices
  }
})

// employee dashboard
export const EmployeeLogin = createStackNavigator({
  Home: {
    screen: createMaterialTopTabNavigator({
      Home: {
        screen: EmployeeDashboard,
        navigationOptions: {
          tabBarOptions: {
            activeTintColor: '#ddd',
            labelStyle: {
              fontWeight: 'bold',
              fontSize: fontSize,
            },
            style: {
              backgroundColor: '#303952',
            },
            indicatorStyle: {
              backgroundColor: '#ddd',
            },
          },
          tabBarLabel: <Image source={require('./src/assets/icons/chat.png')} style={{height: 24, width: 24, marginBottom: 10}} />,
          tabBarIcon: ({ tintColor }) => (
            <FontAwesome name="home" size={30} color={tintColor} />
          )
        }
      },
      Options: {
        screen: EmpOptions,
        navigationOptions: {
          tabBarOptions: {
            activeTintColor: '#ddd',
            labelStyle: {
              fontWeight: 'bold',
              fontSize: fontSize,
            },
            style: {
              backgroundColor: '#303952',
            },
            indicatorStyle: {
              backgroundColor: '#ddd',
            },
          },
          tabBarLabel: <Image source={require('./src/assets/icons/settings.png')} style={{height: 24, width: 24, marginBottom: 10}} />,
          tabBarIcon: ({ tintColor }) => (
            <FontAwesome name="home" size={30} color={tintColor} />
          )
        }
      }
    }),
    navigationOptions: ({ navigation }) => ({
      title: 'Noticeboard',//this.props.navigation.getParam('email'),
      headerTitleStyle: { color: 'white' },
      headerStyle: {
        backgroundColor: '#303952',
        elevation: 0
      },
      headerRight: (
        <View style={{ height: 50, width: 40}}>
        </View>
      ),
    }),
  }
})
export const EmployeeNotices = createStackNavigator({
  Home: {
    screen: EmployeeAllNotices
  }
})
export const EmployeeGroupNotice = createStackNavigator({
  Home: {
    screen: EmployeeGroupNotices
  }
})

// braodcast notice screen
export const NoticeBoard = createStackNavigator({
  Home: {
    screen: Notice
  }
})

const fontSize = width < 350 ? 10 : 12;
// tabnavigator 
export const SignedIn = createStackNavigator({
  Home: {
    screen: createMaterialTopTabNavigator({
      Home: {
        screen: GroupsTab,
        navigationOptions: {
          swipeEnabled: false,
          tabBarOptions: {
            activeTintColor: '#ddd',
            labelStyle: {
              fontWeight: 'bold',
              fontSize: fontSize,
            },
            style: {
              backgroundColor: '#303952',
            },
            indicatorStyle: {
              backgroundColor: '#ddd',
            },
          },
          tabBarLabel: <Image source={require('./src/assets/icons/chat.png')} style={{height: 24, width: 24, marginBottom: 10}} />,
        }
      },
      Employees: {
        screen: Profile,
        navigationOptions: {
          swipeEnabled: false,
          tabBarOptions: {
            activeTintColor: '#ddd',
            labelStyle: {
              fontWeight: 'bold',
              fontSize: fontSize,
            },
            style: {
              backgroundColor: '#303952',
            },
            indicatorStyle: {
              backgroundColor: '#ddd',
            },
          },
          tabBarLabel: <Image source={require('./src/assets/icons/group.png')} style={{height: 32, width: 32}} />,
        }
      },
      // Department: {
      //   screen: Department,
      //   navigationOptions: {
      //     tabBarOptions: {
      //       activeTintColor: '#ddd',
      //       labelStyle: {
      //         fontWeight: 'bold',
      //         fontSize: fontSize,
      //       },
      //       style: {
      //         backgroundColor: '#303952',
      //       },
      //       indicatorStyle: {
      //         backgroundColor: '#ddd',
      //       },
      //     },
      //     tabBarLabel: <Image source={require('./src/assets/icons/id-card.png')} style={{height: 28, width: 28}} />,
      //   }
      // },
      Options: {
        screen: Options,
        navigationOptions: {
          swipeEnabled: false,
          tabBarOptions: {
            activeTintColor: '#ddd',
            labelStyle: {
              fontWeight: 'bold',
              fontSize: fontSize,
            },
            style: {
              backgroundColor: '#303952',
            },
            indicatorStyle: {
              backgroundColor: '#ddd',
            },
          },
          tabBarLabel: <Image source={require('./src/assets/icons/settings.png')} style={{height: 24, width: 24, marginBottom: 10}} />,
        }
      }
    }),
    navigationOptions: ({ navigation }) => ({
      title: 'Noticeboard',//this.props.navigation.getParam('email'),
      headerTitleStyle: { color: 'white' },
      headerStyle: {
        backgroundColor: '#303952',
        elevation: 0
      },
      headerRight: (
        <View style={{ height: 50, width: 40}}>
        </View>
      ),
    }),
  }
});

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
      Groups: {
        screen: Group
      },
      EmployeeLogin: {
        screen: EmployeeLogin
      },
      Notice: {
        screen: NoticeBoard
      },
      GroupNotice: {
        screen: GroupNotice
      },
      EmployeeGroupNotice: {
        screen: EmployeeGroupNotice
      },
      EmployerVerificationScreen: {
        screen: EmployerVerification
      },
      EmployeeVerificationScreen: {
        screen: EmployeeVerification
      },
      EmployeeBroadcastNotices: {
        screen: EmployeeNotices
      }
    },
    {
      initialRouteName: signedIn === 'employee' ? "EmployeeLogin" : signedIn === 'employer' ? "SignedIn" : "SignedOut"
    }
  )
}