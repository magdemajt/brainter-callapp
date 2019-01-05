/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import Modal from './Modal';

class CallingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: '',
      confirmed: false,
      selectedTags: [],
      tags: [],
    };
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.authUser !== undefined && this.props.authUser.tags !== undefined && this.props.authUser.tags.length > 0 && this.state.tags.length === 0) {
      this.setState({ tags: this.props.authUser.tags });
    }
  }

  addTag = (index) => {
    if (this.state.tags.length < 3) {
      const newTags = this.state.selectedTags.concat(this.state.tags[index]);
      this.setState({ selectedTags: newTags });
    }
  }

  generateTags = () => {
    const tagsToGenerate = {
      selected: this.state.selectedTags.map((tag, index) => {
        return (
          <li className="list-el" key={tag.name + '1'}>
            {tag.name}
            <button className="btn xsm" type="button" onClick={() => this.removeTag(index)}>Remove</button>
          </li>
        );
      }),
      tags: this.state.tags.filter(el => { return !this.state.selectedTags.find(t => { return t._id === el._id }) }).map((tag, index) => {
        return (
          <li className="list-el" key={tag.name + '2'}>
            {tag.name}
            <button className="btn xsm" type="button" onClick={() => this.addTag(index)}>Add</button>
          </li>
        );
      })
    };
    console.log('generating t')
    return tagsToGenerate;
  }

  removeTag = (index) => {
    const newTags = this.state.selectedTags.filter(t => { t._id !== this.state.tags[index]._id });
    this.setState({ selectedTags: newTags });
  } 

  editTopic = (topic) => {
    this.setState({ topic });
  }

  editConfirmed = (confirmed) => {
    this.setState({ confirmed });
  }
  clearState = () => {
    this.setState({ topic: '', confirmed: false });
  }
  endCalling = () => {
    this.clearState();
    this.props.startCalling(null);
  } 

  render () {
    const props = this.props;
    if (this.props.clearState && (this.state.topic !== '' || this.state.confirmed)) {
      this.clearState();
      this.props.editClear(false);
    }
    const tags = this.generateTags();
    return (
      <Modal modalHeader={'Incoming call'} calling={true} onCancelModal={() => {this.state.confirmed ? props.socket.emit('abort_call_client', { messageUser: props.talk.messageUser }) : this.endCalling() }} onConfirmModal={() => { props.socket.emit('create_incoming_call', { topic: this.state.topic || 'No topic', messageUser: props.messageUser, tags: this.state.selectedTags.map(tag => tag._id)}); this.editConfirmed(true); }} opened={props.opened}>
        {this.state.confirmed ? (<React.Fragment>Calling, topic: {this.state.topic || 'No topic'}</React.Fragment>) :
          <React.Fragment>
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
export default connect(mapStateToProps, mapDispatchToProps)(CallingModal);
/* eslint-enable */
