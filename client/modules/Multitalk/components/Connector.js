import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

const Connector = ({
  user, authUser, socket, messageUsers, p2p, talk, creator, localStream, remoteStream, blackboardText, initLocal, initUser, initP2P, initRemote, clearTalk, editBlackboard
}) => {
  const p2ps = [];
  const queuedPeers = [];

  useEffect(() => {
    const d = [];
    return () => {
      socket.removeListener('create_peer_connection');
      socket.removeListener('peer_connection');
      socket.removeListener('got_token');
    };
  }, [socket]);
};

const mapStateToProps = state => ({
  user: state.search.user,
  authUser: state.userData.user,
  socket: state.io.socket,
  messageUsers: state.messages.messageUsers,
  p2p: state.io.p2p,
  talk: state.talk.talk,
  creator: state.talk.talk.caller === state.userData.user._id,
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

export default connect(mapStateToProps, mapDispatchToProps)(Connector);
