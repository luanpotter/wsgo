import React from 'react';
import {StyleSheet, View} from 'react-native';

import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';


const handler = (cb) => {
    GoogleSignin.configure({scopes: ["https://www.googleapis.com/auth/calendar"], webClientId: '971985852714-qi0ngm24014mit3qv2filqhm6fsmgojl.apps.googleusercontent.com'}).then(() => {
        GoogleSignin.signIn().then(user => {
            cb(user.email, user.accessToken);
        }).catch((error) => {
            console.log(`beacon scanner error: ${error}`);
        });
    });
}

const LoginButton = (props) => {
    return (
        <View style={styles.container}>
            <GoogleSigninButton style={{
                width: 312,
                height: 96
            }} size={GoogleSigninButton.Size.Wide} color={GoogleSigninButton.Color.Dark} onPress={() => handler(props.onUserLogged)}/>
        </View>
    );
}

export {LoginButton, handler};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
