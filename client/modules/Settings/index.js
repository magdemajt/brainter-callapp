import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addAuthTags, deleteAuthTags, updateWithTags, updateAuthWithTags, getTags, updatePhoto, getUsers, getUsersByTags, getUser, updateEmail, updatePassword } from '../../axiosWrappers/users';
import history from '../../history';
import cookie from 'cookies-js';
import settingEnum from './settingEnum';
import Toolbar from './components/Toolbar';
import SetEmail from './components/SetEmail';
import { checkIfEmailAvailable } from '../../axiosWrappers/login';
import { validateEmail, validatePassword } from '../../components/validation';
import SetPass from './components/SetPass';
import { getPermission } from '../../axiosWrappers/admin';
// Import Style


// Import Components

// Import Actions

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
      emailAvailable: false,
      email: '',
      oldPass: '',
      pass: '',
      passError: ''
    };
  }

  componentDidMount() {
    this.props.socket.on('edited', data => {
      this.props.initUser(data.user);
    })
    getPermission((res) => {
      const permission = Number(res.data);
      if(permission > 0 && permission <= 3) {
        this.props.initPermission(permission);
      }
    }, (err) => {});
  }

  changeActive = (newActive) => {
    this.setState({ active: newActive });
  }

  logOut = () => {
    this.props.socket.emit('user_not_active');
    this.props.resetState();
    cookie.expire('token');
    cookie.expire('io');
  };

  changeEmail = (newMail) => {
    checkIfEmailAvailable(newMail.trim(), (res) => {
      if (!!res.data && validateEmail(newMail)) {
        this.setState({ emailAvailable: true, email: newMail.trim() });
      }
    });
  }

  updateEmail = () => {
    if (this.state.email !== '' && this.state.emailAvailable) {
      updateEmail(this.state.email, (res) => {
        if (res.data !== null) {
          this.props.initUser({ ...this.props.authUser, email: res.data });
          this.setState({ email: '', emailAvailable: false });
        }
      })
    }
  }

  changePassword = (newPass) => {
    if (newPass.trim().length > 0 && validatePassword(newPass)) {
      this.setState({ pass: newPass });
    }
  }
  changeOldPassword = (oldPass) => {
    if (oldPass.trim().length > 0 && validatePassword(oldPass)) {
      this.setState({ oldPass })
    }
  }

  updatePassword = () => {
    if (this.state.pass !== '' && this.state.oldPass !== '') {
      updatePassword(this.state.oldPass, this.state.pass, (res) => {
        if (res.data === '0') {
          this.setState({ pass: '', passError: '', oldPass: '' });
        } else if (res.data === '1') {
          this.setState({ passError: 'Incorrect old password' });
        }
      })
    }
  }

  render() {
    let view = null;
    switch (this.state.active) {
      case settingEnum.email: {
        view = (<SetEmail confirm={this.updateEmail} onChange={this.changeEmail} defaultValue={this.props.authUser.email} available={this.state.emailAvailable}/>);
        break;
      } case settingEnum.pass: {
        view = (<SetPass confirm={this.updatePassword} onChange={this.changePassword} onChangeOld={this.changeOldPassword} defaultValue={''} disabled={validatePassword(this.state.pass) && validatePassword(this.state.oldPass)} />);
        break;
      } case settingEnum.privacy: {

      }
    }
    return (
      <div className="container fluid offset-8 flex ml-1-5">
        <div className="card">
          {view}
        </div>
        <Toolbar changeSettingPage={this.changeActive} permission={this.props.permission} logOut={this.logOut}/>
      </div>
    );
  }
}

// Retrieve data from store as props
const mapStateToProps = (state) => {
  return {
    users: state.search.users,
    authUser: state.userData.user,
    tags: state.tags.tags,
    selectedTags: state.search.selectedTags,
    socket: state.io.socket,
    permission: state.admin.permission
  };
};
/* eslint-disable */
const mapDispatchToProps = (dispatch) => {
  return {
    initUsers: (users) => dispatch({
      type: 'INIT_SEARCH_USERS',
      users,
    }),
    initUser: (user) => dispatch({
      type: 'INIT_USER',
      user,
    }),
    initTags: (tags) => dispatch({
      type: 'INIT_TAGS',
      tags
    }),
    initPermission: (permission) => dispatch({
      type: 'INIT_PERMISSION',
      permission
    }),
    resetState: () => dispatch({
      type: 'RESET'
    })
  };
};
/* eslint-enable */

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
