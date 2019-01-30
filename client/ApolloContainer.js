import React from 'react';
import * as R from 'ramda';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { withAuth } from '@8base/auth';

import { FragmentsSchemaContainer } from './FragmentsSchemaContainer';

const createAuthLink = getAuthState =>
  setContext((_, { headers }) => {
    const { token } = getAuthState();

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

class ApolloContainer extends React.Component {
  onIdTokenExpired = () => {
    const {
      auth: { setAuthState, checkSession },
    } = this.props;

    return checkSession({}).then(authResult => {
      const token = authResult.idToken;

      setAuthState({ token });
    });
  };

  onAuthError = async () => {
    const {
      auth: { purgeAuthState },
    } = this.props;

    await purgeAuthState();
  };

  getAuthState = () => {
    const {
      auth: { authState },
    } = this.props;

    if (authState) {
      return R.pick(['token', 'workspaceId'])(authState);
    }

    return null;
  };

  createClient = fragmentsSchema => {
    const { uri } = this.props;

    return new ApolloClient({
      link: createAuthLink(this.getAuthState).concat(new HttpLink({ uri })),
      cache: new InMemoryCache({
        fragmentMatcher: new IntrospectionFragmentMatcher({
          introspectionQueryResultData: fragmentsSchema,
        }),
      }),
    });
  };

  renderContent = ({ loading, fragmentsSchema }) => {
    if (loading) {
      return null;
    }

    this.client = this.createClient(fragmentsSchema);

    return <ApolloProvider client={this.client}>{this.props.children}</ApolloProvider>;
  };

  render() {
    const { uri } = this.props;

    return <FragmentsSchemaContainer uri={uri}>{this.renderContent}</FragmentsSchemaContainer>;
  }
}

ApolloContainer = withAuth(ApolloContainer);

export { ApolloContainer };
