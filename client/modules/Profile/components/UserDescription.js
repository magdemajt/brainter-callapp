import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Typography, TextField } from '@material-ui/core';

const UserDescription = ({ editing, user, onChangeProp }) => {
  let editingContent;
  if (editing) {
    editingContent = (
      <React.Fragment>
        <TextField
          id="standard-multiline-flexible"
          label="User description"
          multiline
          rowsMax="4"
          fullWidth
          defaultValue={user.desc}
          onChange={onChangeProp}
          margin="normal"
        />
      </React.Fragment>
    );
  } else {
    editingContent = (
      <React.Fragment>
        <Typography variant="body2" color="textSecondary" component="p">
          {user.desc}
        </Typography>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {editingContent}
    </React.Fragment>
  );
};

export default UserDescription;
