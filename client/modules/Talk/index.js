import React, { Component } from 'react';
import { connect } from 'react-redux';
import Blackboard from './components/Blackboard';
import Connector from './components/Connector';
import history from '../../history';

const Talk = ({ talk }) => {
  if (!talk.hasOwnProperty('_id')) {
    history.push('/');
  } else {
    return (
      <Connector />
    );
  }
  return null;
};

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
