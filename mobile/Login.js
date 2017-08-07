import React from 'react';
import {StyleSheet, View, ToastAndroid } from 'react-native';

import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';


const loginHandler = (cb) => {
    GoogleSignin.configure({scopes: ["https://www.googleapis.com/auth/calendar"], webClientId: '971985852714-qi0ngm24014mit3qv2filqhm6fsmgojl.apps.googleusercontent.com'}).then(() => {
        GoogleSignin.signIn().then(user => {
            cb(user.email, user.accessToken);
        }).catch(error => {
            console.error(`google login error: ${error}`);
            ToastAndroid.show(`There was an error on login: ${error}`, ToastAndroid.LONG);
            setTimeout(() => loginHandler(cb), 500);
        });
    }).catch(error => {
        console.error(`google config error: ${error}`);
        ToastAndroid.show(`There was an error on login config: ${error}`, ToastAndroid.LONG);
        setTimeout(() => loginHandler(cb), 500);
    });
}

const LoginButton = (props) => {
    return (
        <View style={styles.container}>
            <GoogleSigninButton style={{
                width: 312,
                height: 96
            }} size={GoogleSigninButton.Size.Wide} color={GoogleSigninButton.Color.Dark} onPress={() => loginHandler(props.onUserLogged)}/>
        </View>
    );
}

export {LoginButton, loginHandler};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
