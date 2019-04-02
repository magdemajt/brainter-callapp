/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import Modal from './Modal';
import Tooltip from 'rc-tooltip';
import { translate } from 'react-polyglot';
import history from '../history';

class MultiTalkTeacherModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmed: false,
      users: [],
      tags: [],
      dateNow: Date.now
    };
    this.setListeners = false;
  }

  componentDidUpdate () {
    if (this.props.socket !== undefined && !this.setListeners) {
      this.setListeners = true;
      this.props.socket.removeListener('multi_joined');
      this.props.socket.removeListener('multi_left');
      this.props.socket.removeListener('get_multi_list');
      this.props.socket.removeListener('destroyed_multi_talk');
      this.props.socket.removeListener('started_multi_talk');
      this.props.socket.on('multi_joined', (data) => {
        this.setState({ users: this.state.users.concat(data.user) });
      });
      this.props.socket.on('multi_left', (data) => {
        this.setState({ users: this.state.users.filter(u => u._id !== data.user._id) });
      });
      this.props.socket.on('get_multi_list', (data) => {
        this.props.socket.emit('multi_list', { users: this.state.users });
      });
      this.props.socket.on('destroyed_multi_talk', (data) => {
        this.props.initTeacherTalks([]);
        history.push('/users');
      });
      this.props.socket.on('started_multi_talk', (data) => {
        history.push('/multitalk');
      });
    }
  }

  generateUsers = () => {
    if (this.props.teacher) {
      return this.state.users.map(user => {
        return (
          <li>
            {user.name}
            <button className="btn xsm outline-danger" onClick={() => {this.props.socket.emit('multi_kick_user', { talk: this.props.talks[0], user })}}/>
          </li>
        );
      })
    }
    return this.state.users.map(user => {
      return (
        <li>
          {user.name}
        </li>
      );
    })
  }

  startTalk = () => {
    this.props.socket.emit('start_multi_talk', { talk: this.props.talks[0] });
  }

  cancelClick = () => {
    if (this.props.teacher) {
      this.props.socket.emit('destroy_multi_talk', { talk: this.props.talks[0] });
    } else {
      this.props.socket.emit('leave_multi_room', { talk: this.props.talks[0] })
    }
    this.props.initTeacherTalks([]);
    this.props.closeModal();
  }

  render () {
    const props = this.props;
    const modalConfirm = (
        <button id="btn outline-success" onClick={() => this.startTalk()} >
          {props.t('talk.startCall')}
        </button>
    );
    const modalCancel = (
        <button id="btn outline-danger" onClick={() => { props.socket.emit('destroy_multi_talk', { talk: props.talks[0] }); props.initTeacherTalks([]); }}>
          {props.t('talk.cancelCall')}
        </button>
    );
    const users = this.generateUsers();
    return (
      <Modal modalHeader={'Available talks'} calling={true} cancelButton={modalCancel} confirmButton={!this.props.teacher ? modalConfirm : null} opened={this.props.opened}>
            Users who joined: 
            <ul className="list" style={{maxHeight: '6.5rem'}}>
              {users}
            </ul>
      </Modal>
    );
  }
}
const mapStateToProps = state => ({
  socket: state.io.socket,
  talks: state.talk.teacherTalks,
  messageUser: state.talk.messageUser,
  authUser: state.userData.user
});
const mapDispatchToProps = dispatch => {
  return {
    startCalling: (messageUser) => dispatch({
      type: 'START_CALLING',
      messageUser
    }),
    initTeacherTalks: (teacherTalks) => dispatch({
      type: 'INIT_TEACHER_TALKS',
      teacherTalks
    }),
    removeTeacherTalk: (teacherTalk) => dispatch({
      type: 'REMOVE_TEACHER_TALK',
      teacherTalk
    })
  };
}
export default translate()(connect(mapStateToProps, mapDispatchToProps)(MultiTalkTeacherModal));
/* eslint-enable */
