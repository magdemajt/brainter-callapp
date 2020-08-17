import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import { addDays, addMonths } from 'date-fns';
import 'react-datepicker/src/stylesheets/datepicker.scss';

const DatesPicker = ({
  startDateState = [], endDateState = []
}) => {
  const [startDate, setStartDate] = startDateState;
  const [endDate, setEndDate] = endDateState;
  return (
    <div
      className="container flex"
      style={{
        fontFamily: 'CooperHewittBook', fontSize: '1.6rem', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', justifySelf: 'center'
      }}
    >
      {'Start Date'}
      <DatePicker minDate={addDays(new Date(), 2)} maxDate={endDate} selected={startDate} onChange={e => setStartDate(e)} />
      {'End Date'}
      <DatePicker minDate={startDate} maxDate={addMonths(startDate, 2)} selected={endDate} onChange={e => setEndDate(e)} />
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

export default connect(mapStateToProps, mapDispatchToProps)(DatesPicker);
