import React, { Component } from 'react';
import { connect } from 'react-redux';
import settingEnum from '../settingEnum';
import history from '../../../history';
const Toolbar = ({ changeSettingPage, permission }) => (
  <div className="sidebar right flex">
    <button type="button" className="btn" onClick={() => changeSettingPage(settingEnum.email)}>Change Email</button>
    <button type="button" className="btn" onClick={() => changeSettingPage(settingEnum.pass)}>Change Password</button>
    <button type="button" className="btn" onClick={() => changeSettingPage(settingEnum.privacy)}>Privacy Settings</button>
    {permission > 0 ? <button type="button" className="btn secondary" onClick={() => { history.push('/admin'); }}>Admin Panel</button> : null}
  </div>
);

export default Toolbar;
