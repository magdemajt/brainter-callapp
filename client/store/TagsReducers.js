
// Initial State
const initialState = {
  tags: []
};

const tagsReducer = (oldState = initialState, action) => {
  const state = Object.assign({}, oldState);
  switch (action.type) {
    case 'INIT_TAGS': {
      return Object.assign({}, state, { tags: action.tags });
    }
    default:
      return state;
  }
};

// Export Reducer
export default tagsReducer;
