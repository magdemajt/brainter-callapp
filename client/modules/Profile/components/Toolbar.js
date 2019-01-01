import React, { Component } from 'react';
import { connect } from 'react-redux';

const ProfileToolbar = ({ changeEdit, editing }) => (
  <div className="sidebar right small flex">
    <button className={editing ? 'btn success' : 'btn default'} onClick={changeEdit}>Edit</button>
  </div>
);

export default ProfileToolbar;
