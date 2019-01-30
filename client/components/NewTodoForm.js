import React from 'react';
import { StyleSheet, TextInput, View, Keyboard, Button } from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const styles = StyleSheet.create({
  newTodoForm: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 16,
    borderColor: '#EDEDED',
    borderBottomWidth: 1,
  },
  newTodoFormInput: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingRight: 8,
    paddingLeft: 8,
    flex: 1,
    marginRight: 16,
  },
  newTodoFormButton: {
    backgroundColor: '#FF5722',
    color: '#000',
  },
});

class NewTodoForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { title: null };
  }

  onChangeTitle = title => {
    this.setState({ title });
  };

  onCreateTodo = async () => {
    const { title } = this.state;

    let err = null;

    try {
      await this.props.todoCreate({
        variables: {
          data: { title },
        },
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
      <View style={styles.newTodoForm}>
        <TextInput
          style={styles.newTodoFormInput}
          onChangeText={this.onChangeTitle}
          value={this.state.title}
          placeholder="Enter todo title"
        />
        <Button title="Create Todo" onPress={this.onCreateTodo} primary />
      </View>
    );
  }
}

const TODO_CREATE_MUTATION = gql`
  mutation TodoCreate($data: TodoCreateInput!) {
    todoCreate(data: $data) {
      id
      title
      status
    }
  }
`;

NewTodoForm = graphql(TODO_CREATE_MUTATION, {
  name: 'todoCreate',
  options: {
    refetchQueries: ['TodosList'],
  },
})(NewTodoForm);

export { NewTodoForm };
