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
    .map((user) => (
      <li key={user._id} className="flex-el">
          <div style={{position: 'relative' }}>
            <img src={`/api/user/photo/${user._id}`} />
            <span className={user.active ? 'user-active small' : 'user-active small not'}></span>
          </div>
          {user.name}
          <div>
            <button className="view-profile-button" onClick={() => viewUserProfile(user._id)} />
          {authUser._id !== user._id ? (
          <React.Fragment>
            <button className="call-button" onClick={() => talkToUser(user._id)} />
          </React.Fragment>) : null }
          </div>
        </li>
    )) : []; /* eslint-enable */
  return (
    <React.Fragment>
      <input className="input" type="text" placeholder="Enter name..." onChange={e => initFilter(e.target.value)} />
      <div className="scroll-y" style={{ width: '100%', height: '100%' }}>
        <ul className="users-list">
          {mappedUsers}
        </ul>
      </div>
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
