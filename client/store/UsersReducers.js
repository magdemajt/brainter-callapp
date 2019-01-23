
// Initial State
const initialState = {
  users: [],
  user: {},
  filter: '',
  selectedTags: [],
  teacherTags: []
};

const usersReducer = (oldState = initialState, action) => {
  const state = Object.assign({}, oldState);
  switch (action.type) {
    case 'INIT_SEARCH_USER': {
      return Object.assign({}, state, { user: action.user });
    }
    case 'INIT_SEARCH_USERS': {
      return Object.assign({}, state, { users: action.users });
    }
    case 'INIT_FILTER': {
      return Object.assign({}, state, { filter: action.filter });
    }
    case 'SELECT_TAG': {
      if (state.selectedTags.includes(action.tag)) {
        return Object.assign({}, state, { selectedTags: state.selectedTags.filter(el => el._id !== action.tag._id) });
      }
      if (state.selectedTags.length < 3) {
        return Object.assign({}, state, { selectedTags: state.selectedTags.concat(action.tag) });
      }
      return state;
    }
    case 'SELECT_TEACHER_TAG': {
      if (state.teacherTags.includes(action.tag)) {
        return Object.assign({}, state, { teacherTags: state.teacherTags.filter(el => el._id !== action.tag._id) });
      }
      return Object.assign({}, state, { teacherTags: state.teacherTags.concat(action.tag) });
    }
    default:
      return state;
  }
};

// Export Reducer
export default usersReducer;
