/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import Modal from './Modal';

const IncomingCallModal = (props) => (
    <Modal modalHeader={'Incoming call'} onCancelModal={() => {props.socket.emit('abort_call_client', { messageUser: props.talk.messageUser }) }} onConfirmModal={() => {props.socket.emit('answer_call_client', { messageUser: props.talk.messageUser }) } } opened={props.opened} calling={true}>
      Incoming call, topic {props.talk.topic}
    </Modal>
);
const mapStateToProps = state => ({
  socket: state.io.socket,
  talk: state.talk.talk
});
export default connect(mapStateToProps)(IncomingCallModal);
/* eslint-enable */
