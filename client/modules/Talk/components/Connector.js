import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import VideoPlayer from './VideoPlayer';
import history from '../../../history';
// Import Style

// Lista osób do stworzenia peerów w reducerze i event globalny dodawania peerów, obsługa eventów peerów, sprawdzenie czy został uzyskany token
// Dla remoteStreamów id użytownika (w p2p.on('stream'))
// W addToPeerList event stworzenie akcji 'ADD' rozesłanie tej action storage do wszystkich

const Connector = ({
  users, creator, socket, authUser, peers, talk, clearTalk, children, initRemote, initLocal, remoteStream, editBlackboard, locallyStream
}) => {
  let actionList = []; // action: { type: '', user: '' }
  const connectedPeerList = []; // peer: { p2p, peer: null, user }
  const [clearing, setClearing] = useState(false);
  let ices;

  function sendActionList() {
    socket.emit('send_action_list', { actionList, messageUser: talk.messageUser });
  }

  function getActionList() {
    socket.emit('get_action_list', { messageUser: talk.messageUser });
  }

  function addToPeerList(user) {
    actionList.push({ type: 'ADD', user });
    sendActionList();
  }

  // function removeFromPeerList(user) {

  // }

  function disconnect() {
    connectedPeerList.forEach((peer) => {
      peer.p2p.destroy();
    });
    actionList.push({ type: 'REMOVE', user: authUser._id });
    sendActionList();
    clearCall();
  }

  function getUserStream() {
    if (creator || users === 1) {
      try {
        return navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      } catch (e) {
        return navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      }
    } else {
      try {
        return navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      } catch (e) {

      }
    }
  }

  function clearCall() {
    locallyStream.getTracks().forEach(track => track.stop());
    clearTalk();
    history.push('/');
  }

  function setListeners(p2p, user) {
    p2p.on('signal', (data) => {
      socket.emit('send_peer', { user, peer: data });
    });
    p2p.on('stream', (stream) => {
      initRemote([...remoteStream, { stream, user }]);
    });
    p2p.on('data', (sendData) => {
      const data = JSON.parse(sendData);
      switch (data.type) {
        case 'MUTE_REMOTE':
          remoteStream.find(s => s.user === user).stream.getAudioTracks()[0].enabled = false;
          break;
        case 'UNMUTE_REMOTE':
          remoteStream.find(s => s.user === user).stream.getAudioTracks()[0].enabled = true;
          break;
        case 'MUTE_VIDEO':
          remoteStream.find(s => s.user === user).stream.getVideoTracks()[0].enabled = false;
          break;
        case 'UNMUTE_VIDEO':
          remoteStream.find(s => s.user === user).stream.getVideoTracks()[0].enabled = true;
          break;
        case 'END_CALL':
          clearCall(peerObject);
          break;
        case 'BLACKBOARD_TEXT':
          editBlackboard(data.blackboardText);
          break;
      }
      console.log(data);
    });
    p2p.on('error', (err) => {
      console.log('WebRTC bład', err);
      clearCall();
    });
  }

  function connectPeer() {
    peers.filter((peer) => {
      const found = connectedPeerList.find(p => p.user === peer.user);
      return found !== undefined && found.peer === null;
    }).forEach((peer) => {
      const found = connectedPeerList.find(p => p.user === peer.user);
      found.peer = peer.peer;
      found.p2p.signal(peer.peer);
    });
  }

  function initializeSockets() {
    getUserStream().then((localStream) => {
      socket.on('got_token', (data) => {
        ices = data.ices;
      });
      socket.emit('get_token');
      initLocal(localStream);

      socket.on('get_action_list', () => {
        sendActionList();
      });

      socket.on('action_list', (data) => {
        const newActions = [];
        for (let i = 0; i < Math.min(data.actionList.length, actionList.length); i += 1) {
          const item = data.actionList[i];
          const toCompare = actionList[i];
          if (item.type === toCompare.type && item.user === toCompare.user) {
            newActions.push(item);
          } else {
            newActions.push(item, toCompare);
          }
        }
        if (data.actionList.length > actionList.length) {
          for (let i = actionList.length; i < data.actionList.length; i += 1) {
            const item = data.actionList[i];
            newActions.push(item);
          }
        }
        if (data.actionList.length < actionList.length) {
          for (let i = data.actionList.length; i < actionList.length; i += 1) {
            const item = actionList[i];
            newActions.push(item);
          }
        }
        actionList = newActions;

        let newPeers = [];

        newActions.forEach((action) => {
          if (action.type === 'ADD') {
            newPeers = newPeers.concat(action.user);
          }
          if (action.type === 'REMOVE') {
            newPeers = newPeers.filter(us => us !== action.user);
          }
        });

        const addYou = connectedPeerList.length === 0;

        newPeers.filter(us => (connectedPeerList.find(cp => cp.user === us) !== undefined && us === authUser._id)).forEach((us) => {
          const p2p = new Peer({
            initiator: us < authUser._id, stream: localStream, config: { iceServers: ices }, reconnectTimer: 3000
          });
          setListeners(p2p, us);
          if (us < authUser._id) {
            // done
          } else {
            // Here just wait for connection to be created
          }
          connectedPeerList.push({ peer: null, p2p, user: us });
        });
        if (addYou) {
          addToPeerList(authUser._id);
        }
        connectPeer();
      });
    });
  }


  useEffect(() => {
    if (clearing) {
      clearCall();
    }
  }, [clearing]);

  useEffect(() => {
    if (creator) {
      addToPeerList(authUser._id);
      setTimeout(() => {
        if (connectedPeerList.length === 0) {
          setClearing(true);
        }
      }, 5000);
    } else {
      getActionList();
    }
  }, []);

  useEffect(() => {
    connectPeer();
  }, [peers]);

  useEffect(() => {
    initializeSockets();
    return () => {
      socket.removeListener('peer_list');
      socket.removeListener('got_token');
    };
  }, [socket]);


  return (
    <React.Fragment>
      <VideoPlayer peers={connectedPeerList.map(peer => peer.p2p)} onEndCall={disconnect}>
        {/* <TalkTools /> */}
      </VideoPlayer>
      {children}
    </React.Fragment>
  );
};

// Retrieve data from store as props
const mapStateToProps = state => ({
  user: state.search.user,
  authUser: state.userData.user,
  socket: state.io.socket,
  messageUsers: state.messages.messageUsers,
  users: state.messages.messageUsers.find(mu => mu._id === state.talk.talk.messageUser) !== undefined ? state.messages.messageUsers.find(mu => mu._id === state.talk.talk.messageUser).length : 1,
  p2p: state.io.p2p,
  talk: state.talk.talk,
  creator: state.talk.creator,
  locallyStream: (state.talk.localStream),
  remoteStream: (state.talk.remoteStream),
  blackboardText: state.talk.blackboardText,
  peers: state.talk.peers
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

export default connect(mapStateToProps, mapDispatchToProps)(Connector);
