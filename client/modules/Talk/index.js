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
      calling: false,
      localPeer: null,
      remotePeer: null,
      usedSignaling: false,
      leftToConnect: 1,
      shown: true,
    };
  }

  componentDidMount() {
    this.props.socket.removeListener('create_peer_connection');
    this.props.socket.removeListener('peer_connection');
    this.props.socket.removeListener('got_token');

    if (!this.props.talk.hasOwnProperty('_id')) {
      history.push('/');
    } else {
      const constraints = {
        video: true,
        audio: true
      };
      try {
        if (this.props.creator) {
          this.props.socket.on('got_receiver_stream', () => {
            if (this.state.leftToConnect === 1) {
              this.getMediaCreator(constraints, false);
            } else {
              this.setState({ leftToConnect: this.state.leftToConnect - 1 });
            }
          });
        } else {
          this.getMedia(constraints, false);
        }
      } catch (e) {
        this.clearCall();
      }
    }
  }

  getMediaCreator = (constraints, error = false) => {
    navigator.mediaDevices.getUserMedia(constraints).then((localStream) => {
      if(this.props.localStream === null) {
        this.props.initLocal(localStream);
        this.sendSignalingData(localStream);
      }
    }).catch((err) => {
      if (err) {
        if (error === false) {
          this.getMediaCreator({audio: true}, 'video');
        } else if (error == 'video') {
          this.getMediaCreator({video: true}, 'audio');
        } else if (error == 'audio') {
          this.getMediaCreator({video: true}, 'other');
        }
      }
    });
  }
  getMedia = (constraints, error = false) => {
    navigator.mediaDevices.getUserMedia(constraints).then((localStream) => { // W Chromie wywołuje się dwa razy, naprawić!!!
        this.props.initLocal(localStream);
        this.sendSignalingData(localStream);
    }).catch((err) => {
      if (!!err) {
        if (error === false) {
          this.getMedia({audio: true}, 'video');
          console.log('Two')
        } else if (error == 'video') {
          this.getMedia({video: true}, 'audio');
        } else if (error == 'audio') {
          this.getMedia({video: true}, 'other');
        }
      }
    });
  }
  sendSignalingData(localStream) {
    this.props.socket.on('got_token', (data) => {
      console.log('Got_token')
      const ices = data.ices;
      this.props.initP2P({ initiator: this.props.creator, stream: localStream, config: { iceServers: ices }, reconnectTimer: 3000  });
      this.setPeerListeners();
      if (this.props.creator) {
        console.log('Creatoir');
        this.props.socket.on('peer_connection', (peerData) => {
          console.log(peerData.peer)
          this.setState({localPeer: peerData.peer});
          this.props.p2p.signal((peerData.peer));
          console.log('Signalled');
        });
        this.props.p2p.on('signal', (data) => {
          this.props.socket.emit('create_peer_connection', { peer: data, messageUser: this.props.talk.messageUser });
        });
      } else {
        this.props.socket.emit('receiver_stream', {messageUser: this.props.talk.messageUser});
        this.props.p2p.on('signal', (localPeer) => {
          console.log('Zwrotny');
          this.props.socket.emit('peer_connection', { messageUser: this.props.talk.messageUser, peer: localPeer });
          if(this.state.localPeer === null) {
            this.setState({localPeer});
          }
      });
        this.props.socket.on('create_peer_connection', (data) => {
          if(this.state.remotePeer === null) {
            this.setState({ remotePeer: data.peer });
          }
          console.log('createPeer');
          this.props.p2p.signal(data.peer);
        });
      }
    });
    this.props.socket.emit('get_token');   
  }
  /* eslint-enable */

  setPeerListeners() {
    this.props.p2p.on('stream', (stream) => {
      this.props.initRemote(stream);
    });
    this.props.p2p.on('connect', () => {
      console.log('Połączono przez webRTC');
    });
    this.props.p2p.on('error', (err) => {
      console.log('WebRTC bład', err);
      this.clearCall();
    });
    this.props.p2p.on('data', (sendData) => {
      const data = JSON.parse(sendData);
      switch (data.type) {
        case 'MUTE_REMOTE': 
          this.props.remoteStream.getAudioTracks()[0].enabled = false;
          break;
        case 'UNMUTE_REMOTE': 
          this.props.remoteStream.getAudioTracks()[0].enabled = true;
          break;
        case 'MUTE_VIDEO': 
          this.props.remoteStream.getVideoTracks()[0].enabled = false;
          break;
        case 'UNMUTE_VIDEO':
          this.props.remoteStream.getVideoTracks()[0].enabled = true;
          break;
        case 'END_CALL': 
          this.clearCall();
          break;
        case 'BLACKBOARD_TEXT':
          this.props.editBlackboard(data.blackboardText);
          break;
      }
      console.log(data);
    });
    this.props.p2p.on('close', () => {
      this.clearCall();
    });
    this.props.p2p.on('track', (track, stream) => {
      stream.addTrack(track);
      console.log('AddedTrack')
      this.props.initRemote(stream);
    });
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
  localStream: (state.talk.localStream),
  remoteStream: (state.talk.remoteStream),
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
    initLocal: (localStream) => dispatch({
      type: 'INIT_LOCAL_STREAM',
      localStream
    }),
    initRemote: (remoteStream) => dispatch({
      type: 'INIT_REMOTE_STREAM',
      remoteStream
    }),
    editBlackboard: (blackboardText) => dispatch({
      type: 'EDIT_BLACKBOARD',
      blackboardText
    })
  };
};
/* eslint-enable */

export default connect(mapStateToProps, mapDispatchToProps)(Talk);
