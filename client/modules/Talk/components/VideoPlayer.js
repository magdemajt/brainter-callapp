import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-polyglot';
import Tooltip from 'rc-tooltip';
import TalkTools from './TalkTools';
// Import Style


// Import Components
const VideoPlayer = ({
  peers, remoteStreams, localStream, t, children, onEndCall, usersLength
}) => {
  const localVideo = useRef(null);
  let remoteVideos = [];
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const refs = [];
  for (let i = 0; i < usersLength; i += 1) {
    refs.push(useRef(null));
  }

  function muteLocal() {
    peers.forEach((p2p) => {
      p2p.streams[0].getAudioTracks()[0].enabled = !muted;
    });
  }
  // function unmuteLocal() {
  //   peers.forEach((p2p) => {
  //     p2p.streams[0].getAudioTracks()[0].enabled = true;
  //   });
  // }

  function muteLocalVideo() {
    peers.forEach((p2p) => {
      p2p.streams[0].getVideoTracks()[0].enabled = !videoMuted;
    });
  }

  useEffect(() => {
    muteLocal();
  }, [muted, remoteStreams]);

  useEffect(() => {
    muteLocalVideo();
  }, [videoMuted, remoteStreams]);

  // function unmuteLocalVideo() {
  //   peers.forEach((p2p) => {
  //     p2p.streams[0].getVideoTracks()[0].enabled = true;
  //   });
  // }

  function setStreamForVideo(stream, videoElement) {
    try {
      videoElement.current.srcObject = stream;
    } catch (error) {
      console.error(error);
      videoElement.src = stream !== null ? URL.createObjectURL(stream) : null;
    }
  }

  function muteVideo(videoElement) {
    videoElement.muted = true;
  }

  function muteOrUnmuteRemote() {
    // if (!muted) {
    //   muteLocal();
    // } else {
    //   unmuteLocal();
    // }
    setMuted(!muted);
  }

  function muteOrUnmuteVideo() {
    // if (!videoMuted) {
    //   muteLocalVideo();
    // } else {
    //   unmuteLocalVideo();
    // }
    setVideoMuted(!videoMuted);
  }

  useEffect(() => {
    setStreamForVideo(localStream, localVideo);
  }, [localStream]);

  useEffect(() => {
    remoteStreams.forEach((stream, index) => {
      console.log(stream);
      setStreamForVideo(stream.stream, refs[index]);
    });
    return () => {
      remoteVideos = [];
    };
  }, [remoteStreams]);

  return (
    <div id="talkDiv">
      <video id="localVideo" ref={localVideo} autoPlay controls={false} muted />
      {usersLength === 1
        ? (
          <video id="remoteVideo" ref={refs[0]} autoPlay controls={false} key={`nice${0}`} />
        )
        : ([...new Array(usersLength).keys()].map((num) => {
        // Size of this window should depend on number of connected users
          if (num < remoteStreams.length) {
            return (<audio id="remoteVideo" ref={refs[num]} autoPlay controls={false} key={`nice${num}`} />);
          }
          return null;
        }))}
      {}
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
  localStream: state.talk.localStream,
  usersLength: state.messages.messageUsers.find(mu => mu._id === state.talk.talk.messageUser) !== undefined ? state.messages.messageUsers.find(mu => mu._id === state.talk.talk.messageUser).participants.length - 1 : 1,
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
