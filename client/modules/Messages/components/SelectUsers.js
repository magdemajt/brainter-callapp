import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from '../../../components/Modal';
import { escapeRegExp } from '../../../components/validation';

class SelectUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      selectedUsers: [],
      filter: ''
    };
  }

  changeFilter = (value) => {
    this.setState({ filter: escapeRegExp(value) });
    if (value !== '') {
      this.props.socket.emit('find_users', { filter: escapeRegExp(value) });
    } else {
      this.setState({users: []});
    }
  }

  componentDidMount () {
    this.props.socket.removeListener('found_users');
    this.props.socket.on('found_users', (data) => {
      this.setState({ users: data.users.filter(user => !this.state.selectedUsers.find(u => u._id === user._id) && user._id !== this.props.authUser._id) });
    });
  }

  generateUsers = () => {
    const users = [];
    this.state.selectedUsers.forEach((user, index) => {
      users.push(
        <li key={user._id + index} onClick={() => this.removeUser(user)} className="list-el selected-el">
          {user.name}
        </li>
      );
    })
    this.state.users.forEach((user, index) => {
      users.push(
        <li key={user._id + index} onClick={() => this.addUser(user)} className="list-el">
          {user.name}
        </li>
      );
    })
    return users;
  }

  addUser = (user) => {
    const newSelected = this.state.selectedUsers.concat(user);
    const newUsers = this.state.users.filter(u => u._id !== user._id);
    this.setState({ users: newUsers, selectedUsers: newSelected });
    this.props.changeSelected(newSelected);
  }

  removeUser = (user) => {
    const newUsers = this.state.users.concat(user);
    const newSelected = this.state.selectedUsers.filter(u => u._id !== user._id);
    this.setState({ users: newUsers, selectedUsers: newSelected });
    this.props.changeSelected(newSelected);
  }

  render() {
    return (
      <ul className="list" style={{ height: '80%' }}>
        {this.props.children}
        <input className="input" type="text" onChange={(e) => this.changeFilter(e.target.value)}/>
        {this.generateUsers()}
      </ul>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.userData.user,
  user: state.messages.user,
  socket: state.io.socket
});
export default connect(mapStateToProps)(SelectUsers);
