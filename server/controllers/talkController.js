const accountSid = 'AC2876753081e571b435d9ee17d46ac3dc';
const authToken = 'f27a7251b55cc46391d1cc9b82b8b3eb';
const client = require('twilio')(accountSid, authToken);
const fs = require('fs');
const User = require('../models/user');
const errors = require('./errorHandle/errorStatusCodes');
const handleStatusCodes = require('./errorHandle/errorStatuses');
const MessageUser = require('../models/messageUser');
const TagAction = require('../models/tagAction');
const Talk = require('../models/talk');
const { addUserTags } = require('./usersController');

exports.createNewCall = (io, socket, data) => {
  const talk = new Talk({
    topic: data.topic,
    messageUser: data.messageUser,
    tags: data.tags,
    caller: data.caller
  });
  talk.save();
  MessageUser.findById(data.messageUser).then((mUser) => {
    socket.emit('created_talk', { talk, participants: mUser.participants });
    mUser.participants.forEach((part) => {
      if (part.toString() !== socket.authUser._id.toString()) {
        io.to(`room_${part}`).emit('incoming_call', { talk, tags: data.tags, participants: mUser.participants });
      }
    });
  }).catch((err) => {
    console.log(err);
  });
  socket.join(`talk_${data.messageUser}`);
};

exports.finishCall = (io, socket, data) => {
  Talk.findOne({ _id: data.talk._id }).populate('messageUser').then((talk) => {
    const surveys = talk.messageUser.participants.map((part) => {
      if (part.toString() !== talk.caller.toString()) {
        return { respondent: part };
      }
    });
    talk.finishedAt = Date.now();
    if (talk.finishedAt - talk.createdAt > 1000 * 60 * 30) {
      talk.surveys = surveys;
    }
    talk.save().catch(err => console.log(err));
  }).catch(err => console.log(err));
};

exports.userSurveys = (io, socket, data) => {
  Talk.getSurveysByUser(socket.authUser._id, (talks) => {
    socket.emit('surveys', { talks });
  });
};

exports.updateText = (io, socket, data) => {
  Talk.findByIdAndUpdate(data.talk._id, { $set: { 'blackboard.text': data.blackboardText } }).catch((err) => { console.log(err); });
};

exports.finishSurvey = (io, socket, data) => {
  Talk.updateOne({ _id: data.talk._id, 'surveys._id': data.talk.surveys[0]._id }, { $set: { 'surveys.$': data.talk.surveys[0] } })
    .then(() => {})
    .catch(err => console.log(err));
};

exports.abortCall = (io, socket, data) => {
  io.to(`talk_${data.messageUser}`).emit('abort_call', { _id: socket.authUser._id });
  socket.leave(`talk_${data.messageUser}`);
};

exports.handleIncomingCall = (io, socket, data) => {
  socket.join(`talk_${data.messageUser}`);
  // socket.to(`talk_${data.messageUser}`).emit('respond_to_call');
};
exports.createPeer = (io, socket, data = { peer: null, messageUser: null, _id: '' }) => {
  socket.to(`talk_${data.messageUser}`).emit('peer_connection', { peer: data.peer, auth: socket.authUser._id, _id });
};
exports.createPeerConnection = (io, socket, data = { peer: null, messageUser: null, _id: '' }) => {
  socket.to(`talk_${data.messageUser}`).emit('create_peer_connection', { peer: data.peer, auth: socket.authUser._id, _id });
};

exports.sendPeer = (io, socket, data) => {
  socket.to(`room_${data.user}`).emit('received_peer', { user: socket.authUser._id, peer: data.peer });
};

exports.sendActionList = (io, socket, data) => {
  socket.to(`talk_${data.messageUser}`).emit('action_list', { actionList: data.actionList });
};

exports.getActionList = (io, socket, data) => {
  socket.to(`talk_${data.messageUser}`).emit('get_action_list');
};

exports.answerCall = (io, socket, data) => {
  io.in(`talk_${data.messageUser}`).emit('answer_call', { name: socket.authUser.name, _id: socket.authUser._id });
};

exports.receiverStream = (io, socket, data) => {
  socket.to(`talk_${data.messageUser}`).emit('got_receiver_stream', { _id: socket.authUser._id });
};

exports.getToken = (io, socket, data) => {
  client.tokens.create().then(token => socket.emit('got_token', { ices: token.iceServers })).done();
};
