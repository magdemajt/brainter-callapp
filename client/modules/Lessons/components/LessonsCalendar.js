import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import { sortBy } from 'lodash';

const LessonsCalendar = ({
  timetableState = [], socket
}) => {
  const daysOfWeek = [{ day: 'monday', shortDay: 'mon' }, { day: 'tuesday', shortDay: 'tue' }, { day: 'wednesday', shortDay: 'wed' }, { day: 'thursday', shortDay: 'thu' }, { day: 'friday', shortDay: 'fri' }, { day: 'saturday', shortDay: 'sat' }, { day: 'sunday', shortDay: 'sun' }];
  const [beginHour, setBeginHour] = useState('08:00');
  const [endHour, setEndHour] = useState('09:00');
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [timetable, setTimetable] = timetableState;
  function saveTimetableToDatabase() {
    socket.emit('save_timetable', { timetable });
  }
  function handleChangeRaw(rawValue, setValue) {
    if (new RegExp('^[0-2][0-9]:[0-5][0-9]$').test(rawValue)) {
      setValue(`${rawValue.split(':')[0]}:${rawValue.split(':')[1]}`);
    }
  }
  function addTimeToSchedule() {
    // manage when
    const foundUnion = timetable[dayOfWeek].hoursPlan.find(plan => plan.beginHour === beginHour || plan.endHour === endHour);
    const newTimetable = timetable[dayOfWeek];
    if (foundUnion === undefined) {
      newTimetable.hoursPlan.push({ beginHour, endHour });
    }
    newTimetable.hoursPlan = sortBy(newTimetable.hoursPlan, 'beginHour');
    const createdT = [...timetable];
    createdT[dayOfWeek] = newTimetable;
    setTimetable(createdT);
  }
  function removeTimeFromSchedule(day, index) {
    const newT = timetable.map((t, ind) => {
      if (ind === day) {
        const filteredT = { ...t };
        filteredT.hoursPlan = t.hoursPlan.filter((obj, indexOfHours) => indexOfHours !== index);
        return filteredT;
      }
      return t;
    });
    setTimetable(newT);
  }
  function editTimeInSchedule(day, index) {
    setBeginHour(timetable[day].hoursPlan[index].beginHour);
    setEndHour(timetable[day].hoursPlan[index].endHour);
    setDayOfWeek(day);
    removeTimeFromSchedule(day, index);
  }
  const bTime = new Date();
  const eTime = new Date();
  bTime.setHours(beginHour.split(':')[0]);
  bTime.setMinutes(beginHour.split(':')[1]);
  eTime.setHours(endHour.split(':')[0]);
  eTime.setMinutes(endHour.split(':')[1]);
  return (
    <div style={{
      width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column'
    }}
    >
      <div style={{ fontSize: '1.6rem' }}>
        <button disabled={dayOfWeek === 0} className="btn default xsm" type="button" onClick={() => setDayOfWeek(dayOfWeek - 1)}>&#8592;</button>
        {daysOfWeek[dayOfWeek].shortDay}
        <button disabled={dayOfWeek === 6} className="btn default xsm" type="button" onClick={() => setDayOfWeek(dayOfWeek + 1)}>&#8594;</button>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
      }}
      >
        <div style={{ padding: '1rem' }}>
          <DatePicker
            selected={bTime}
            onChange={e => setBeginHour(`${e.getHours()}:${e.getMinutes()}`)}
            onChangeRaw={e => handleChangeRaw(e, setBeginHour)}
            timeIntervals={5}
            showTimeSelect
            showTimeSelectOnly
            timeFormat="HH:mm"
            dateFormat="HH:mm"
            timeCaption="Begin time"
          />
        </div>
        <div style={{ padding: '1rem' }}>
          <DatePicker
            selected={eTime}
            onChange={e => setEndHour(`${e.getHours()}:${e.getMinutes()}`)}
            onChangeRaw={e => handleChangeRaw(e, setEndHour)}
            timeIntervals={5}
            showTimeSelect
            showTimeSelectOnly
            dateFormat="HH:mm"
            timeFormat="HH:mm"
            timeCaption="End time"
          />
        </div>
        <button type="button" onClick={addTimeToSchedule} className="btn success xsm">Add</button>
      </div>
      <ul style={{ listStyleType: 'none', fontSize: '1.6rem', margin: '2rem' }}>
        { timetable.map((hours, day) => hours.hoursPlan.map((hourItem, index) => (<li key={daysOfWeek[day] + hourItem.beginHour + hourItem.endHour} onClick={() => editTimeInSchedule(day, index)}>{`${daysOfWeek[day].shortDay} From ${hourItem.beginHour} To ${hourItem.endHour}`}</li>))) }
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
