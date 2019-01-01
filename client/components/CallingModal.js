/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import Modal from './Modal';

const CallingModal = (props) => (
    <Modal modalHeader={'Incoming call'} calling={true} onCancelModal={() => {props.socket.emit('abort_call_client', { messageUser: props.talk.messageUser }) }} opened={props.opened}>
      Calling, topic {props.talk.topic}
    </Modal>
);
const mapStateToProps = state => ({
  socket: state.io.socket,
  talk: state.talk.talk
});
export default connect(mapStateToProps)(CallingModal);
/* eslint-enable */
