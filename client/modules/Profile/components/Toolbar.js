import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import history from '../../../history';

const ProfileToolbar = ({ changeEdit, editing }) => (
  <div className="sidebar right small flex">
    <button className="btn default shrink" onClick={() => history.push('/surveys')}>Surveys</button>
    <button className={editing ? 'btn success shrink' : 'btn default shrink'} onClick={changeEdit}>{editing ? 'Save' : 'Edit'}</button>
    <button className="btn default shrink" onClick={() => history.push('/settings')}>Settings</button>
  </div>
);

export default ProfileToolbar;
