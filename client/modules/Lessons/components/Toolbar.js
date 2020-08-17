import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';

const Toolbar = ({
  currentViewState, teacherState
}) => {
  const [teacher, setTeacher] = teacherState;
  const [currentView, setCurrentView] = currentViewState;
  const viewOptionsStudent = [{ view: 'mylessons', label: 'My lessons' }, { view: 'buylessons', label: 'Buy lessons' }, { view: 'pastlessons', label: 'Past lessons' }, { view: 'availabletime', label: 'Time you are available' }];
  const viewOptionsTeacher = [];
  return (
    <div className="sidebar right flex">
      {viewOptionsStudent.map(opt => (
        <button key={opt.view} className={opt.view === currentView ? 'btn' : 'btn default'} onClick={() => setCurrentView(opt.view)} type="button">{opt.label}</button>
      ))}
      {/* <button /> Teacher - student button */}
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

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
