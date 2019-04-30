import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';

const ScheduleManager = ({
  scheduleState = []
}) => {
  const [schedule, setSchedule] = scheduleState;
  console.log(schedule);


  return (
    <div className="sidebar right flex">
      {/* <DragTagTable /> */}
    </div>
  );
};

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

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleManager);
