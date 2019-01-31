import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'cookies-js';
import NavMenuItem from './NavMenuItem';
import { getAuth } from '../../axiosWrappers/users';
import IncomingCallModal from '../IncomingCallModal';
import CallingModal from '../CallingModal';
import history from '../../history';
import { translate } from 'react-polyglot';
import Tooltip from 'rc-tooltip';
import mp3 from '../../sounds/calling.mp3';
import { axiosPost } from '../../axiosWrappers';
// Import Style


// Import Components

// Import Actions

class NavMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clear: false,
    };
  }

  editClear = (clear) => {
    this.setState({clear});
  }

  setListeners = () => {
    this.props.socket.on('message_users', (messageUsers) => {
      this.props.initMessageUsers(messageUsers);
    });
    this.props.socket.on('created_talk', (data) => {
      const talk = data.talk;
      talk.tags = data.tags;
      this.props.initCurrentTalk(talk, true);
    });
    this.props.socket.on('abort_call', () => {
      this.props.clearCurrentTalk();
      this.editClear(true);
    });
    this.props.socket.on('answer_call', () => {
      this.props.toggleSeen();
      this.props.startCalling(null);
      this.editClear(true);
      history.push('/talk');
    });
    this.props.socket.on('message_user_new', (data) => {
      this.props.addMessageUser(data.messageUser);
      history.push(`/messages/${this.props.searchUser._id}/${data.talk}`);
    })
    this.props.socket.on('incoming_call', (data) => {
      const talk = data.talk;
      talk.tags = data.tags;
      if (!this.props.talk.hasOwnProperty('_id')) {
        this.props.socket.emit('incoming_call', { messageUser: talk.messageUser });
        this.props.initCurrentTalk(talk, false);
        try {
          let audio = new Audio(mp3);
          let count = 0;
          let timeout = setInterval(() => {
            if(count === 6) {
              clearInterval(timeout);
              this.props.socket.emit('abort_call_client', { messageUser: talk.messageUser })
            }
            audio.play();
            count++;
          }, 7000);
        }
        catch (err) {
          
        }
      }
    });
    this.props.socket.on('message', (message) => {
      if (this.props.messageUsers.length > 0) {
        this.props.addMessage(message, message.messageUser);
      }
    });
    this.props.socket.on('messages', (messageUser) => {
      messageUser.messages.forEach((message) => {
        this.props.unshiftMessage(message, messageUser._id);
      });
    });
  }
  componentDidMount() {
    const token = cookie.get('token');
    const redirect = cookie.get('redirect');
    if (token) {
      this.props.initToggleUser(token);
      this.setupListenersAndEverything(redirect);
    } else {
      window.addEventListener('setupToken', this.tokenEventListener);
    }
    
  }
  tokenEventListener = (e) => {
    this.setupListenersAndEverything();
    window.removeEventListener('setupToken', this.tokenEventListener);
  }

  setupListenersAndEverything (redirect) {
      getAuth((res) => {
        this.props.initSocket(res.data.token);
        this.props.initUser(res.data);
        this.setListeners();
        this.props.socket.emit('get_message_users', { part: 0 });
        if (redirect) {
          history.push(redirect);
        }
      }, (err) => {
        this.props.initToggleUser(null);
      });
  }
  componentWillUnmount () {
    window.removeEventListener('setupToken', this.tokenEventListener);
  }

  render() {
    if (this.props.user.token) {
      return (
        <React.Fragment>
          <nav className="nav">
            <Tooltip placement="bottomLeft" trigger={['hover']} overlay={this.props.t('nav.users')}>
              <NavMenuItem location="/users" locationName="Users" />
            </Tooltip>
            <Tooltip placement="bottomLeft" trigger={['hover']} overlay={this.props.t('nav.messages')}>
              <NavMenuItem location="/messages/0/false" locationName="Messages" />
            </Tooltip>
            <Tooltip placement="bottomLeft" trigger={['hover']} overlay={this.props.t('nav.profile')}>
              <NavMenuItem location="/profile" locationName="Profile" />
            </Tooltip>
            <Tooltip placement="bottomLeft" trigger={['hover']} overlay={this.props.t('nav.settings')}>
              <NavMenuItem location="/settings" locationName="Settings" />
            </Tooltip>
          </nav>
          <IncomingCallModal opened={!this.props.seen && this.props.talk.hasOwnProperty('_id')} />
          <CallingModal clearState={this.state.clear} editClear={this.editClear} opened={this.props.talkMu !== null} messageUser={this.props.talkMu} />
        </React.Fragment>
      );
    }
    return null;
  }
}

// Retrieve data from store as props
const mapStateToProps = state => ({
  user: state.userData.user,
  searchUser: state.search.user,
  socket: state.io.socket,
  seen: state.talk.seen,
  talk: state.talk.talk,
  talkMu: state.talk.messageUser,
  p2p: state.io.p2p,
  messageUsers: state.messages.messageUsers,
  messageUser: state.messages.user
});
/* eslint-disable */
const mapDispatchToProps = (dispatch) => {
  return {
    initToggleUser: (user) => dispatch({
      type: 'TOGGLE_INIT_USER',
      user,
    }),
    initUser: (user) => dispatch({
      type: 'INIT_USER',
      user,
    }),
    initSocket: (token) => dispatch({
      type: 'INIT_SOCKET',
      userToken: token
    }),
    toggleSeen: () => dispatch({
      type: 'SEEN_TALK'
    }),
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
    addMessageUser: (messageUser) => dispatch({
      type: 'ADD_MESSAGE_USER',
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

export default translate()(connect(mapStateToProps, mapDispatchToProps)(NavMenu));
