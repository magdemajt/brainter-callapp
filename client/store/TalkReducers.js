
// Initial State
const initialState = {
  talk: {},
  seen: false,
  creator: false
};

const talkReducer = (oldState = initialState, action) => {
  const state = Object.assign({}, oldState);
  switch (action.type) {
    case 'INIT_TALK': {
      return Object.assign({}, state, { talk: action.talk, seen: action.seen, creator: action.seen });
    }
    case 'CLEAR_TALK': {
      return Object.assign({}, state, { talk: {}, seen: false, creator: false });
    }
    case 'SEEN_TALK': {
      return Object.assign({}, state, { seen: true });
    }
    default:
      return state;
  }
};

// Export Reducer
export default talkReducer;
