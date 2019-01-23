import React, { Component } from 'react';
import { connect } from 'react-redux';
// Import Style


// Import Components

// Import Actions

const Blackboard = ({
  text, changeText, caller
}) => {
  return (
    <React.Fragment>
      {caller ? (
      <textarea value={text} onChange={changeText} />) : (
      <h3>
        {text}
      </h3>)}
    </React.Fragment>
  );
};

// Retrieve data from store as props
const mapStateToProps = state => ({
  filter: state.search.filter,
  users: state.search.users,
  authUser: state.userData.user
});
/* eslint-disable */
const mapDispatchToProps = (dispatch) => {
  return {
    initFilter: (filter) => dispatch({
      type: 'INIT_FILTER',
      filter
    })
  };
};
/* eslint-enable */

export default connect(mapStateToProps, mapDispatchToProps)(Blackboard);
