import React from 'react';
import { StyleSheet, TextInput, View, Keyboard, Button, Image } from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const styles = StyleSheet.create({
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: 16,
  },
  loginFormLogo: {
    width: 188,
    height: 59,
    marginBottom: 32,
  },
  loginFormButton: {
    backgroundColor: '#FF5722',
    color: '#000',
  },
});

class LoginForm extends React.Component {
  login = async () => {
    const { auth } = this.props;

    const authData = await auth.authorize();

    await auth.setAuthState({
      token: authData.idToken,
      email: authData.email,
    });
  };

  render() {
    return (
      <View style={styles.loginForm}>
        <Image style={styles.loginFormLogo} source={require('../assets/logo.png')} />
        <Button style={styles.loginFormButton} title="Login with Auth0" onPress={this.login} />
      </View>
    );
  }
}

export { LoginForm };
