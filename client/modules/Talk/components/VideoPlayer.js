import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-polyglot';
import Tooltip from 'rc-tooltip';
import TalkTools from './TalkTools';
// Import Style


// Import Components
const VideoPlayer = ({
  peers, remoteStreams, localStream, t, children, onEndCall
}) => {
  const localVideo = useRef(null);
  let remoteVideos = [];
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);

  function setStreamForVideo(stream, videoElement) {
    try {
      videoElement.current.srcObject = stream;
    } catch (error) {
      videoElement.src = stream !== null ? URL.createObjectURL(stream) : null;
    }
  }

  function sendMessageToPeers(message = '', payload = {}) {
    peers.forEach((peer) => {
      peer.send(JSON.stringify({ type: message, ...payload }));
    });
  }

  function muteVideo(videoElement) {
    videoElement.muted = true;
  }

  function muteOrUnmuteRemote() {
    if (!muted) {
      sendMessageToPeers('MUTE_REMOTE');
    } else {
      sendMessageToPeers('UNMUTE_REMOTE');
    }
    setMuted(!muted);
  }

  function muteOrUnmuteVideo() {
    if (videoMuted) {
      sendMessageToPeers('MUTE_VIDEO');
    } else {
      sendMessageToPeers('UNMUTE_VIDEO');
    }
    setVideoMuted(!videoMuted);
  }

  useEffect(() => {
    setStreamForVideo(localStream, localVideo);
  }, [localStream]);

  useEffect(() => {
    remoteStreams.forEach((stream) => {
      const videoRef = useRef();
      setStreamForVideo(stream, videoRef);
      remoteVideos.push(videoRef);
    });
    return () => {
      remoteVideos = [];
    };
  }, [remoteStreams]);

  return (
    <div id="talkDiv">
      <video id="localVideo" ref={localVideo} autoPlay controls={false} muted />
      {remoteVideos.map(video => (
        // Size of this window should depend on number of connected users
        <video id="remoteVideo" ref={video} autoPlay controls={false} />
      ))}
      {children}
      <TalkTools onEndCall={onEndCall} onMute={muteOrUnmuteRemote} onVideoMute={muteOrUnmuteVideo} muted={muted} videoMuted={videoMuted} />
    </div>
  );
};
// Import Actions
// class VideoPlayer extends React.Component {
//   constructor(props) {
//     super(props);
//     this.localVideo = React.createRef();
//     this.remoteVideo = React.createRef();
//     this.state = {
//       muted: false,
//       videoMuted: false,
//       showControls: false
//     };
//   }
//   muteLocal = () => {
//     this.localVideo.muted = true;
//   }
//   muteOrUnmuteRemote = () => {
//     if(!this.state.muted) {
//       this.props.muteLocal();
//     } else {
//       this.props.unmuteLocal();
//     }
//     this.setState({muted: !this.state.muted});
//   }
//   muteOrUnmuteVideo = () => {
//     if(!this.state.videoMuted) {
//       this.props.muteVideo();
//     } else {
//       this.props.unmuteVideo();
//     }
//     this.setState({videoMuted: !this.state.videoMuted});
//   }
//   componentDidUpdate() {
//     const { localStream, remoteStream } = this.props;
//     try {
//       this.localVideo.current.srcObject = localStream;
//     } catch (error) {
//       this.localVideo.src = localStream !== null ? URL.createObjectURL(localStream) : null;
//     }
//     try {
//       this.remoteVideo.current.srcObject = remoteStream;
//     } catch (error) {
//       this.remoteVideo.src = remoteStream !== null ? URL.createObjectURL(remoteStream) : null;
//     }
//   }

//   render() {
//     return (
//       <div id="talkDiv">
//         <video id="localVideo" ref={this.localVideo} autoPlay controls={false} muted onVolumeChange={this.muteLocal} />
//         <video id="remoteVideo" ref={this.remoteVideo} autoPlay controls={false} />
//         <div id="buttonsDiv">
//           <Tooltip trigger={['hover']} placement="top" overlay={this.props.t('talk.disconnect')}>
//             <button id="disconnectButton" onClick={this.props.onEndCall} />
//           </Tooltip>
//           <Tooltip trigger={['hover']} placement="top" overlay={this.state.muted ? this.props.t('talk.unmute') : this.props.t('talk.mute')}>
//             <button id={this.state.muted ? 'unmuteButton' : 'muteButton'} onClick={this.muteOrUnmuteRemote} />
//           </Tooltip>
//           <Tooltip trigger={['hover']} placement="top" overlay={this.state.videoMuted ? this.props.t('talk.video') : this.props.t('talk.novideo')}>
//             <button id={this.state.videoMuted ? 'novideoButton' : 'videoButton'} onClick={this.muteOrUnmuteVideo} />
//           </Tooltip>
//         </div>
//       </div>
//     );
//   }
// }
// Retrieve data from store as props
const mapStateToProps = state => ({
  filter: state.search.filter,
  users: state.search.users,
  authUser: state.userData.user,
  remoteStreams: state.talk.remoteStream,
  localStream: state.talk.localStream,
});
/* eslint-disable */
const mapDispatchToProps = (dispatch) => {
  return {
    initFilter: (filter) => dispatch({
      type: 'INIT_FILTER',
      filter
    })
  };
};
/* eslint-enable */

export default translate()(connect(mapStateToProps, mapDispatchToProps)(VideoPlayer));
