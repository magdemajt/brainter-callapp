/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import Modal from './Modal';
import Tooltip from 'rc-tooltip';
import { translate } from 'react-polyglot';
import history from '../history';

class CallingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: '',
      confirmed: false,
      selectedTags: [],
      tags: [],
      caller: false
    };
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.authUser !== undefined && this.props.authUser.tags !== undefined && this.props.authUser.tags.length > 0 && (prevProps.authUser === undefined || prevProps.authUser.tags === undefined || (prevProps.authUser.tags.length !== this.props.authUser.tags.length))) {
      this.setState({ tags: this.props.authUser.tags });
    }
    if(prevState.confirmed === false && this.state.confirmed) {
      setTimeout(() => {
        this.endCalling();
      }, 8000);
    }
  }

  addTag = (index) => {
    console.log('Hello')
    if (this.state.selectedTags.length < 3) {
      const newTags = this.state.selectedTags.concat(this.state.tags[index]);
      this.setState({ selectedTags: newTags });
    }
  }

  generateTags = () => {
    const tagsToGenerate = {
      selected: this.state.selectedTags.map((tag, index) => {
        return (
          <li className="list-el selected-el" key={tag.name + '1'} onClick={() => this.removeTag(index)}>
            {tag.name}
          </li>
        );
      }),
      tags: this.state.tags.map((tag, index) => {
        if (!this.state.selectedTags.find(t => { return t._id === tag._id })) {
          return (
            <li className="list-el" key={tag.name + '2'} onClick={() => this.addTag(index)}>
              {tag.name}
            </li>
          );
        } else {
          return null;
        }
      }),
      tagsNoButton: this.state.selectedTags.map((tag, index) => {
        return (
          <li className="list-el" key={tag.name + '3'}>
            {tag.name}
          </li>
        );
      }),
    };
    return tagsToGenerate;
  }

  removeTag = (index) => {
    const newTags = this.state.selectedTags.filter((t, i) => { return index !== i });
    this.setState({ selectedTags: newTags });
  } 

  editTopic = (topic) => {
    this.setState({ topic });
  }

  editConfirmed = (confirmed) => {
    this.setState({ confirmed });
  }
  clearState = () => {
    this.setState({ topic: '', confirmed: false, selectedTags: [] });
  }
  endCalling = () => {
    this.clearState();
    this.props.startCalling(null);
  }

  abortCall = () => {
    this.props.socket.emit('abort_call_client', { messageUser: this.props.messageUser });
    this.endCalling();
    try {
      this.props.localStream.getTracks().forEach(track => track.stop());
    } catch (e) {

    }
    history.push('/');
  }

  getCaller = () => {
    try {
      const messageUser = this.props.messageUsers.find(mu => mu._id === this.props.messageUser);
      if (messageUser.participants.length > 2) {
        return this.props.authUser._id;
      } else {
        const otherUser = messageUser.participants.find(el => el._id !== this.props.authUser._id);
        return this.state.caller ? this.props.authUser._id : otherUser._id;
      }
    } catch (e) {
      return this.props.authUser._id
    }
  }

  render () {
    const props = this.props;
    if (this.props.clearState && (this.state.topic !== '' || this.state.confirmed)) {
      this.clearState();
      this.props.editClear(false);
    }
    const modalConfirm = (
      <Tooltip placement="top" trigger={['hover']} overlay={props.t('talk.startCall')} >
        <button id="modalAnswerButton" onClick={() => { props.socket.emit('create_incoming_call', { topic: this.state.topic || 'No topic', messageUser: props.messageUser, tags: this.state.selectedTags, caller: this.getCaller() }); this.editConfirmed(true); }} >
          <i className="border" /> 
        </button>
      </Tooltip>
    );
    const modalCancel = (
      <Tooltip placement="top" trigger={['hover']} overlay={props.t('talk.cancelCall')} >
        <button id="modalRejectButton" onClick={() => { this.state.confirmed ? (this.abortCall()) : this.endCalling() }}>
          <i className="border" />
        </button>
      </Tooltip>
    );
    const tags = this.generateTags();
    return (
      <Modal modalHeader={'Outcoming call'} calling={true} cancelButton={modalCancel} confirmButton={!this.state.confirmed ? modalConfirm: null} opened={props.opened}>
        {this.state.confirmed ? 
        ( <React.Fragment>
            Calling, topic: {this.state.topic || 'No topic'}
            <ul className="list" style={{maxHeight: '6.5rem'}}>
              {tags.tagsNoButton}
            </ul>
          </React.Fragment>) :
          <React.Fragment>
            <input type="checkbox" value={this.state.caller} onChange={(e) => this.setState({ caller: !this.state.caller })} /> I am teacher.
            Enter tags of the talk
            <ul className="list" style={{maxHeight: '6.5rem'}}>
              {tags.selected}
              <hr />
              {tags.tags}
            </ul>
            <input className="input" type="text" value={this.state.topic} placeholder="Here enter the topic of talk..." onChange={(e) => {this.editTopic(e.target.value)}} />
            Once you confirm the topic there is no way back!!!
          </React.Fragment>
        }
      </Modal>
    );
  }
}
const mapStateToProps = state => ({
  socket: state.io.socket,
  talk: state.talk.talk,
  messageUsers: state.messages.messageUsers,
  messageUser: state.talk.messageUser,
  authUser: state.userData.user,
  localStream: state.talk.localStream
});
const mapDispatchToProps = dispatch => {
  return {
    startCalling: (messageUser) => dispatch({
      type: 'START_CALLING',
      messageUser
    })
  };
}
export default translate()(connect(mapStateToProps, mapDispatchToProps)(CallingModal));
/* eslint-enable */
