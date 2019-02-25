import React, { Component } from 'react';
import { connect } from 'react-redux';
// Import Style


// Import Components

// Import Actions

const Blackboard = ({
  text, changeText, caller
}) => (
  <div id="blackboard">
    {caller ? (
      <textarea value={text} onChange={changeText} className="blackboard-input" />) : (
        <h3 className="blackboard-text">
            {text}
          </h3>)}
  </div>
);

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
