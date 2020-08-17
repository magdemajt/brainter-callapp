import React, { Component } from 'react';
import { connect } from 'react-redux';
import { makeStyles, Avatar, Chip } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { chunk } from '../util';

const ChatMessage = ({
  message,
  float,
  children = null,
  bottom
}) => {
  // const messageEdited = chunk(message.text, 38).join('\n');
  const classes = makeStyles(theme => ({
    flexLeft: {
      display: 'flex',
      margin: theme.spacing(1),
      justifyContent: 'flex-start'
    },
    flexRight: {
      display: 'flex',
      margin: theme.spacing(1),
      justifyContent: 'flex-end'
    },
    padding: {
      paddingRight: theme.spacing(1)
    }
  }))();
  const messageEdited = message.text;
  return (
    <div className={float ? classes.flexRight : classes.flexLeft} id={bottom ? 'bottom' : null} key={message._id}>
      <Chip
        className={classes.padding}
        label={messageEdited}
        avatar={message.sender.photo.data.includes('NoProfileImage') ? <AccountCircle /> : <Avatar src={`/api/user/photo/${message.sender._id}`} />}
      />
    </div>
  );
};

export default ChatMessage;
