import React, { Component } from 'react';

const Timepicker = ({ changeTime, value }) => (
  <div className="row-5">
    <input type="date" max={Date.now()} onChange={changeTime} value={value} />
  </div>
);

export default Timepicker;
