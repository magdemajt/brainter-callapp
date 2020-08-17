import React, { Component, useState, useEffect } from 'react';
import {
  findIndex, intersectionBy, differenceBy, unionBy, map
} from 'lodash';
import { connect } from 'react-redux';
import {
  List, ListItem, Checkbox, ListItemText, ListItemIcon, Grid, Button, Chip, makeStyles, Modal, Paper, Divider, ListSubheader
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import TagsFilter from './TagsFilter';

const not = (a, b) => differenceBy(a, b, '_id');
const intersection = (a, b) => intersectionBy(a, b, '_id');
const union = (a, b) => unionBy(a, b, '_id');
const indexOfTag = (a, tag) => findIndex(a, o => o._id === tag._id);

const EditTags = ({
  user, updateUserTags, filteredTags = [], filterTags
}) => {
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState(user.tags);
  const leftChecked = intersection(checked, left);
  const [right, setRight] = useState(not(filteredTags, left));

  const classes = makeStyles((theme => ({
    '@global': {
      '*::-webkit-scrollbar': {
        width: '0.4em'
      },
      '*::-webkit-scrollbar-track': {
        '-webkit-box-shadow': 'inset 0 0 5px rgba(0,0,0,0.00)'
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,.1)',
        outline: '1px solid slategrey',
      }
    },
    root: {
      margin: 'auto'
    },
    paper: {
      width: 200,
      height: 230,
      overflow: 'auto',
    },
    button: {
      margin: theme.spacing(0.5, 0),
    },
    input: {
      marginTop: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    list: {
      height: theme.spacing(40),
      overflowY: 'auto'
    }
  })))();

  useEffect(() => {
    if (left !== undefined && left !== null) {
      updateUserTags(left);
    }
  }, [left]);

  useEffect(() => {
    setRight(union(not(checked, leftChecked), not(filteredTags, left)));
  }, [filteredTags]);

  const rightChecked = intersection(checked, right);

  const handleToggle = value => () => {
    const currentIndex = indexOfTag(checked, value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (tags, subheaderText) => (
    <div className={classes.list}>
      <List
        dense
        component="div"
        role="list"
        subheader={(
          <ListSubheader component="div" disableSticky>
            {subheaderText}
          </ListSubheader>
        )}
      >
        {tags.map((tag) => {
          const labelId = `transfer-list-item-${tag.name}-label`;

          return (
            <ListItem key={tag._id} role="listitem" button onClick={handleToggle(tag)}>
              <ListItemIcon>
                <Checkbox
                  checked={indexOfTag(checked, tag) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={tag.name} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </div>
  );
    /* eslint-disable */
    return (
      <Grid container spacing={1} justify="center" alignItems="center" className={classes.root}>
        <Grid item xs={12} className={classes.input}>
          <TagsFilter onChange={filterTags} />
        </Grid>
        <Grid item>{customList(left, 'Your tags')}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList(right, 'All tags')}</Grid>
      </Grid>
    );
    /* eslint-enable */
};

const ModalEditTags = (props) => {
  const classes = makeStyles(theme => ({
    root: {
      position: 'absolute',
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(4),
      width: theme.spacing(80),
      [theme.breakpoints.down('sm')]: {
        width: theme.spacing(60)
      },
      top: '10%',
      margin: 'auto',
      left: '50%',
      transform: 'translate(-50%, 0%)',
    }
  }))();
  const { opened, closeEditTags } = props;
  /* eslint-disable */
  return (
    <Modal open={opened} onClose={closeEditTags} style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Paper
        className={classes.root}
      >
        <EditTags {...props} />
        <Button variant="contained" onClick={closeEditTags} color="primary">
          <CloseIcon />
          Close
        </Button>
      </Paper>
    </Modal>
  );
  /* eslint-enable */
};

export default ModalEditTags;
