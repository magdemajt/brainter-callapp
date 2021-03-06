import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import UserSelection from './components/UserSelection';
import Chatbox from './components/Chatbox';
import _ from 'lodash';
import NewMessageUserModal from './components/NewMessageUserModal';
import { withStyles } from '@material-ui/styles';
import { IconButton, Grid, Paper } from '@material-ui/core';
import Add from '@material-ui/icons/Add';

// Import Style
const styles = theme => ({
  root: {
    display: 'flex'
  },
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

// Import Components

// Import Actions

class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [], // Current user's messages
      user: this.props.user,
      filteredTags: this.props.tags,
      filter: '',
      createMUserModal: false,
      part: Math.ceil(this.props.messageUsers.length / 15)
    };
    this.listRef = React.createRef();
    this.updatingMessageUsers = false;
    this.checkedURL = false;
    this.previousId = '';
  }
  openMessagesIfRouteUser () {
    return this.props.messageUsers.find(mu => {
      return (mu._id === this.props.match.params.id) || (mu.participants.find(par => par._id === this.props.match.params.id) !== undefined && mu.participants.find(par => par._id === this.props.authUser._id) !== undefined && mu.participants.length === 2);
    });
  }
  checkURL () {
    if (this.previousId !== this.props.match.params.id && this.props.messageUsers.length > 0 && this.props.match.params.id !== '0') {
      console.log(this.previousId)
      const chosenUser = this.openMessagesIfRouteUser();
      if (this.props.match.params.talking === 'true') {
        console.log(chosenUser)
        this.props.startCalling(chosenUser._id);
      } else {
        this.onSelect(chosenUser);
      }
      this.previousId = this.props.match.params.id;
    }
  }
  componentDidMount () {
    this.checkURL();
  }
  componentDidUpdate (prevProps) {
    this.checkURL();
    if (prevProps.user.hasOwnProperty('messages') && this.props.user.hasOwnProperty('messages') && this.props.user.messages.length > prevProps.user.messages.length) {
      const newUnsorted = (_.chunk(this.props.user.messages, prevProps.user.messages.length)[1]);
      const newMsgs =_.filter(newUnsorted, o => o.sender !== this.props.authUser._id && !o.seen.find(user => user === this.props.authUser._id));
      this.seenMessages(this.props.user, newMsgs);
    }
    if (prevProps.messageUsers.length < this.props.messageUsers.length) {
      this.updatingMessageUsers = false;
    }
  }
  seenMessages = (messageUser, newMsgs) => {
    this.props.seenMessages(messageUser, this.props.authUser);
    this.props.socket.emit('seen_messages', { messages: newMsgs });
  }
  onSelect = (messageUser, newMsgs = []) => {
    this.props.initMessageUser(messageUser);
    this.seenMessages(messageUser, newMsgs);
  }

  getMoreMessageUsers = () => {
    const containerNode = this.listRef.current;
    if (containerNode.scrollHeight - containerNode.clientHeight - containerNode.scrollTop < 60) {
      if (!this.updatingMessageUsers) {
        this.props.socket.emit('get_message_users', { part: this.state.part });
        this.setState({ part: this.state.part + 1 });
        this.updatingMessageUsers = true;
      }
    }
  }

  closeModal = () => {
    this.setState({createMUserModal: false});
  }

  generateMessagePanel = () => {
    const { classes } = this.props;
    return (
      <div className={classes.flexCenter}>
        <IconButton onClick={() => this.setState({createMUserModal: true})}>
          <Add />
        </IconButton>
      </div>
    );
  }

  render() {
    const { classes } = this.props;
    const messagePanel = this.generateMessagePanel();
    const StyledPaper = withStyles(theme => ({
      root: {
        margin: theme.spacing(2),
        overflowY: 'auto',
        height: theme.spacing(59)
      }
    }))(Paper);
    return (
      <React.Fragment>
        <Grid container spacing={0}>
          <Grid item xs={3}>
            <StyledPaper>
              <UserSelection onSelect={this.onSelect} messagePanel={messagePanel} getMoreMessageUsers={this.getMoreMessageUsers} listRef={this.listRef}/>
            </StyledPaper>
          </Grid>
          <Chatbox disabledInput={this.props.user.participants.filter(part => part !== null).length < 2} messages={this.props.user !== undefined && this.props.user.hasOwnProperty('messages') ? this.props.user.messages : []} />
        </Grid>
        <NewMessageUserModal opened={this.state.createMUserModal} closeModal={this.closeModal} />
      </React.Fragment>
    );
  }
}

// Retrieve data from store as props
const mapStateToProps = state => ({
  messageUsers: state.messages.messageUsers,
  authUser: state.userData.user,
  user: state.messages.user || { participants: [] },
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
    }),
    seenMessages: (messageUser, user) => dispatch({
      type: 'SEEN_MESSAGES',
      messageUser,
      user
    })
  };
};
/* eslint-enable */

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Messages));
