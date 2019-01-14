
// Initial State
const initialState = {
  talk: {},
  seen: false,
  messageUser: null,
  creator: false,
  tagModal: false
};

const talkReducer = (oldState = initialState, action) => {
  const state = Object.assign({}, oldState);
  switch (action.type) {
    case 'INIT_TALK': {
      return Object.assign({}, state, { talk: action.talk, seen: action.seen, creator: action.seen });
    }
    case 'CLEAR_TALK': {
      return Object.assign({}, state, { talk: {}, seen: false, creator: false, messageUser: null });
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
    default:
      return state;
  }
};

// Export Reducer
export default talkReducer;
