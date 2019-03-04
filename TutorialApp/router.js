import { createStackNavigator, createSwitchNavigator} from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

// signin and signup screencomponents
import SignIn from "./src/components/default/signin";

// user main screen components
import CoursesHome from "./src/components/User/Courses_Home";
import ProjectsHome from "./src/components/User/Projects_Home";
import NewsHome from './src/components/User/News_Home';
import CourseDetails from "./src/components/User/Courses_Details";

// setting route config for tabs
const TabsRouteConfigs = {
  Courses: {
    screen: CoursesHome
  },
  Projects: {
    screen: ProjectsHome
  },
  NewsAndUpdates: {
    screen: NewsHome
  },
  News: {
    screen: NewsHome
  },
}
// setting material tabs stylesconfig
const MaterialBottomTabNavigatorConfig = {
  initialRouteName: 'Courses',
  shifting: true,
  activeColor: '#f0edf6',
  inactiveColor: '#3e2465',
  barStyle: { backgroundColor: '#694fad' },
  lazy: true,
}
export const MainTabs = createMaterialBottomTabNavigator(TabsRouteConfigs, MaterialBottomTabNavigatorConfig)

export const MainScreen = createStackNavigator(
  {
    Default: {
      screen: SignIn
    },
    CourseDetails: {
      screen: CourseDetails
    },
  },
  {
    headerMode: 'none',
  }
)

export const createRootNavigator = (signedIn = false) => {
  return createSwitchNavigator(
    {
      SignedIn: {
        screen: MainTabs
      },
      SignedOut: {
        screen: MainScreen
      },
    },
    {
      initialRouteName: signedIn == 'MainTabs' ? "SignedIn" : "SignedOut"
    }
  )
}
// export const App = createAppContainer(MainScreen)