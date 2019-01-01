/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
const PrivateRoute = ({ component: Component, user, ...rest }) => (
  <Route {...rest} render={(props) => (
    user.token
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
);

const mapStateToProps = (state) => {
  return {
    user: state.userData.user
  };
};

export default connect(mapStateToProps)(PrivateRoute);
/* eslint-enable */
