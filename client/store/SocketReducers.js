import io from 'socket.io-client';
import Peer from 'simple-peer';
import ServerAddress from '../../serverAddress';

// Initial State
const initialState = {
  socket: undefined,
  p2p: null
};

const socketReducers = (oldState = initialState, action) => {
  const state = Object.assign({}, oldState);
  switch (action.type) {
    case 'INIT_SOCKET': {
      if (process.env.NODE_ENV !== 'production') {
        return Object.assign({}, state, { socket: io(`http://${ServerAddress.server + ServerAddress.apiPort ? `:${ServerAddress.apiPort}` : null}`, { query: { token: action.userToken } }) });
      }
      return Object.assign({}, state, { socket: io('https://brainter.study', { query: { token: action.userToken } }) });
      // build version
    }
    case 'INIT_P2P': {
      return Object.assign({}, state, { p2p: new Peer(action.opts) });
    }
    case 'RESET': {
      return initialState;
    }
    default:
      return state;
  }
};

// Export Reducer
export default socketReducers;
