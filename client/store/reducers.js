import { combineReducers } from 'redux';
import loginReducer from './LoginReducers';
import tagsReducer from './TagsReducers';
import usersReducer from './UsersReducers';
import socketReducers from './SocketReducers';
import messageReducers from './MessageReducers';
import talkReducer from './TalkReducers';

const rootReducer = combineReducers({
  userData: loginReducer,
  tags: tagsReducer,
  search: usersReducer,
  io: socketReducers,
  messages: messageReducers,
  talk: talkReducer,
});

export default rootReducer;
