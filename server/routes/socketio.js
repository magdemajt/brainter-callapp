const { validateUserTokenSockets } = require('../controllers/userController');
const {
  handleIncomingCall,
  createNewCall,
  abortCall,
  answerCall,
  createPeerConnection,
  createPeer,
  receiverStream,
  getToken
} = require('../controllers/talkController');
const {
  createNewMessage,
  getMessages,
  getMessageUsers,
  beginChat
} = require('../controllers/messageController');

module.exports = (io) => {
  io.use(validateUserTokenSockets);

  io.on('connection', (socket) => {
    socket.join(`room_${socket.authUser._id}`);
    socket.on('get_token', data => getToken(io, socket, data));
    socket.on('create_incoming_call', data => createNewCall(io, socket, data));
    socket.on('abort_call_client', data => abortCall(io, socket, data));
    socket.on('answer_call_client', data => answerCall(io, socket, data));
    socket.on('incoming_call', data => handleIncomingCall(io, socket, data));
    socket.on('create_peer_connection', data => createPeerConnection(io, socket, data));
    socket.on('peer_connection', data => createPeer(io, socket, data));
    socket.on('receiver_stream', data => receiverStream(io, socket, data));
    socket.on('create_message', data => createNewMessage(io, socket, data));
    socket.on('get_message_users', data => getMessageUsers(io, socket, data));
    socket.on('get_messages', data => getMessages(io, socket, data));
    socket.on('begin_chat', data => beginChat(io, socket, data));
  });
};
