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
  loginFormEmailInput: {
    height: 64,
    borderRadius: 4,
    paddingRight: 16,
    paddingLeft: 16,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
  },
  loginFormPasswordInput: {
    height: 64,
    borderRadius: 4,
    paddingRight: 16,
    paddingLeft: 16,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
  },
  loginFormButton: {
    backgroundColor: '#FF5722',
    color: '#000',
  },
});

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { email: null, password: null };
  }

  onChangeEmail = email => {
    this.setState({ email });
  };

  onChangePassword = password => {
    this.setState({ password });
  };

  onLogin = async () => {
    const { email, password } = this.state;

    let err = null;

    try {
      const res = await this.props.login({
        variables: {
          data: { email, password },
        },
      });

      await this.props.auth.setAuthState({
        token: res.data.userLogin.auth.idToken,
        email,
      });
    } catch (e) {
      console.log(e);
      err = e;
    }

    if (!err) {
      Keyboard.dismiss();

      this.reset();
    }
  };

  reset = () => {
    this.setState({ title: null });
  };

  render() {
    return (
      <View style={styles.loginForm}>
        <Image style={styles.loginFormLogo} source={require('../assets/logo.png')} />
        <TextInput
          style={styles.loginFormEmailInput}
          onChangeText={this.onChangeEmail}
          value={this.state.email}
          placeholder="Enter email"
        />
        <TextInput
          style={styles.loginFormPasswordInput}
          onChangeText={this.onChangePassword}
          value={this.state.password}
          placeholder="Enter password"
          secureTextEntry
        />
        <Button title="Login" onPress={this.onLogin} primary />
      </View>
    );
  }
}

const USER_LOGIN_QUERY = gql`
  mutation Login($data: UserLoginInput!) {
    userLogin(data: $data) {
      auth {
        idToken
      }
      workspaces {
        workspace
      }
    }
  }
`;

LoginForm = graphql(USER_LOGIN_QUERY, {
  name: 'login',
})(LoginForm);

export { LoginForm };
