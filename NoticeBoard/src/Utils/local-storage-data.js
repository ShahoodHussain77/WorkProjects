import { AsyncStorage } from "react-native";

class LocalStorageData {

    /***
     *  get user email address function
     */
    static async getEmailOrId() {
        let x = await AsyncStorage.getItem('emailOrId');
        console.log('x',x);
        return x
    }

    /***
     *  get any local data function
     */
    getItem(name) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(name)
                .then(res => {
                if (res !== null) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(err => reject(err));
        });
    }
}

export default LocalStorageData