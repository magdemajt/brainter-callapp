import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { addMonths } from 'date-fns';

const OptionsManager = ({
  maxPeopleState = [], socket
}) => {
  const [maxPeople, setMaxPeople] = maxPeopleState;
  useEffect(() => {
    if (maxPeople < 0) {
      setMaxPeople(0);
    }
    if (maxPeople > 10) {
      setMaxPeople(10);
    }
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(maxPeople)) {
      setMaxPeople(0);
    }
  }, [maxPeople]);
  return (
    <React.Fragment>
      <label htmlFor="maxPeopleId" style={{ fontSize: '1.6rem', fontFamily: 'CooperHewittBook' }}>
        {'Number of people you want to have lesson with (decreases cost of lesson)'}
      </label>
      <input style={{ width: 'auto' }} id="maxPeopleId" className="input" type="number" placeholder="Enter number of people..." value={maxPeople} onChange={(e) => { !isNaN(e.target.value) ? setMaxPeople(parseInt(e.target.value, 10)) : setMaxPeople(0); }} />
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

export default connect(mapStateToProps, mapDispatchToProps)(OptionsManager);
