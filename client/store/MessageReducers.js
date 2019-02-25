import _ from 'lodash';
// Initial State
const initialState = {
  messageUsers: [],
  user: {
    participants: []
  }
};

const messageReducers = (oldState = initialState, action) => {
  const state = Object.assign({}, oldState);
  switch (action.type) {
    case 'INIT_MESSAGE_USERS': {
      const messageUsers = [...state.messageUsers];
      action.messageUsers.forEach((mu) => {
        const newMu = Object.assign({}, mu);
        newMu.messages.reverse();
        messageUsers.push(newMu);
      });
      return Object.assign({}, state, { messageUsers });
    }
    case 'ADD_MESSAGE': {
      const index = state.messageUsers.indexOf(state.messageUsers.find(mu => mu._id === action.user));
      const messageUsers = state.messageUsers.map(user => user);
      messageUsers[index].messages.push(action.message);
      if (messageUsers[index]._id === state.user._id) {
        const user = Object.assign({}, state.user, messageUsers[index]);
        return Object.assign({}, state, { messageUsers, user });
      }
      return Object.assign({}, state, { messageUsers });
    }
    case 'UNSHIFT_MESSAGE': {
      const index = state.messageUsers.indexOf(state.messageUsers.find(mu => mu._id === action.user));
      const messageUsers = state.messageUsers.map(user => user);
      messageUsers[index].messages.unshift(action.message);
      if (messageUsers[index]._id === state.user._id) {
        const user = Object.assign({}, state.user, messageUsers[index]);
        return Object.assign({}, state, { messageUsers, user });
      }
      return Object.assign({}, state, { messageUsers });
    }
    case 'INIT_MESSAGES': {
      const index = state.messageUsers.indexOf(action.user);
      const messageUsers = state.messageUsers.map(user => user);
      messageUsers[index].messages.unshift(...action.messages);
      return Object.assign({}, state, { messageUsers });
    }
    case 'INIT_MESSAGE_USER': {
      return Object.assign({}, state, { user: action.messageUser });
    }
    case 'ADD_MESSAGE_USER': {
      if (state.messageUsers.find(mu => mu._id === action.messageUser._id) !== undefined) {
        return state;
      }
      const newMu = Object.assign({}, action.messageUser);
      newMu.messages.reverse();
      const messageUsers = state.messageUsers.concat(newMu);
      return Object.assign({}, state, { messageUsers });
    }
    case 'SEEN_MESSAGES': {
      const index = _.findIndex(state.messageUsers, action.messageUser);
      const newMsgs = _.map(state.messageUsers[index].messages, message => ((message.sender !== action.user._id && !message.seen.find(u => u === action.user._id)) ? { ...message, seen: message.seen.concat(action.user._id) } : message));
      state.messageUsers[index] = { ...state.messageUsers[index], messages: newMsgs };
      return state;
    }
    case 'RESET': {
      return initialState;
    }
    default:
      return state;
  }
};

// Export Reducer
export default messageReducers;
