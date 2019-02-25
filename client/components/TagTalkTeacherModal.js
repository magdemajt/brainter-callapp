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
      dateNow: Date.now
    };
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.authUser !== undefined && this.props.authUser.tags !== undefined && this.props.authUser.tags.length > 0 && (prevProps.authUser === undefined || prevProps.authUser.tags === undefined || (prevProps.authUser.tags.length !== this.props.authUser.tags.length))) {
      this.setState({ tags: this.props.authUser.tags.filter(tag => tag.level > 5) });
    }
  }
  componentDidMount () {
    this.interval = setInterval(() => {
      this.setState({ dateNow: Date.now });
    }, 1000)
  }

  componentWillUnmount () {
    clearInterval(this.interval);
  }

  generateTalks = () => {
    return this.props.talks.map(talk => {
      if (30 < (this.props.dateDifference + this.state.dateNow - talk.createdAt) / 1000) {
        this.props.removeTeacherTalk(talk);
      }
      const tags = (
        <Tooltip overlay={(<ul className="list">{this.generateTags(talk.selectedTags, talk._id)}</ul>)}>
          <span>{talk.selectedTags.length}</span>
        </Tooltip>
      );
      return (
        <li className="list-el" key={talk._id}>
        {talk.topic}
        {talk.user.name}
        {tags}
        {30 - (this.props.dateDifference + this.state.dateNow - talk.createdAt) / 1000} 
        {/* Nie wiem czy działa */}
        <button className="btn xsm" type="button" onClick={() => this.selectTalk(talk)}>{this.props.multi ? 'Learn' : 'Teach'}</button>
        </li>
      );
    });
  }
  generateTags = (tags, talk_id) => {
    return tags.map(tag => (
      <li key={tag._id} className="list-el" key={tag._id + talk_id}>
        {tag.name}
      </li>
    ));
  };

  selectTalk = (talk) => {
    if (this.props.multi) {
      this.props.socket.emit('join_multi_room', { talk });
    } else {
      this.props.socket.emit('select_talk', { talk });
    }
  }

  render () {
    const props = this.props;
    const modalCancel = (
      <Tooltip placement="top" trigger={['hover']} overlay={props.t('talk.cancelCall')} >
        <button id="modalRejectButton" onClick={() => { props.initTeacherTalks([]); this.props.closeModal() }}>
          <i className="border" />
        </button>
      </Tooltip>
    );
    const talks = this.generateTalks();
    return (
      <Modal modalHeader={'Available talks'} calling={true} cancelButton={modalCancel} confirmButton={null} opened={this.props.opened}>
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
export default translate()(connect(mapStateToProps, mapDispatchToProps)(TagTalkTeacherModal));
/* eslint-enable */
