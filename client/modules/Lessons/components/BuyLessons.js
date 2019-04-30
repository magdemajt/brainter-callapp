import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { addMonths } from 'date-fns';
import DatesPicker from './DatesPicker';
import ScheduleManager from './ScheduleManager';

const BuyLessons = ({

}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addMonths(new Date(), 1));
  const [schedule, setSchedule] = useState([]);
  const test = '';
  return (
    <React.Fragment>
      <DatesPicker startDateState={[startDate, setStartDate]} endDateState={[endDate, setEndDate]} />
      <ScheduleManager scheduleState={[schedule, setSchedule]} />
      {/* <OptionsManager /> */}
      {/* <CostManager /> */}
    </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(BuyLessons);
