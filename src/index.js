import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers} from 'redux';
import { Provider, connect } from 'react-redux';
import marked from 'marked';

marked.setOptions({breaks:true});

//Messages Code
const UPDATE = 'UPDATE';

const updateMessage = (newMessage) => {
  return {
    type: UPDATE,
    markdown: newMessage,
  }
}

const defaultMessage = {
  markdown: `
This is a h1 header
================

This is a h2 subheader
-------------------

[This is a link](#)

This is sample inline code, \`<h3>hello</h3>\`, between two backticks.

    <p>This is a sample code block</p>

- This is a list item

> This is a sample blockquote

![React logo](https://dwglogo.com/wp-content/uploads/2017/09/1460px-React_logo.png)

**This is sample bolded text.**
`,
};

const messageReducer = (state = defaultMessage, action) => {
  let newState = Object.assign({},state);
  switch (action.type) {
    case UPDATE:
      newState.markdown = action.markdown;
      return newState;
    default:
      return state;
    }
};

const rootReducer = combineReducers({
  msg: messageReducer,
}); 

const store = createStore(rootReducer);

class Presentational extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
        }
    }
    handleChange = (event) => {
        this.props.updateNewMessage(event.target.value);
        this.setState({
            input: event.target.value
        });
    }
    render() {
        return (
          <div>
            <h1>Markdown Previewer</h1>
            <h2>Type in Your Markdown Text:</h2>
            <textarea rows='10' cols='100' id='editor'
              value={this.props.messages.markdown}
              onChange={this.handleChange}/><br/>
            <div id='preview' dangerouslySetInnerHTML={{__html:marked(this.props.messages.markdown)}}></div>
          </div>
        );
    }
};

const mapStateToProps = (state) => {
  return {
    messages: state.msg,
  }
};
      
const mapDispatchToProps = (dispatch) => {
  return {
    updateNewMessage: (newMessage) => {
      dispatch(updateMessage(newMessage))
    },
  }
};

const Container = connect(mapStateToProps, mapDispatchToProps)(Presentational);

class AppWrapper extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Container/>
      </Provider>
   );
  }
};

ReactDOM.render(
    <AppWrapper />,
    document.getElementById('root')
);