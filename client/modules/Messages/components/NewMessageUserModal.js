/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import Modal from '../../../components/Modal';
import Tooltip from 'rc-tooltip';
import { translate } from 'react-polyglot';
import SelectUsers from './SelectUsers';

class NewMessageUserModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: []
    };
  }

  changeParticipants = (parts) => {
    this.setState({ participants: parts });
  }

  createMessageUser = () => {
    this.props.socket.emit('begin_chat', {
      talk: false,
      participants: [
        ...this.state.participants.map(part => part._id)
      ]
    });
    this.props.closeModal();
  }

  render () {
    const modalConfirm = (
      <button className="btn outline-success" onClick={() => { this.createMessageUser() }} >
        Confirm
      </button>
    );
    const modalCancel = (
      <button className="btn outline-danger" onClick={() => { this.props.closeModal() }}>
        Cancel
      </button>
    );
    return (
      <Modal modalHeader={'Creating new conversation'} calling={false} cancelButton={modalCancel} confirmButton={modalConfirm} opened={this.props.opened}>
            Select users for conversation
            <SelectUsers changeSelected={this.changeParticipants} />
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
export default translate()(connect(mapStateToProps, mapDispatchToProps)(NewMessageUserModal));
/* eslint-enable */
