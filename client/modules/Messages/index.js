import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserSelection from './components/UserSelection';
import Chatbox from './components/Chatbox';

// Import Style


// Import Components

// Import Actions

class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [], // Current user's messages
      user: this.props.user,
      filteredTags: this.props.tags,
      filter: ''
    };
  }
  openMessagesIfRouteUser () {
    return this.props.messageUsers.find(mu => {
      if (mu.participants.length == 2) {
        let foundAuth = false;
        let foundUser = false;
        mu.participants.forEach(par => {
          if (par._id === this.props.authUser._id) {
            foundAuth = true;
          }
          if (par._id === this.props.match.params.id) {
            foundUser = true;
          }
        });
        return foundAuth && foundUser;
      }
      return false;
    });
  }
  componentDidMount() {
    if (this.props.match.params.id !== '0') {
      const chosenUser = this.openMessagesIfRouteUser();
      if (this.props.match.params.talking === 'true') {
        this.props.startCalling(chosenUser._id);
      } else {
        this.onSelect(chosenUser);
      }
    }
  }
  onSelect = (messageUser, newMsgs) => {
    this.props.initMessageUser(messageUser);
    this.props.socket.emit('seen_messages', { messages: newMsgs });
  }

  render() {
    return (
      <div className="container fluid center offset-15 height-60">
        <UserSelection onSelect={this.onSelect}/>
        <Chatbox disabledInput={this.props.user.participants.filter(part => part !== null).length < 2} messages={this.props.user !== undefined && this.props.user.hasOwnProperty('messages') ? this.props.user.messages : []} />
      </div>
    );
  }
}

// Retrieve data from store as props
const mapStateToProps = state => ({
  messageUsers: state.messages.messageUsers,
  authUser: state.userData.user,
  user: state.messages.user,
  socket: state.io.socket
});
/* eslint-disable */
const mapDispatchToProps = (dispatch) => {
  return {
    initMessages: (messages) => dispatch({
      type: 'INIT_MESSAGES',
      messages,
    }),
    initMessageUsers: (messageUsers) => dispatch({
      type: 'INIT_MESSAGE_USERS',
      messageUsers
    }),
    initMessageUser: (messageUser) => dispatch({
      type: 'INIT_MESSAGE_USER',
      messageUser
    }),
    addMessage: (message, user) => dispatch({
      type: 'ADD_MESSAGE',
      message,
      user
    }),
    unshiftMessage: (message, user) => dispatch({
      type: 'UNSHIFT_MESSAGE',
      message,
      user
    }),
    initMessages: (messages, user) => dispatch({
      type: 'INIT_MESSAGES',
      messages,
      user
    }),
    initCurrentTalk: (talk, seen) => dispatch({
      type: 'INIT_TALK', 
      talk,
      seen
    }),
    startCalling: (messageUser) => dispatch({
      type: 'START_CALLING',
      messageUser
    }),
    clearCurrentTalk: () => dispatch({
      type: 'CLEAR_TALK'
    })
  };
};
/* eslint-enable */

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
