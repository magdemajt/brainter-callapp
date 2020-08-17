import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ScheduleManager from './ScheduleManager';

const ScheduleManagerContainer = ({
  scheduleState = []
}) => (
  <div className="sidebar right flex">
    <ScheduleManager scheduleState={scheduleState} />
  </div>
);

// Retrieve data from store as props
const mapStateToProps = state => ({
  authUser: state.userData.user,
  socket: state.io.socket
});
/* eslint-disable */
const mapDispatchToProps = (dispatch) => {
  return {
    
  };
};
/* eslint-enable */

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleManagerContainer);
