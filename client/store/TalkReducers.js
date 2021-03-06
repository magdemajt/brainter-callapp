import _ from 'lodash';


// Initial State
const initialState = {
  talk: {},
  participants: [],
  localStream: null,
  remoteStream: [],
  blackboardText: '',
  messageUser: null,
  creator: false,
  tagModal: false,
  teacherTalks: [],
  peers: []
};

const talkReducer = (oldState = initialState, action) => {
  const state = Object.assign({}, oldState);
  switch (action.type) {
    case 'ADD_PEER': {
      return { ...state, peers: state.peers.concat(action.peer) };
    }
    case 'CLEAR_PEERS': {
      const newPeers = state.peers;
      action.peers.forEach((peer) => {
        _.remove(newPeers, peer);
      });
      return { ...state, peers: newPeers };
    }
    case 'REMOVE_PEER': {
      return { ...state, peers: state.peers.filter(peer => action.peer.user !== peer.user) };
    }
    case 'INIT_TALK': {
      return Object.assign({}, state, { talk: action.talk, creator: action.seen });
    }
    case 'CLEAR_TALK': {
      return initialState;
    }
    case 'SEEN_TALK': {
      return Object.assign({}, state, { seen: true });
    }
    case 'START_CALLING': {
      return Object.assign({}, state, { messageUser: action.messageUser });
    }
    case 'OPEN_TAG_TALK': {
      return Object.assign({}, state, { tagModal: true });
    }
    case 'CLOSE_TAG_TALK': {
      return Object.assign({}, state, { tagModal: false });
    }
    case 'INIT_TEACHER_TALKS': {
      return Object.assign({}, state, { teacherTalks: action.teacherTalks });
    }
    case 'REMOVE_TEACHER_TALK': {
      return Object.assign({}, state, { teacherTalks: _.without(state.teacherTalks, action.teacherTalk) });
    }
    case 'INIT_TEACHER_TALK': {
      return Object.assign({}, state, { talk: action.talk, creator: action.creator });
    }
    case 'INIT_PARTICIPANTS': {
      return Object.assign({}, state, { participants: action.participants });
    }
    case 'INIT_LOCAL_STREAM': {
      return { ...state, localStream: (action.localStream) };
    }
    case 'INIT_REMOTE_STREAM': {
      return { ...state, remoteStream: (action.remoteStream) };
    }
    case 'EDIT_BLACKBOARD': {
      return { ...state, blackboardText: action.blackboardText };
    }
    case 'RESET': {
      return initialState;
    }
    default:
      return state;
  }
};

// Export Reducer
export default talkReducer;
