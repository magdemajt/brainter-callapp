/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import Tooltip from 'rc-tooltip';
import { translate } from 'react-polyglot';

class UsersSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recUsers: [] //recommended users to talk
    };
    this.setListeners = false;
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.socket !== undefined && !this.setListeners) {
      this.props.socket.removeListener('recom_users');
      this.props.socket.on('recom_users', (data) => {
        this.setState({ recUsers: data.users });
      });
      this.props.socket.emit('get_recom_users');
      this.setListeners = true;
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
      tags: this.state.tags.map((tag, index) => {
        if (!this.state.selectedTags.find(t => { return t._id === tag._id })) {
          return (
            <li className="list-el" key={tag.name + '2'}>
              {tag.name}
              <button className="btn xsm" type="button" onClick={() => this.addTag(index)}>Add</button>
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
    return ();
  }
}
const mapStateToProps = state => ({
  socket: state.io.socket,
  talk: state.talk.talk,
  messageUsers: state.messages.messageUsers,
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
export default translate()(connect(mapStateToProps, mapDispatchToProps)(UsersSidebar));
/* eslint-enable */
