import React from 'react';
import { StyleSheet, SafeAreaView, Button } from 'react-native';
import { AuthContext, AuthProvider } from '@8base/auth';
import { ReactNativeAuth0AuthClient } from '@8base/react-native-auth0-auth-client';

import { TodosList } from './components/TodosList';
import { ApolloContainer } from './ApolloContainer';

const AUTH0_CLIENT_ID = 'lJDVb8s0468eDLucm9bxHGhoTm2DJPfA';
const AUTH0_DOMAIN = 'https://8base-dev.auth0.com';

const authClient = new ReactNativeAuth0AuthClient({
  clientId: AUTH0_CLIENT_ID,
  domain: AUTH0_DOMAIN,
});

export default class App extends React.Component {
  renderContent = auth => {
    if (!auth.isAuthorized) {
      const login = async () => {
        const authData = await auth.authorize();

        await auth.setAuthState({
          token: authData.idToken,
          email: authData.email,
        });
      };

      return <Button title="Login with Auth0" onPress={login} />;
    }

    return <TodosList />;
  };

  render() {
    return (
      <AuthProvider authClient={authClient}>
        <ApolloContainer uri="https://api.8base.com/cjrjafsth000101qqwsw1w792">
          <SafeAreaView style={styles.container}>
            <AuthContext.Consumer>{this.renderContent}</AuthContext.Consumer>
          </SafeAreaView>
        </ApolloContainer>
      </AuthProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
