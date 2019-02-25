import _ from 'lodash';


// Initial State
const initialState = {
  talk: {},
  localStream: null,
  remoteStream: null,
  blackboardText: '',
  seen: false,
  messageUser: null,
  creator: false,
  tagModal: false,
  teacherTalks: []
};

const talkReducer = (oldState = initialState, action) => {
  const state = Object.assign({}, oldState);
  switch (action.type) {
    case 'INIT_TALK': {
      return Object.assign({}, state, { talk: action.talk, seen: action.seen, creator: action.seen });
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
      return Object.assign({}, state, { talk: action.talk, seen: true, creator: action.creator });
    }
    case 'INIT_LOCAL_STREAM': {
      return { ...state, localStream: JSON.stringify(action.localStream) };
    }
    case 'INIT_REMOTE_STREAM': {
      return { ...state, remoteStream: JSON.stringify(action.remoteStream) };
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
