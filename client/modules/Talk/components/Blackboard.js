import React, { Component } from 'react';
import { connect } from 'react-redux';
// Import Style


// Import Components

// Import Actions

const SearchUserByName = ({
  users, viewUserProfile, talkToUser, initFilter, filter, authUser
}) => {
  /* eslint-disable */
  const mappedUsers = filter != '' ? users
    .filter(user => user.name.includes(filter))
    .map((user, index) => (
      <li key={user._id}>
          <img src={user.photo.data} alt="Profile image" style={{ width: '20rem' }} />
          {user.name}
          {authUser._id !== user._id ? (
          <React.Fragment>
            <button onClick={() => talkToUser(user._id, index)}>
              Talk to user
            </button>
          </React.Fragment>) : null }
            <button onClick={() => viewUserProfile(user._id, index)}>
              View profile
            </button>
        </li>
    )) : []; /* eslint-enable */
  return (
    <React.Fragment>
      <input type="text" placeholder="Enter name..." onChange={e => initFilter(e.target.value)} />
      <ul>
        {mappedUsers}
      </ul>
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchUserByName);
