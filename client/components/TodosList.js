import React from 'react';
import { StyleSheet, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { TodosListItem } from './TodosListItem';
import { NewTodoForm } from './NewTodoForm';

const styles = StyleSheet.create({
  todosList: {
    width: '100%',
  },
});

class TodosList extends React.Component {
  renderItem = ({ item: { title, status, id } }) => {
    return <TodosListItem title={title} id={id} status={status} />;
  };

  render() {
    if (this.props.data.loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    console.log(this.props.data);

    return (
      <React.Fragment>
        <NewTodoForm />
        <ScrollView style={styles.todosList}>
          <FlatList
            data={this.props.data.todosList.items}
            renderItem={this.renderItem}
            keyExtractor={({ id }) => id}
          />
        </ScrollView>
      </React.Fragment>
    );
  }
}

const TODOS_LIST_QUERY = gql`
  query TodosList {
    todosList(orderBy: [status_DESC, createdAt_DESC]) {
      items {
        id
        title
        status
      }
    }
  }
`;

TodosList = graphql(TODOS_LIST_QUERY)(TodosList);

export { TodosList };
