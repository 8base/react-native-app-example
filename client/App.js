import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Button,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { EightBaseAppProvider, AuthContext } from '@8base/app-provider';
import { ReactNativeAuth0AuthClient } from '@8base/react-native-auth0-auth-client';

import { LoginForm } from './components/LoginForm';
import { TodosList } from './components/TodosList';

const AUTH0_CLIENT_ID = 'qGHZVu5CxY5klivm28OPLjopvsYp0baD';
const AUTH0_DOMAIN = 'https://auth.8base.com';

const authClient = new ReactNativeAuth0AuthClient({
  clientId: AUTH0_CLIENT_ID,
  domain: AUTH0_DOMAIN,
});

export default class App extends React.Component {
  renderContent = auth => {
    if (!auth.isAuthorized) {
      return <LoginForm auth={auth} />;
    }

    return (
      <React.Fragment>
        <TodosList />
        <Button title="Logout" onPress={auth.purgeAuthState} />
      </React.Fragment>
    );
  };

  render() {
    return (
      <EightBaseAppProvider
        authClient={authClient}
        uri="https://api.8base.com/cjrjafsth000101qqwsw1w792">
        {({ loading }) => {
          if (loading) {
            return <ActivityIndicator />;
          }

          return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
              <SafeAreaView style={styles.container}>
                <AuthContext.Consumer>{this.renderContent}</AuthContext.Consumer>
              </SafeAreaView>
            </KeyboardAvoidingView>
          );
        }}
      </EightBaseAppProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
