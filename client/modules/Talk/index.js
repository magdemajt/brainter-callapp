import React, { Component } from 'react';
import { connect } from 'react-redux';
import Blackboard from './components/Blackboard';
import VideoPlayer from './components/VideoPlayer';
import history from '../../history';
// Import Style


// Import Components
var usedSignaling = false;
// Import Actions

class Talk extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    if (!this.props.talk.hasOwnProperty('_id')) {
      history.push('/');
    }
  }

  muteLocalOutcoming = () => {
    this.props.p2p.send(JSON.stringify({ type: 'MUTE_REMOTE' }));
    // this.setState({localAudio: this.state.localStream.getAudioTracks()[0].clone()});
    // this.props.p2p.removeTrack(this.state.localStream.getAudioTracks()[0], this.state.localStream);
  }
  unmuteLocalOutcoming = () => {
    this.props.p2p.send(JSON.stringify({ type: 'UNMUTE_REMOTE' }));
    // this.props.p2p.addTrack(this.state.localAudio, this.state.localStream);
    // this.state.localStream.addTrack(this.state.localAudio);
    // console.log('AddedTrackEvent')
  }

  muteVideo = () => {
    this.props.p2p.send(JSON.stringify({ type: 'MUTE_VIDEO' }));
  }

  unmuteVideo = () => {
    this.props.p2p.send(JSON.stringify({ type: 'UNMUTE_VIDEO' }));
  }

  clearCall = () => {
    this.props.localStream.getTracks().forEach(track => track.stop());
    let destination = '/'; // calabria
    if (this.props.authUser._id !== this.props.talk.caller && this.props.talk.createdAt - Date.now() > 1000 * 60 * 30) {
      destination = '/surveys'
    }
    this.props.clearTalk();
    history.push(destination);
  }
  endCall = () => {
    try {
      this.props.p2p.send(JSON.stringify({ type: 'END_CALL' }));
      this.props.p2p.destroy();
    } catch (e) {

    }
    this.props.socket.emit('finish_call_client', { talk: this.props.talk });
    this.props.socket.emit('change_blackboard', { talk: this.props.talk, blackboardText: this.props.blackboardText });
    this.clearCall();
  }

  changeText = (e) => {
    const blackboardText = e.target.value;
    this.props.editBlackboard(blackboardText);
    this.props.p2p.send(JSON.stringify({ blackboardText, type: 'BLACKBOARD_TEXT' }));
  }

  render() {
    return (
      <div className="container center fluid offset-8 hm flex justify-center">
        <VideoPlayer localStream={this.props.localStream} remoteStream={this.props.remoteStream} onEndCall={this.endCall} muteLocal={this.muteLocalOutcoming} unmuteLocal={this.unmuteLocalOutcoming} muteVideo={this.muteVideo} unmuteVideo={this.unmuteVideo}/> 
        <Blackboard text={this.props.blackboardText} changeText={this.changeText} caller={this.props.authUser._id === this.props.talk.caller} /> 
      </div>
    );
  }
}

// Retrieve data from store as props
const mapStateToProps = state => ({
  user: state.search.user,
  authUser: state.userData.user,
  socket: state.io.socket,
  messageUsers: state.messages.messageUsers,
  p2p: state.io.p2p,
  talk: state.talk.talk,
  creator: state.talk.creator,
  localStream: JSON.parse(state.talk.localStream),
  remoteStream: JSON.parse(state.talk.remoteStream),
  blackboardText: state.talk.blackboardText
});
/* eslint-disable */
const mapDispatchToProps = (dispatch) => {
  return {
    initUser: (user) => dispatch({
      type: 'INIT_SEARCH_USER',
      user,
    }),
    initP2P: (opts) => dispatch({
      type: 'INIT_P2P',
      opts
    }),
    clearTalk: () => dispatch({
      type: 'CLEAR_TALK'
    }),
    editBlackboard: (blackboardText) => dispatch({
      type: 'EDIT_BLACKBOARD',
      blackboardText
    })
  };
};
/* eslint-enable */

export default connect(mapStateToProps, mapDispatchToProps)(Talk);
