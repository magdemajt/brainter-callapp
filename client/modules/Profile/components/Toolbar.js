import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles, Button } from '@material-ui/core';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Settings';
import EditIcon from '@material-ui/icons/Edit';

import history from '../../../history';

const ProfileToolbar = ({ changeEdit, editing, changeEditTags }) => {
  const classes = makeStyles(theme => ({
    root: {
      height: 380,
    },
    speedDial: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(3),
    },
  }))();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClick = () => {
    setOpen(!open);
  };
  const handleClose = () => {
    setOpen(false);
  };

  let actions = [];
  if (!editing) {
    actions = [
      { name: 'Surveys', icon: <PrintIcon />, handleClick: () => history.push('/surveys') },
      { name: 'Settings', icon: <SettingsIcon />, handleClick: () => history.push('/settings') },
      { name: 'Edit Profile', icon: <EditIcon />, handleClick: () => changeEditTags() }
    ];
  } else {
    actions = [
      { name: 'Discard all changes', icon: <DeleteIcon />, handleClick: () => history.go() },
      { name: 'Edit Tags', icon: <EditIcon />, handleClick: () => changeEditTags() },
      { name: 'Save changes', icon: <SaveIcon />, handleClick: () => changeEdit() },
    ];
  }

  const speedIcon = editing ? (<SaveIcon />) : (<SpeedDialIcon openIcon={<EditIcon />} />);

  return (
    <div className={classes.root}>
      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        className={classes.speedDial}
        icon={speedIcon}
        onBlur={handleClose}
        onClick={handleClick}
        onClose={handleClose}
        onFocus={handleOpen}
        // onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        open={open}
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.handleClick}
          />
        ))}
      </SpeedDial>
    </div>
  );
};

export default ProfileToolbar;
