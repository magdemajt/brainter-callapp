const { validateUserTokenSockets, userNotActive, checkIfActiveSockets } = require('../controllers/userController');
const {
  handleIncomingCall,
  createNewCall,
  abortCall,
  answerCall,
  createPeerConnection,
  createPeer,
  sendPeer,
  receiverStream,
  getToken,
  finishCall,
  userSurveys,
  finishSurvey,
  sendActionList,
  getActionList,
  leaveTalk
} = require('../controllers/talkController');
const {
  searchTeacher,
  searchTalks,
  selectTalk,
  cancelTalk,
  searchTeacherMulti,
  leaveMultiRoom,
  destroyMultiTalk,
  joinMultiRoom,
  startMultiTalk,
  createMultiTalk,
  saveTimetable
} = require('../controllers/lessonController');
const {
  createNewMessage,
  getMessages,
  getMessageUsers,
  beginChat,
  seenMessages
} = require('../controllers/messageController');

const {
  getRecommendedUsers,
  findUsers
} = require('../controllers/usersController');

module.exports = (io) => {
  io.use(validateUserTokenSockets);
  io.use(checkIfActiveSockets);

  io.on('connection', (socket) => {
    socket.join(`room_${socket.authUser._id}`);
    socket.on('get_token', data => getToken(io, socket, data));
    socket.on('get_recom_users', data => getRecommendedUsers(io, socket, data));
    socket.on('create_incoming_call', data => createNewCall(io, socket, data));
    socket.on('abort_call_client', data => abortCall(io, socket, data));
    socket.on('finish_call_client', data => finishCall(io, socket, data));
    socket.on('answer_call_client', data => answerCall(io, socket, data));
    socket.on('get_surveys', data => userSurveys(io, socket, data));
    // single teacher talk listeners
    socket.on('search_teacher', data => searchTeacher(io, socket, data));
    socket.on('search_talks', data => searchTalks(io, socket, data));
    socket.on('cancel_teacher_talk', data => cancelTalk(io, socket, data));
    socket.on('select_talk', data => selectTalk(io, socket, data));
    // multi teacher talk listeners
    socket.on('search_multi_talk', data => searchTeacherMulti(io, socket, data));
    socket.on('leave_multi_room', data => leaveMultiRoom(io, socket, data));
    socket.on('join_multi_room', data => joinMultiRoom(io, socket, data));
    socket.on('create_multi_talk', data => createMultiTalk(io, socket, data));
    socket.on('start_multi_talk', data => startMultiTalk(io, socket, data));
    socket.on('destroy_multi_talk', data => destroyMultiTalk(io, socket, data));
    //
    socket.on('finish_survey', data => finishSurvey(io, socket, data));
    socket.on('incoming_call', data => handleIncomingCall(io, socket, data));
    socket.on('create_peer_connection', data => createPeerConnection(io, socket, data));
    socket.on('peer_connection', data => createPeer(io, socket, data));
    socket.on('send_peer', data => sendPeer(io, socket, data));
    socket.on('send_action_list', data => sendActionList(io, socket, data));
    socket.on('get_action_list', data => getActionList(io, socket, data));
    socket.on('receiver_stream', data => receiverStream(io, socket, data));
    socket.on('leave_talk', data => leaveTalk(io, socket, data));
    socket.on('create_message', data => createNewMessage(io, socket, data));
    socket.on('seen_messages', data => seenMessages(io, socket, data));
    socket.on('get_message_users', data => getMessageUsers(io, socket, data));
    socket.on('get_messages', data => getMessages(io, socket, data));
    socket.on('begin_chat', data => beginChat(io, socket, data));
    socket.on('find_users', data => findUsers(io, socket, data));
    socket.on('save_timetable', data => saveTimetable(io, socket, data));
    socket.on('disconnect', data => userNotActive(io, socket, data));
  });
};
