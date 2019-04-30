import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Toolbar from './components/Toolbar';
import history from '../../history';
import MyLessons from './components/MyLessons';
import BuyLessons from './components/BuyLessons';
import LessonsCalendar from './components/LessonsCalendar';

const Lessons = ({
  socket, authUser
}) => {
  const [currentView, setCurrentView] = useState('mylessons');
  const [timetable, setTimetable] = useState([{ day: 'monday', hoursPlan: (new Array(24 * 2)).fill(false) }, { day: 'tuesday', hoursPlan: (new Array(24 * 2)).fill(false) }, { day: 'wednesday', hoursPlan: (new Array(24 * 2)).fill(false) }, { day: 'thursday', hoursPlan: (new Array(24 * 2)).fill(false) }, { day: 'friday', hoursPlan: (new Array(24 * 2)).fill(false) }, { day: 'saturday', hoursPlan: (new Array(24 * 2)).fill(false) }, { day: 'sunday', hoursPlan: (new Array(24 * 2)).fill(false) }]);
  useEffect(() => {
    if (authUser.timetable.length > 0) {
      setTimetable(_.flattenDeep(authUser.timetable));
    }
  }, [authUser]);
  function generateCurrentView() {
    let view = null;
    switch (currentView) {
      case 'availabletime':
        view = (<LessonsCalendar timetableState={[timetable, setTimetable]} />);
        break;
      case 'mylessons':
        view = (<MyLessons />);
        break;
      case 'buylessons':
        view = (<BuyLessons />);
        break;
      case 'pastlessons':
        // view = (<PastLessons />);
        break;

      default:
        history.push('/');
        break;
    }
    return view;
  }
  return (
    <div className="container center offset-8 fluid height-60 flex space-between">
      {generateCurrentView()}
      <Toolbar currentViewState={[currentView, setCurrentView]} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Lessons);
