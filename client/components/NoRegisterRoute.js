/* eslint-disable */
import React from 'react'
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';

const NoRegisterRoute = ({ component: Component, user, ...rest }) => {
  return (
  <Route {...rest} render={(props) => (
    !user.token
      ? <Component {...props} />
      : <Redirect to='/' />
  )} />
)};

const mapStateToProps = (state) => {
  return {
    user: state.userData.user
  };
};

export default connect(mapStateToProps)(NoRegisterRoute);
/* eslint-enable */
