import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LoginInput from './login/LoginInput';
import history from '../../history';
// Import Style


// Import Components

// Import Actions

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { isMounted: false };
  }

  componentDidMount() {
    this.setState({ isMounted: true }); // eslint-disable-line
  }

  render() {
    return (
      <div className="container center">
        <LoginInput />
        <button onClick={() => { history.push('/register') ;}} className="btn secondary">Register</button>
      </div>
    );
  }
}

// Retrieve data from store as props
const mapStateToProps = state => ({
  user: state.userData.user,
});
/* eslint-disable */
const mapDispatchToProps = (dispatch) => {
  return {
    initUser: (user) => dispatch({
      type: 'TOGGLE_INIT_USER',
      user,
    }),
  };
};
/* eslint-enable */

export default connect(mapStateToProps, mapDispatchToProps)(Login);
