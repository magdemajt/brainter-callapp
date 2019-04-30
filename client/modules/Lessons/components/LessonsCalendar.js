import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';

const LessonsCalendar = ({
  timetableState = [], socket
}) => {
  const [timetable, setTimetable] = timetableState;
  function generateRow(rowFragment, rowIndex) {
    const row = rowFragment.hoursPlan.map((hour, index) => (
      <li
        className={hour === true ? 'timetable-item active' : 'timetable-item'}
        style={{ display: 'inline' }}
        key={`${rowIndex}-${index}`}
        onClick={() => {
          const newTimetable = [...timetable];
          newTimetable[rowIndex].hoursPlan[index] = (!hour);
          setTimetable(newTimetable);
        }}
      >
        {`${Math.floor(index / 2) < 10 ? `0${Math.floor(index / 2)}` : Math.floor(index / 2)} : ${(index % 2) * 3}0`}
      </li>
    ));
    return row;
  }
  function saveTimetableToDatabase() {
    socket.emit('save_timetable', { timetable });
    console.log(timetable);
  }
  return (
    <div className="">
      <ul style={{ listStyleType: 'none', fontSize: '1.6rem', margin: '2rem' }}>
        {timetable.map((tRow, index) => (
          <li key={tRow.day}>
            <ul style={{
              display: 'flex', listStyleType: 'none', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', padding: '.5rem'
            }}
            >
              {tRow.day}
              {generateRow(tRow, index)}
            </ul>
          </li>
        ))}
      </ul>
      <button onClick={saveTimetableToDatabase} className="btn success" type="button">Save</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(LessonsCalendar);
