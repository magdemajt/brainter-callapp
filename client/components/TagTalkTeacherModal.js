/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import Modal from './Modal';
import Tooltip from 'rc-tooltip';
import { translate } from 'react-polyglot';

class TagTalkTeacherModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmed: false,
      selectedTags: [],
      tags: [],
    };
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.authUser !== undefined && this.props.authUser.tags !== undefined && this.props.authUser.tags.length > 0 && (prevProps.authUser === undefined || prevProps.authUser.tags === undefined || (prevProps.authUser.tags.length !== this.props.authUser.tags.length))) {
      this.setState({ tags: this.props.authUser.tags.filter(tag => tag.level > 5) });
    }
  }

  generateTalks = () => {
    return this.props.talks.map(talk => {
      const tags = (
        <Tooltip overlay={(<ul className="list">{this.generateTags(talk.selectedTags)}</ul>)}>
          <span>{talk.selectedTags.length}</span>
        </Tooltip>
      );
      return (
        <li className="list-el">
        {talk.topic}
        {talk.user.name}
        {tags}
        <button className="btn xsm" type="button" onClick={() => this.selectTalk(talk)}>Teach</button>
        </li>
      );
    });
  }
  generateTags = (tags) => {
    return tags.map(tag => (
      <li key={tag._id} className="list-el">
        {tag.name}
      </li>
    ));
  };

  selectTalk = (talk) => {
    this.props.socket.emit('select_talk', { talk });
  }

  render () {
    const props = this.props;
    if (this.props.clearState && (this.state.topic !== '' || this.state.confirmed)) {
      this.clearState();
      this.props.editClear(false);
    }
    const modalConfirm = (
      <Tooltip placement="top" trigger={['hover']} overlay={props.t('talk.startCall')} >
        <button id="modalAnswerButton" onClick={() => { props.socket.emit('create_incoming_call', { topic: this.state.topic || 'No topic', messageUser: props.messageUser, tags: this.state.selectedTags, caller: this.props.authUser._id }); this.editConfirmed(true); }} >
          <i className="border" /> 
        </button>
      </Tooltip>
    );
    const modalCancel = (
      <Tooltip placement="top" trigger={['hover']} overlay={props.t('talk.cancelCall')} >
        <button id="modalRejectButton" onClick={() => { this.state.confirmed ? props.socket.emit('abort_call_client', { messageUser: props.messageUser }) : this.endCalling() }}>
          <i className="border" />
        </button>
      </Tooltip>
    );
    const talks = this.generateTalks();
    return (
      <Modal modalHeader={'Outcoming call'} calling={true} cancelButton={modalCancel} confirmButton={!this.state.confirmed ? modalConfirm: null} opened={this.props.opened}>
            Enter tags of the talk
            <ul className="list" style={{maxHeight: '6.5rem'}}>
              {talks}
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
    })
  };
}
export default translate()(connect(mapStateToProps, mapDispatchToProps)(TagTalkTeacherModal));
/* eslint-enable */
