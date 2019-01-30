import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const styles = StyleSheet.create({
  todosListItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    padding: 16,
    borderColor: '#EDEDED',
  },
  todosListItemTitle: {
    display: 'flex',
    flex: 1,
    color: '#212121',
  },
  todosListItemStatus: {
    display: 'flex',
    flex: 1,
    color: '#212121',
  },
  todosListItemDelete: {
    marginRight: 16,
  },
});

class TodosListItem extends React.Component {
  onDelete = () => {
    const { id } = this.props;

    this.props.todoDelete({ variables: { filter: { id } } });
  };

  onDone = () => {
    const { id } = this.props;

    this.props.todoUpdate({ variables: { data: { id, status: 'Done' } } });
  };

  onUndone = () => {
    const { id } = this.props;

    this.props.todoUpdate({ variables: { data: { id, status: 'To Do' } } });
  };

  render() {
    const { title, status } = this.props;

    return (
      <View style={styles.todosListItem}>
        <Text style={styles.todosListItemTitle}>{title}</Text>
        <Text style={styles.todosListItemStatus}>{status}</Text>
        <Button
          title="Delete"
          color="#F44336"
          onPress={this.onDelete}
          style={styles.todosListItemDelete}
          danger
        />
        {status === 'To Do' ? (
          <Button title="Done" color="#4CAF50" onPress={this.onDone} success />
        ) : (
          <Button title="Undone" color="#757575" onPress={this.onUndone} light />
        )}
      </View>
    );
  }
}

const TODO_DELETE_MUTATION = gql`
  mutation todoDelete($filter: TodoKeyFilter) {
    todoDelete(filter: $filter, force: true) {
      success
    }
  }
`;

const TODO_UPDATE_MUTATION = gql`
  mutation todoUpdate($data: TodoUpdateInput!) {
    todoUpdate(data: $data) {
      id
    }
  }
`;

TodosListItem = compose(
  graphql(TODO_DELETE_MUTATION, {
    name: 'todoDelete',
    options: {
      refetchQueries: ['TodosList'],
    },
  }),
  graphql(TODO_UPDATE_MUTATION, {
    name: 'todoUpdate',
    options: {
      refetchQueries: ['TodosList'],
    },
  })
)(TodosListItem);

export { TodosListItem };
