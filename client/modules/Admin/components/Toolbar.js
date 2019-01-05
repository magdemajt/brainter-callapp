import React, { Component } from 'react';

const Toolbar = ({ changeSettingPage }) => (
  <div className="sidebar right flex">
    <button type="button" className="btn" onClick={() => changeSettingPage(0)}>Add Tag</button>
    <button type="button" className="btn" onClick={() => changeSettingPage(1)}>User statistics</button>
    <button type="button" className="btn" onClick={() => changeSettingPage(2)}>Messages statistics</button>
    <button type="button" className="btn" onClick={() => changeSettingPage(3)}>MessageUsers statistics</button>
  </div>
);

export default Toolbar;
