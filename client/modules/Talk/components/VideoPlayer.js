import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-polyglot';
import Tooltip from 'rc-tooltip';
// Import Style


// Import Components

// Import Actions
class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.localVideo = React.createRef();
    this.remoteVideo = React.createRef();
    this.state = {
      muted: false,
      videoMuted: false,
      showControls: false
    };
  }
  muteLocal = () => {
    this.localVideo.muted = true;
  }
  muteOrUnmuteRemote = () => {
    if(!this.state.muted) {
      this.props.muteLocal();
    } else {
      this.props.unmuteLocal();
    }
    this.setState({muted: !this.state.muted});
  }
  muteOrUnmuteVideo = () => {
    if(!this.state.videoMuted) {
      this.props.muteVideo();
    } else {
      this.props.unmuteVideo();
    }
    this.setState({videoMuted: !this.state.videoMuted});
  }
  componentDidUpdate() {
    const { localStream, remoteStream } = this.props;
    try {
      this.localVideo.current.srcObject = localStream;
      console.log('Niby działa localStream');
    } catch (error) {
      console.log('Tutaj coś!');
      this.localVideo.src = localStream !== null ? URL.createObjectURL(localStream) : null;
    }
    try {
      this.remoteVideo.current.srcObject = remoteStream;
    } catch (error) {
      console.log('Tutaj coś remote');
      this.remoteVideo.src = remoteStream !== null ? URL.createObjectURL(remoteStream) : null;
    }
  }

  render() {
    return (
      <div id="talkDiv" onMouseEnter={() => { this.setState({ showControls: true }); }} onMouseLeave={() => { this.setState({ showControls: false }); }}>
        <video id="localVideo" ref={this.localVideo} autoPlay controls={false} muted onVolumeChange={this.muteLocal} />
        <video id="remoteVideo" ref={this.remoteVideo} autoPlay controls={false} />
        {this.state.showControls ? <div id="buttonsDiv">
          <Tooltip trigger={['hover']} placement="top" overlay={this.props.t('talk.disconnect')}>
            <button id="disconnectButton" onClick={this.props.onEndCall} />
          </Tooltip>
          <Tooltip trigger={['hover']} placement="top" overlay={this.state.muted ? this.props.t('talk.unmute') : this.props.t('talk.mute')}>
            <button id={this.state.muted ? 'unmuteButton' : 'muteButton'} onClick={this.muteOrUnmuteRemote} />
          </Tooltip>
          <Tooltip trigger={['hover']} placement="top" overlay={this.state.videoMuted ? this.props.t('talk.video') : this.props.t('talk.novideo')}>
            <button id={this.state.videoMuted ? 'novideoButton' : 'videoButton'} onClick={this.muteOrUnmuteVideo} />
          </Tooltip>
        </div> : null}
      </div>
    );
  }
}
// Retrieve data from store as props
const mapStateToProps = state => ({
  filter: state.search.filter,
  users: state.search.users,
  authUser: state.userData.user
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
