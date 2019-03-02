import { AsyncStorage } from "react-native";

export const USER_KEY = "auth-demo-key";

export const onSignIn = (emp) => AsyncStorage.setItem(USER_KEY, emp);

export const onSignOut = () => (
  AsyncStorage.multiRemove([
    USER_KEY,
    'emailOrId',
    'isLogedIn',
    'OwnerName',
    'designation',
    'CompanyCode',
    'CompanyID',
    'OwnerID',
    'empID',
    'EmployeeName',
    'CompanyName',
    'userType',
    'isEmployer',
    'OwnerDesignation',
    'OwnerNumber',
    'EmployeeDesignation',
    'EmployeeNumber',
    'AllEmployees',
  ],(error) => {
      console.log('error',error);
      console.log('asd',AsyncStorage.getAllKeys())
    }
  )
)

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(USER_KEY)
      .then(res => {
        if (res !== null && res === 'employee') {
          resolve('employee');
        } else if( res === 'employer' ) {
          resolve('employer');
        } else {
          resolve(false)
        }
      })
      .catch(err => reject(err));
  });
};
