import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Call from '@material-ui/icons/Call';
import Avatar from '@material-ui/core/Avatar';
import _ from 'lodash';
import { connect } from 'react-redux';
import { translate } from 'react-polyglot';
import { List, IconButton, withStyles } from '@material-ui/core';
import history from '../../../history';


const styles = theme => ({
  root: {
    flex: 1
    // backgroundColor: theme.palette.background.primary,
  }
});

const UserSelection = ({
  messageUsers, onSelect, authUser, userM, t, messagePanel, getMoreMessageUsers, listRef, classes
}) => {
  const newMessages = (messageUser) => {
    const newMsgs = _.filter(messageUser.messages, o => o.sender !== authUser._id && !o.seen.find(user => user === authUser._id));
    return newMsgs;
  };
  const names = (participants = []) => {
    let text = '';
    participants.filter(par => par._id !== authUser._id).forEach((user, index, array) => {
      text += user.name + (array.length - 1 !== index ? ', ' : '');
    });
    if (text === '') {
      text = t('messages.noUser');
    }
    return text;
  };
  const users = messageUsers.map((messageUser) => {
    const otherPart = _.find(messageUser.participants, part => part._id !== authUser._id);
    // const newMsgs = [];
    const newMsgs = newMessages(messageUser);
    return (
      <ListItem key={messageUser._id} button onClick={() => onSelect(messageUser, newMsgs)}>
        <ListItemAvatar>
          { messageUser.participants.length > 2 || otherPart.photo.data.includes('/NoProfileImage') ? (
            <AccountCircle />
          ) : (
            <Avatar
              alt="User avatar"
              src={`/api/user/photo/${otherPart._id}`}
            />
          ) }
        </ListItemAvatar>
        <ListItemText primary={names(messageUser.participants)} />
        <ListItemSecondaryAction>
          <IconButton onClick={() => history.push(`/messages/${messageUser._id}/true`)}>
            <Call />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
    // {/* {newMsgs.length > 0 ? <span className="badge small">{newMsgs.length < 10 ? newMsgs.length : '+9'}</span> : null} */}
  });
  return (
    <div className="sidebar">
      <List color="inherit" dense ref={listRef} onScroll={getMoreMessageUsers} className={classes.root}>
        {messagePanel}
        {users}
      </List>
    </div>
  );
};
const mapStateToProps = state => ({
  messageUsers: state.messages.messageUsers,
  userM: state.messages.user,
  authUser: state.userData.user
});
export default withStyles(styles)(translate()(connect(mapStateToProps)(UserSelection)));
