import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Peer from 'simple-peer';
import VideoPlayer from './VideoPlayer';
import history from '../../../history';
import Blackboard from './Blackboard';
// Import Style

// Lista osób do stworzenia peerów w reducerze i event globalny dodawania peerów, obsługa eventów peerów, sprawdzenie czy został uzyskany token
// Dla remoteStreamów id użytownika (w p2p.on('stream'))
// W addToPeerList event stworzenie akcji 'ADD' rozesłanie tej action storage do wszystkich

const Connector = ({
  users, creator, socket, authUser, peers, clearPeers, talk, locallyStream, initLocal, clearTalk, children, editBlackboard, blackboardText
}) => {
  let actionList = []; // action: { type: '', user: '' }
  const [connectedPeerList, setConnectedPeerList] = useState([]); // peer: { p2p, user }
  const [clearing, setClearing] = useState(false);
  const [ices, setIces] = useState(null);
  const [remoteStreams, initRemote] = useState([]);
  let participants = [];

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
  function sendToPeers(data, doSomethingElse = () => {}) {
    try {
      connectedPeerList.forEach((peer) => {
        peer.p2p.send(JSON.stringify(data));
        doSomethingElse(peer);
      });
    } catch (e) {

    }
  }

  // function removeFromPeerList(user) {

  // }


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
        console.log(e);
        return null;
      }
    }
  }

  function clearCall() {
    try {
      locallyStream.getTracks().forEach(track => track.stop());
    } catch (e) {
      console.log(locallyStream);
    }
    clearTalk();
    history.push('/');
  }

  function disconnect() {
    sendToPeers({ type: 'END_CALL' }, (peer) => {
      peer.p2p.destroy();
    });
    socket.emit('leave_talk', { messageUser: talk.messageUser });
    actionList.push({ type: 'REMOVE', user: authUser._id });
    sendActionList();
    clearCall();
  }


  const setListeners = (p2p, user) => {
    console.log('setting!');
    p2p.on('signal', (data) => {
      socket.emit('send_peer', { user, peer: data });
    });
    p2p.on('stream', (s) => {
      const stream = new MediaStream(s);
      initRemote([...remoteStreams, { stream, user }]);
    });
    p2p.on('data', (sendData) => {
      const data = JSON.parse(sendData);
      console.log(data);
      console.log(remoteStreams);
      switch (data.type) {
        // case 'MUTE_REMOTE':
        //   p2p.streams[0].getAudioTracks()[0].enabled = false;
        //   remoteStreams.find(s => s.user === user).stream.getAudioTracks()[0].enabled = false;
        //   break;
        // case 'UNMUTE_REMOTE':
        //   remoteStreams.find(s => s.user === user).stream.getAudioTracks()[0].enabled = true;
        //   break;
        // case 'MUTE_VIDEO':
        //   console.log(p2p.streams[0].getVideoTracks());
        //   p2p.streams[0].getVideoTracks()[0].enabled = false;
        //   remoteStreams.find(s => s.user === user).stream.getVideoTracks()[0].enabled = false;
        //   break;
        // case 'UNMUTE_VIDEO':
        //   p2p.streams[0].getVideoTracks()[0].enabled = false;
        //   remoteStreams.find(s => s.user === user).stream.getVideoTracks()[0].enabled = true;
        //   break;
        case 'END_CALL':
          console.log('wirke');
          if (participants.length === 2) {
            clearCall();
            socket.emit('finish_call_client', { talk });
            socket.emit('change_blackboard', { talk, blackboardText });
          }
          break;
        case 'BLACKBOARD_TEXT':
          editBlackboard(data.blackboardText);
          break;
      }
      console.log(data);
    });
    // p2p.on('track', (track, stream) => {
    //   console.log(track, stream);
    // });
    p2p.on('error', (err) => {
      console.log('WebRTC bład', err);
      if (clearing) {
        clearCall();
      }
    });
  };

  function connectPeer() {
    const toDelete = [];
    peers.forEach((peer) => {
      const found = connectedPeerList.find(p => p.user === peer.user); // Usuwać je
      if (found !== undefined) {
        found.p2p.signal(peer.peer);
        toDelete.push(peer);
      }
    });
    if (toDelete.length > 0) { clearPeers(toDelete); }
  }

  function initializeSockets() {
    getUserStream().then((localStream) => {
      initLocal(new MediaStream(localStream));

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
        if (newActions.length > actionList.length) {
          actionList = newActions;
          sendActionList();
        }

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
        const newCPL = connectedPeerList; // newConnectedPeerList
        participants = (newPeers);
        newPeers.filter(us => (connectedPeerList.find(cp => cp.user === us) === undefined && us !== authUser._id)).forEach((us) => {
          const p2p = new Peer({
            initiator: us < authUser._id, stream: localStream, config: { iceServers: ices }, reconnectTimer: 6000
          });
          setListeners(p2p, us);
          newCPL.push({ p2p, user: us });
        });
        setConnectedPeerList(newCPL);
        if (addYou && !creator) {
          addToPeerList(authUser._id);
        }
        connectPeer();
      });
    });
  }

  function changeBlackboard(e) {
    editBlackboard(e.target.value);
    sendToPeers({ blackboardText: e.target.value, type: 'BLACKBOARD_TEXT' });
  }


  useEffect(() => {
    if (clearing) {
      clearCall();
    }
  }, [clearing]);

  useEffect(() => {
    if (connectedPeerList.length > 0) { connectPeer(); }
  }, [peers, connectedPeerList]);

  useEffect(() => {
    socket.on('got_token', (data) => {
      setIces(data.ices);
    });
    if (ices !== null) {
      initializeSockets();
    } else {
      socket.emit('get_token');
    }
    return () => {
      socket.removeListener('peer_list');
      socket.removeListener('got_token');
      socket.removeListener('get_action_list');
      socket.removeListener('action_list');
    };
  }, [socket, ices]);

  useEffect(() => {
    if (ices !== null) {
      if (creator) {
        addToPeerList(authUser._id);
        const inter = setInterval(() => {
          if (connectedPeerList.length === 0) {
            sendActionList();
          } else {
            clearInterval(inter);
          }
        }, 2000);
        setTimeout(() => {
          if (connectedPeerList.length === 0) {
            setClearing(true);
            clearInterval(inter);
          }
        }, 8000);
      } else {
        getActionList();
      }
    }
  }, [ices]);


  return (
    <React.Fragment>
      <VideoPlayer
        peers={connectedPeerList.map(peer => peer.p2p)}
        onEndCall={disconnect}
        remoteStreams={remoteStreams}
      >
        {/* <TalkTools /> */}
      </VideoPlayer>
      <Blackboard changeText={changeBlackboard} caller={creator} text={blackboardText} />
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
  users: state.messages.messageUsers.find(mu => mu._id === state.talk.talk.messageUser) !== undefined ? state.messages.messageUsers.find(mu => mu._id === state.talk.talk.messageUser).participants.length - 1 : 1,
  talk: state.talk.talk,
  creator: state.talk.creator,
  locallyStream: (state.talk.localStream),
  blackboardText: state.talk.blackboardText,
  peers: state.talk.peers,
});
/* eslint-disable */
const mapDispatchToProps = (dispatch) => {
  return {
    initUser: (user) => dispatch({
      type: 'INIT_SEARCH_USER',
      user,
    }),
    clearPeers: (peers) => dispatch({
      type: 'CLEAR_PEERS',
      peers
    }),
    clearTalk: () => dispatch({
      type: 'CLEAR_TALK'
    }),
    initLocal: (localStream) => dispatch({
      type: 'INIT_LOCAL_STREAM',
      localStream
    }),
    editBlackboard: (blackboardText) => dispatch({
      type: 'EDIT_BLACKBOARD',
      blackboardText
    })
  };
};
/* eslint-enable */

export default connect(mapStateToProps, mapDispatchToProps)(Connector);
