import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { TextField, makeStyles } from '@material-ui/core';

const TagsFilter = ({ onChange }) => {
  const [value, setValue] = useState('');
  useEffect(() => {
    onChange(value);
  }, [value]);
  return (
    <React.Fragment>
      <TextField
        height={20}
        id="outlined-tag"
        label="Enter searched tag"
        onChange={e => setValue(e.target.value)}
        value={value}
        margin="normal"
        variant="outlined"
      />
    </React.Fragment>
  );
};

export default TagsFilter;
