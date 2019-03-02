//import liraries
import { createRootNavigator } from '../../../../App';
import { isSignedIn } from "../../../../authentication/authentication";
import React, { Component } from 'react';

// create a component
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            signedIn: false,
            checkedSignIn: false,
            usertype: ''
        };
    }

    // checking if user as already logedin 
    componentDidMount() {
        isSignedIn()
            .then((res) => {
                if( res === 'employee' ) {
                    this.setState({ usertype: res, checkedSignIn: true })
                } else if( res === 'employer' ) {
                    this.setState({ usertype: res, checkedSignIn: true })
                } else {
                    this.setState({ signedIn: res, checkedSignIn: true })
                }
            })
            .catch(err => alert("An error occurred"));
    }

    render() {

        const { checkedSignIn, signedIn } = this.state;

        // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
        if (!checkedSignIn) {
            return null;
        } else {
            if(this.state.usertype === 'employee') {
                const Layout = createRootNavigator(this.state.usertype);
                return <Layout />
            } else if(this.state.usertype === 'employer') {
                const Layout = createRootNavigator(this.state.usertype);
                return <Layout />
            } else {
                const Layout = createRootNavigator(signedIn);
                return <Layout />
            }
        }
    }
}

//make this component available to the app
export default App;
