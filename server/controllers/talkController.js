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
    mUser.participants.forEach((part) => {
      if (part.toString() !== socket.authUser._id.toString()) {
        io.to(`room_${part}`).emit('incoming_call', { talk: { ...talk, tags: data.tags } });
      }
    });
  }).catch((err) => {
    console.log(err);
  });
  socket.join(`talk_${data.messageUser}`);
  socket.emit('created_talk', { talk });
};

exports.finishCall = (io, socket, data) => {
  Talk.findById(data.talk._id).populate('messageUser').then(talk => {
    const surveys = talk.messageUser.participants.filter(part => {
      return part !== talk.caller;
    });
    talk.finishedAt = Date.now();
    talk.surveys = surveys;
    talk.save();
  });
};

exports.userSurveys = (io, socket, data) => {
  Talk.getSurveysByUser(socket.authUser._id, (talks) => {
    socket.emit('surveys', { talks });
  });
};

exports.finishSurvey = (io, socket, data) => {
  Talk.update({ _id: data.talk._id }, { surveys: { $pull: { respondent: socket.authUser._id }, $push: data.talk.surveys[0] } }).then(() => {

  });
};

exports.abortCall = (io, socket, data) => {
  io.to(`talk_${data.messageUser}`).emit('abort_call');
  socket.leave(`talk_${data.messageUser}`);
};

exports.handleIncomingCall = (io, socket, data) => {
  socket.join(`talk_${data.messageUser}`);
  // socket.to(`talk_${data.messageUser}`).emit('respond_to_call');
};
exports.createPeer = (io, socket, data = { peer: null, messageUser: null }) => {
  socket.to(`talk_${data.messageUser}`).emit('peer_connection', { peer: data.peer });
};
exports.createPeerConnection = (io, socket, data = { peer: null, messageUser: null }) => {
  socket.to(`talk_${data.messageUser}`).emit('create_peer_connection', { peer: data.peer });
};

exports.answerCall = (io, socket, data) => {
  io.in(`talk_${data.messageUser}`).emit('answer_call', { name: socket.authUser.name });
};

exports.receiverStream = (io, socket, data) => {
  socket.to(`talk_${data.messageUser}`).emit('got_receiver_stream');
};

exports.getToken = (io, socket, data) => {
  client.tokens.create().then(token => socket.emit('got_token', { ices: token.iceServers })).done();
};
