import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { addMonths } from 'date-fns';

const MyLessons = ({

}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addMonths(new Date(), 1));
  const test = '';
  return (
    <React.Fragment>
      {/* <ManageCancellation */}
      {/* <UpcomingLessons /> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(MyLessons);
