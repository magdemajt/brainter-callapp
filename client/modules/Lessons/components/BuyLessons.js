import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { addMonths, addDays } from 'date-fns';
import DatesPicker from './DatesPicker';
import ScheduleManagerContainer from './ScheduleManagerContainer';
import OptionsManager from './OptionsManager';

const BuyLessons = ({
  socket
}) => {
  const [startDate, setStartDate] = useState(addDays(new Date(), 2));
  const [endDate, setEndDate] = useState(addMonths(new Date(), 1));
  const [schedule, setSchedule] = useState([]);
  // const [lessonsWeekly, setLessonsWeekly] = useState(false); // If false it means that lessons won't be looped weekly, add in the future
  const [maxPeople, setMaxPeople] = useState(1);
  useEffect(() => {
    socket.emit('calculate_lesson_cost', {
      schedule, startDate, endDate, maxPeople
    });
  }, [schedule, startDate, endDate, maxPeople]);
  useEffect(() => {
    socket.on('receive_cost', (data) => {

    });
    return () => {
      socket.removeListener('receive_cost');
    };
  }, [socket]);
  const test = '';
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%'
    }}
    >
      <DatesPicker startDateState={[startDate, setStartDate]} endDateState={[endDate, setEndDate]} />
      <ScheduleManagerContainer scheduleState={[schedule, setSchedule]} />
      <OptionsManager maxPeopleState={[maxPeople, setMaxPeople]} />
      {/* <CostManager /> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(BuyLessons);
