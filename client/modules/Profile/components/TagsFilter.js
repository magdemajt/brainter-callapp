import React, { Component } from 'react';
import { connect } from 'react-redux';

const TagsFilter = ({ onChange }) => {
  return (
    <React.Fragment>
      <input onChange={onChange} placeholder="Enter searched tag" />
    </React.Fragment>
  );
};

export default TagsFilter;
