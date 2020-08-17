import React, { Component, useState, useEffect } from 'react';
import {
  map
} from 'lodash';
import { connect } from 'react-redux';
import {
  Grid, Chip, makeStyles
} from '@material-ui/core';


const UserTags = ({
  user
}) => {
  const classes = makeStyles((theme => ({
    root: {
      margin: 'auto',
      marginBottom: theme.spacing(2)
    },
    paper: {
      width: 200,
      height: 230,
      overflow: 'auto',
    },
    button: {
      margin: theme.spacing(0.5, 0),
    },
  })))();

  const generateTags = () => map(user.tags, (tag, index) => (
    <Grid item key={tag._id}>
      <Chip
        key={tag._id}
        label={tag.name}
      />
    </Grid>
  ));


  const tags = generateTags();
  return (
    <Grid container spacing={2} justify="flex-start" alignItems="flex-start" className={classes.root}>
      {tags}
    </Grid>
  );
};

export default UserTags;
