
// Initial State
const initialState = {
  permission: null
};

const adminReducers = (oldState = initialState, action) => {
  const state = Object.assign({}, oldState);
  switch (action.type) {
    case 'INIT_PERMISSION': {
      return Object.assign({}, state, { permission: action.permission });
    }
    default:
      return state;
  }
};

// Export Reducer
export default adminReducers;
