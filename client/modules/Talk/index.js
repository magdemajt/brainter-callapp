import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from '../../history';
import VideoPlayer from './components/VideoPlayer';
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
      localStream: null,
      usedSignaling: false,
      remoteStream: null,
      localAudio: null,
      leftToConnect: 1
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
    }
  }
  /* eslint-disable */
  getMediaCreator = (constraints, error = false) => {
    navigator.mediaDevices.getUserMedia(constraints).then((localStream) => {
      if(this.state.localStream === null) {
        this.setState({ localStream });
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
        this.setState({ localStream });
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
      this.props.initP2P({ initiator: this.props.creator, stream: localStream, config: { iceServers: ices } });
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
      this.setState({ remoteStream: stream });
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
          this.state.remoteStream.getAudioTracks()[0].enabled = false;
          break;
        case 'UNMUTE_REMOTE': 
          this.state.remoteStream.getAudioTracks()[0].enabled = true;
          break;
        case 'MUTE_VIDEO': 
          this.state.remoteStream.getVideoTracks()[0].enabled = false;
          break;
        case 'UNMUTE_VIDEO':
          this.state.remoteStream.getVideoTracks()[0].enabled = true;
          break;
        case 'END_CALL': 
          this.clearCall();
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
      this.setState({remoteStream: stream});
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
    this.state.localStream.getTracks().forEach(track => track.stop());
    let destination = '/'; // calabria
    if (this.props.authUser._id !== this.props.talk.caller && this.props.talk.createdAt - Date.now() > 1000 * 60 * 30) {
      destination = '/surveys'
    }
    this.props.clearTalk();
    history.push(destination);
  }
  endCall = () => {
    this.props.p2p.send(JSON.stringify({ type: 'END_CALL' }));
    this.props.p2p.destroy();
    this.props.socket.emit('finish_call_client', { talk: this.props.talk });
    this.clearCall();
  }
  render() {
    return (
      <div className="container center offset-15">
        {/* <Blackboard /> */}
        
        <VideoPlayer localStream={this.state.localStream} remoteStream={this.state.remoteStream} onEndCall={this.endCall} muteLocal={this.muteLocalOutcoming} unmuteLocal={this.unmuteLocalOutcoming} muteVideo={this.muteVideo} unmuteVideo={this.unmuteVideo}/> 
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
  creator: state.talk.creator
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
    })
  };
};
/* eslint-enable */

export default connect(mapStateToProps, mapDispatchToProps)(Talk);
