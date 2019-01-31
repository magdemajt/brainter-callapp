/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import Modal from './Modal';
import Tooltip from 'rc-tooltip';
import { translate } from 'react-polyglot';

const TagTalkModal = (props) => {
  const modalCancel = (
    <Tooltip placement="top" trigger={['hover']} overlay={props.t('talk.reject')} >
      <button id="modalRejectButton" onClick={() => { props.socket.emit('cancel_teacher_talk', { talk: props.talks[0] }); props.initTeacherTalks([]); }}>
        <i className="border" />
      </button>
    </Tooltip>
  );
  return (
    <Modal modalHeader={'Waiting for Teacher....'} confirmButton={<React.Fragment></React.Fragment>} cancelButton={modalCancel} opened={props.opened} calling={true}>
      Waiting for teacher...
    </Modal>
  );
};
const mapStateToProps = state => ({
  socket: state.io.socket,
  talks: state.talk.teacherTalks
});
const mapDispToProps = dispatch => {
  return {
    initTeacherTalks: (teacherTalks) => dispatch({
      type: 'INIT_TEACHER_TALKS',
      teacherTalks
    }),
  };
};
export default translate()(connect(mapStateToProps, mapDispToProps)(TagTalkModal));
/* eslint-enable */
