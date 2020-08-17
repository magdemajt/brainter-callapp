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
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { axiosPost } from '../../axiosWrappers';
import { withStyles, makeStyles } from '@material-ui/styles';
// Import Style


// Import Components

// Import Actions

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

class NavMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clear: false,
      talkModal: false,
      menuAnchorEl: null,
      mobileAnchorEl: null
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
    const { classes } = this.props;
    const { menuAnchorEl, mobileAnchorEl } = this.state;
    const menuOpened = Boolean(menuAnchorEl);
    const mobileMenuOpened = Boolean(mobileAnchorEl);
    let TopBar = null;

    const menuId = 'primary-search-account-menu';
    const mobileMenuId = 'primary-search-account-menu-mobile';

    const renderMenu = (
      <Menu
        anchorEl={menuAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={menuOpened}
        onClose={() => this.setState({ menuAnchorEl: null, mobileAnchorEl: null })}
      >
        <MenuItem onClick={() => {history.push('/profile'); this.setState({ menuAnchorEl: null })}}>Profile</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={mobileMenuOpened}
        onClose={() => this.setState({ mobileAnchorEl: null })}
      >
        <MenuItem onClick={() => history.push('/messages/0/false')}>
          <IconButton aria-label="Show 4 new mails" color="inherit" >
            <Badge badgeContent={4} color="secondary">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        <MenuItem>
          <IconButton aria-label="Show 11 new notifications" color="inherit">
            <Badge badgeContent={11} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={event => this.setState({ menuAnchorEl: event.currentTarget })}>
          <IconButton
            aria-label="Account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );  

    TopBar = (
      <React.Fragment>
        <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                News
              </Typography>
              <Button color="inherit" onClick={() => history.push('/login')}>Login</Button>
              <Button color="inherit" onClick={() => history.push('/register')}>Register</Button>
            </Toolbar>
              {/* <Link to="/" id="brainterLogo">
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
              </div> */}
          </AppBar>
      </React.Fragment>
    );
    if (this.props.user.token) {
      // return (
      //   <React.Fragment>
      //     <AppBar position="static" >
      //       <Toolbar variant="regular">
      //         <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu">
      //           <MenuIcon />
      //         </IconButton>
      //         <Typography variant="h6" className={classes.title}>
      //           News
      //         </Typography>
      //         <div className={classes.root} />
      //         <Button color="inherit" edge="end">Login</Button>
      //       </Toolbar>
      //         {/* <Link to="/" id="brainterLogo">
      //           <span id="first">B</span>
      //           <span id="second">S</span>
      //         </Link>
      //         {this.props.talk.hasOwnProperty('_id') && this.props.seen && this.props.location.pathname !== '/talk' && this.props.talkMu === null ? (
      //           <NavMenuItem location="/talk" locationName="Return to talk" />
      //         ) : null}
      //         <NavMenuItem location="/lessons" locationName="Lessons" />
      //         <NavMenuItem location="/users" locationName="Users" />
      //         <NavMenuItem location="/messages/0/false" locationName="Messages" />
      //         <div className="nav-item">
      //           <Link to="/profile" id="Profile" style={{justifyContent: 'space-between', paddingLeft: '.5rem'}}>
      //             <img id="navProfile" src={`/api/user/photo/${this.props.user._id}`}/>
      //             {this.props.user.name || "Profile"}
      //           </Link>
      //         </div> */}
      //     </AppBar>
      //   </React.Fragment>
      // );
        TopBar = (<div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                News
              </Typography>
              <div className={classes.sectionDesktop}>
                <IconButton aria-label="Show new mails" color="inherit" onClick={() => history.push('/messages/0/false')}>
                  <Badge badgeContent={4} color="secondary">
                    <MailIcon />
                  </Badge>
                </IconButton>
                <IconButton aria-label="Show new notifications" color="inherit">
                  <Badge badgeContent={17} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="Account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={event => this.setState({ menuAnchorEl: event.currentTarget })}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </div>
              <div className={classes.sectionMobile}>
                <IconButton
                  aria-label="Show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={event => this.setState({ mobileAnchorEl: event.currentTarget })}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
          {renderMobileMenu}
          {renderMenu}
          <IncomingCallModal opened={this.props.talk.hasOwnProperty('_id') && this.state.talkModal} editTalkModal={this.editTalkModal} />
          <CallingModal clearState={this.state.clear} editClear={this.editClear} opened={this.props.talkMu !== null} messageUser={this.props.talkMu} />
        </div>
      );
    }
    return TopBar;
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

export default withRouter(withStyles(styles)(translate()(connect(mapStateToProps, mapDispatchToProps)(NavMenu))));
