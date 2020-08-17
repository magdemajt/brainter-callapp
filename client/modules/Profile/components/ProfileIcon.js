import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import {
  Badge, Avatar, withStyles
} from '@material-ui/core';

const StyledBadge = withStyles(theme => ({
  root: {
    margin: theme.spacing(2),
    userSelect: 'none'
  },
  colorPrimary: {
    background: '#42b72a',
    color: '#42b72a'
  },
  colorSecondary: {
    background: '#ff0000',
    color: '#ff0000'
  }
}))(Badge);

const ProfileIcon = ({ editing, user, onDrop }) => {
  let content;
  if (editing) { /* eslint-disable */
    content = (
      <React.Fragment>
        <Dropzone onDrop={onDrop} id="dropzone-image">
          <Avatar src={`/api/user/photo/${user._id}`} alt={`${user.name} Image`} />
        </Dropzone>
      </React.Fragment>
    );
  } else { /* eslint-enable */
    content = (
      <StyledBadge variant="standard" color={user.active ? 'primary' : 'secondary'} badgeContent={4}>
        <Avatar src={`/api/user/photo/${user._id}`} alt={`${user.name} Image`} />
      </StyledBadge>
    );
  }
  return (
    <React.Fragment>
      {content}
    </React.Fragment>
  );
};

export default ProfileIcon;
