/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import Modal from './Modal';
import Tooltip from 'rc-tooltip';
import { translate } from 'react-polyglot';

const TagTalkModal = (props) => {
  const modalConfirm = (
    <Tooltip placement="top" trigger={['hover']} overlay={props.t('talk.answer')} >
      <button id="modalAnswerButton" onClick={() => {props.socket.emit('answer_call_client', { messageUser: props.talk.messageUser }) } }>
        <i className="border" /> 
      </button>
    </Tooltip>
  );
  const modalCancel = (
    <Tooltip placement="top" trigger={['hover']} overlay={props.t('talk.reject')} >
      <button id="modalRejectButton" onClick={() => {props.socket.emit('abort_call_client', { messageUser: props.talk.messageUser }) }}>
        <i className="border" />
      </button>
    </Tooltip>
  );
  return (
    <Modal modalHeader={'Incoming call'} confirmButton={modalConfirm} cancelButton={modalCancel} opened={props.opened} calling={true}>
      Waiting for teacher...
    </Modal>
  );
};
const mapStateToProps = state => ({
  socket: state.io.socket,
  talk: state.talk.talk
});
export default translate()(connect(mapStateToProps)(TagTalkModal));
/* eslint-enable */
