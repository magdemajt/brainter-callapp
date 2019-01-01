import React, { Component } from 'react';
import { connect } from 'react-redux';
import settingEnum from '../settingEnum';
const Toolbar = ({ changeSettingPage }) => (
  <div className="sidebar right flex">
    <button className="btn" onClick={() => changeSettingPage(settingEnum.email)}>Change Email</button>
    <button className="btn" onClick={() => changeSettingPage(settingEnum.pass)}>Change Password</button>
    <button className="btn" onClick={() => changeSettingPage(settingEnum.privacy)}>Privacy Settings</button>
  </div>
);

export default Toolbar;
