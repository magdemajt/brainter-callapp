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
import { Link, withRouter } from 'react-router-dom';
import { axiosPost } from '../../axiosWrappers';
// Import Style


// Import Components

// Import Actions

class NavMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clear: false,
      talkModal: false,
    };
    this.answeredCount = 0;
    this.hasListeners = false;
    this.timeout = null;
  }
  editClear = (clear) => {
    this.setState({clear});
  }
  editTalkModal = (talkModal) => {
    this.setState({talkModal});
  }

  clearTalk = () => {
    try {
      this.props.p2p.send(JSON.stringify({ type: 'END_CALL' }));
      this.props.p2p.destroy();
    } catch (e) {

    }
    this.props.socket.emit('finish_call_client', { talk: this.props.talk });
    this.props.socket.emit('change_blackboard', { talk: this.props.talk, blackboardText: this.props.blackboardText });
  }

  setListeners = () => {
    this.props.socket.on('message_users', (messageUsers) => {
      this.props.initMessageUsers(messageUsers);
    });
    this.props.socket.on('created_talk', (data) => {
      const talk = data.talk;
      talk.tags = data.tags;
      talk.participants = data.participants;
      this.answeredCount = 0;
      this.props.initCurrentTalk(talk, true);
      this.props.initMessageUser({ _id: talk.messageUser, messages: data.messages, participants: data.participants });
      history.push('/talk');
    });

    this.props.socket.on('received_peer', (data) => {
      this.props.addPeer({ user: data.user, peer: data.peer });
    });

    this.props.socket.on('abort_call', (data) => {
      if (this.props.talk.caller === this.props.user._id) {
        this.props.clearCurrentTalk();
        this.editClear(true);
      }
      this.editTalkModal(false);
      clearInterval(this.timeout);
    });
    this.props.socket.on('answer_call', (data) => {
      if (this.props.talk.caller === this.props.user._id || this.props.user._id === data._id) {
        console.log('executed')
        this.editTalkModal(false);
        clearInterval(this.timeout);
        history.push('/talk');
      }
      this.editClear(true);
      this.props.startCalling(null);
    });
    this.props.socket.on('message_user_new', (data) => {
      this.props.addMessageUser(data.messageUser);
      history.push(`/messages/${this.props.searchUser._id}/${data.talk}`);
    });

    this.props.socket.on('user_not_active', ({user}) => {
      this.props.userNotActive(user);
      if (this.props.talk.hasOwnProperty('_id') && this.props.messageUsers.find(mu => { return mu._id === this.props.talk.messageUser && mu.participants.find(part => part._id === user) !== undefined }) !== undefined) {
        this.clearTalk();
      }
    });

    this.props.socket.on('user_active', ({user}) => {
      this.props.userActive(user);
    });

    this.props.socket.on('incoming_call', (data) => {
      const talk = data.talk;
      talk.tags = data.tags;
      talk.participants = data.participants;
      if (!this.props.talk.hasOwnProperty('_id')) {
        this.props.socket.emit('incoming_call', { messageUser: talk.messageUser });
        this.props.initCurrentTalk(talk, false);
        this.props.initMessageUser({ _id: talk.messageUser, messages: data.messages, participants: data.participants });
        this.editTalkModal(true);
        try {
          let audio = new Audio(mp3);
          let count = 0;
          let timeout = setInterval(() => {
            if(count === 6) {
              clearInterval(timeout);
            }
            audio.play();
            count++;
          }, 4000);
          this.timeout = timeout;
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


    this.hasListeners = true;
  }
  componentDidMount() {
    const token = cookie.get('token');
    const redirect = cookie.get('redirect');
    if (token) {
      this.props.initToggleUser(token);
      this.setupListenersAndEverything(redirect);
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.user.token !== '' && this.props.user.token === '') {
      this.hasListeners = false;
    }
    if (!this.hasListeners) {
      const token = cookie.get('token');
      const redirect = cookie.get('redirect');
      if (token) {
        this.props.initToggleUser(token);
        this.setupListenersAndEverything(redirect);
      }
    }
  }

  setupListenersAndEverything (redirect) {
      this.hasListeners = true;
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
        this.hasListeners = false;
      });
  }

  render() {
    if (this.props.user.token) {
      return (
        <React.Fragment>
          <nav className="nav">
              <Link to="/" id="brainterLogo">
                <span id="first">B</span>
                <span id="second">S</span>
              </Link>
              {this.props.talk.hasOwnProperty('_id') && this.props.seen && this.props.location.pathname !== '/talk' && this.props.talkMu === null ? (
                <NavMenuItem location="/talk" locationName="Return to talk" />
              ) : null}
              <NavMenuItem location="/lessons" locationName="Lessons" />
              <NavMenuItem location="/users" locationName="Users" />
              <NavMenuItem location="/messages/0/false" locationName="Messages" />
              <div className="nav-item">
                <Link to="/profile" id="Profile" style={{justifyContent: 'space-between', paddingLeft: '.5rem'}}>
                  <img id="navProfile" src={`/api/user/photo/${this.props.user._id}`}/>
                  {this.props.user.name || "Profile"}
                </Link>
              </div>
          </nav>
          <IncomingCallModal opened={this.props.talk.hasOwnProperty('_id') && this.state.talkModal} editTalkModal={this.editTalkModal} />
          <CallingModal clearState={this.state.clear} editClear={this.editClear} opened={this.props.talkMu !== null} messageUser={this.props.talkMu} />
        </React.Fragment>
      );
    } 
    return (
      <React.Fragment>
        <nav className="nav" style={{ justifyContent: 'center' }}>
          <Link to="/" id="brainterLogo" style={{ margin: 0 }}>
            <span id="first">BRAINTER</span>
            <span id="second">.STUDY</span>
          </Link>
        </nav>
      </React.Fragment>
    );
  }
}

// Retrieve data from store as props
const mapStateToProps = state => ({
  user: state.userData.user,
  searchUser: state.search.user,
  socket: state.io.socket,
  seen: state.talk.seen,
  talk: state.talk.talk,
  participants: state.talk.participants,
  talkMu: state.talk.messageUser,
  p2p: state.io.p2p,
  messageUsers: state.messages.messageUsers,
  messageUser: state.messages.user,
  blackboardText: state.talk.blackboardText
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
    }),
    userNotActive: (user) => dispatch({
      type: 'USER_NOT_ACTIVE',
      user
    }),
    userActive: (user) => dispatch({
      type: 'USER_ACTIVE',
      user
    }),
    initParticipants: (participants) => dispatch({
      type: 'INIT_PARTICIPANTS',
      participants
    }),
    addPeer: (peer) => dispatch({
      type: 'ADD_PEER',
      peer
    }),
    removePeer: (peer) => dispatch({
      type: 'REMOVE_PEER',
      peer
    })
  };
};
/* eslint-enable */

export default withRouter(translate()(connect(mapStateToProps, mapDispatchToProps)(NavMenu)));
