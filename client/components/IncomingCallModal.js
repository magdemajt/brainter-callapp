/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import Modal from './Modal';
import Tooltip from 'rc-tooltip';
import { translate } from 'react-polyglot';

const IncomingCallModal = (props) => {
  let tags = [];
  if (props.talk !== undefined && props.talk.tags !== undefined) {
    tags = props.talk.tags.map((tag, index) => {
      return (
        <li className="list-el">
          {tag.name}
        </li>
      )
    });
  }
  const modalConfirm = (
    <Tooltip placement="top" trigger={['hover']} overlay={props.t('talk.answer')} >
      <button id="modalAnswerButton" onClick={() => {props.socket.emit('answer_call_client', { messageUser: props.talk.messageUser }) } }>
        <i className="border" /> 
      </button>
    </Tooltip>
  );
  const modalCancel = (
    <Tooltip placement="top" trigger={['hover']} overlay={props.t('talk.reject')} >
      <button id="modalRejectButton" onClick={() => {props.editTalkModal(false)}}>
        <i className="border" />
      </button>
    </Tooltip>
  );
  return (
    <Modal modalHeader={'Incoming call'} confirmButton={modalConfirm} cancelButton={modalCancel} opened={props.opened} calling={true}>
      Incoming call, topic {props.talk.topic}
      {tags.length > 0 ? (
        <React.Fragment>
          Tags:
          <ul className="list" style={{maxHeight: '6.5rem'}}>
            {tags}
          </ul>
        </React.Fragment>) : null}
    </Modal>
  );
};
const mapStateToProps = state => ({
  socket: state.io.socket,
  talk: state.talk.talk
});
export default translate()(connect(mapStateToProps)(IncomingCallModal));
/* eslint-enable */
