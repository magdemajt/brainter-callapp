import { setLoginCookies } from '../utils/login';

// Initial State
const initialState = {
  user: {
    token: ''
  }
};

const loginReducer = (oldState = initialState, action) => {
  const state = Object.assign({}, oldState);
  switch (action.type) {
    case 'TOGGLE_INIT_USER': {
      const test = Object.assign({}, state, { user: { token: action.user } });
      return test;
    }
    case 'INIT_USER': {
      const tags = action.user.tags.map(tag => {
        let newT = null;
        if (tag.tag !== undefined) {
          newT = Object.assign({}, tag.tag, { level: tag.level });
        } else {
          newT = Object.assign({}, tag, { level: tag.level });
        }
        return newT;
     });
      return Object.assign({}, state, { user: { token: state.user.token, ...action.user, tags } });
    }
    // case 'ADD_TAGS_TO_ADD': {
    //   const mergedTags = state.tagsToAdd.filter(elem => {
    //     return elem._id !== action.tag._id;
    //   }).concat(action.tag);
    //   return Object.assign({}, state, { tagsToAdd: mergedTags });
    // }
    // case 'REMOVE_TAGS': {
    //   const mergedTagsToAdd = state.tagsToAdd
    //     .filter(elem => {
    //       return elem._id != action.tag._id;
    //     });
    //   if (mergedTagsToAdd.length !== state.tagsToAdd.length) {
    //     return Object.assign({}, state, { tagsToAdd: mergedTagsToAdd });
    //   }
    //   const mergedRemoveTags = state.tagsToRemove.concat(action.tag);
    //   return Object.assign({}, state, { tagsToRemove: mergedRemoveTags });
    // }
    // case 'RESET_TAGS_TO_ADD': {
    //   return Object.assign({}, state, { tagsToAdd: [], tagsToRemove: [] });
    // }
    default:
      return state;
  }
};

// Export Reducer
export default loginReducer;
