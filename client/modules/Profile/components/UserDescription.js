import React, { Component } from 'react';
import { connect } from 'react-redux';

const UserDescription = ({ editing, user, onChangeProp }) => {
  let editingContent;
  if (editing) {
    editingContent = (
      <React.Fragment>
        <textarea onChange={onChangeProp} defaultValue={user.desc} />
      </React.Fragment>
    );
  } else {
    editingContent = (
      <React.Fragment>
        <h3>{user.desc}</h3>
      </React.Fragment>
    );
  }
  return (
    <div className="col-5 ml-20" id="user-info">
      <div className="name">
        {user.name}
        {user.age}
        {user.male}
        {user.country}
      </div>
      <div className="desc">
        {editingContent}
      </div>
    </div>
  );
};

export default UserDescription;
