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
const TalkPool = require('../models/talkPool');
const { addUserTags } = require('./usersController');

exports.searchTeacher = (io, socket, { topic, selectedTags }) => {
  const talk = { selectedTags, topic, user: socket.authUser._id };
  let count = 0;
  selectedTags.forEach(tag => {
    TalkPool.updateOne({ tag: tag._id }, { $push: { talks: talk } })
    .then(talk => {
      count++;
      if (count === 3) {
        socket.emit('searching_teacher');
      }
    })
    .catch(err => console.log(err))
  });
};

exports.searchTalks = (io, socket, data) => {
  const tags_ids = data.selectedTags.map(tag => tag._id);
  TalkPool.find({tag: { $in: tags_ids } }).select('talks')
    .populate({path: 'talks.selectedTags', select: 'name' })
    .populate({ path: 'talks.user', select: 'name' })
    .then(talks => {
      socket.join('teachers_room');
      socket.emit('teacher_talks', { teacherTalks: talks });
    })
    .catch(err => console.log(err));
};

exports.selectTalk = (io, socket, data) => {
  TalkPool.updateMany({ $in: { talks: data.talk } }, { $pull: { talks: { _id: data.talk._id } } })
  .then(() => {
    socket.broadcast.to('teachers_room').emit('selected_talk', { teacherTalk: data.talk });
    MessageUser.createOrReturn([data.talk.user._id], socket.authUser._id, (messageUsers) => {
      const t = new Talk({
        topic: data.talk.topic,
        MessageUser: messageUsers[0],
        tags: data.talk.selectedTags,
        caller: socket.authUser._id
      });
      t.save().then(() => {
        socket.emit('starting_teaching', { talk: t });
        io.to('room_' + data.talk.user._id).emit('teacher_call', { talk: t });
      });      
    });
  }).catch(err => {});
};

exports.cancelTalk = (io, socket, data) => {
  socket.join('teachers_room');
  socket.broadcast.to('teachers_room').emit('selected_talk', { teacherTalk: data.talk });
  socket.leave('teachers_room');
  TalkPool.updateMany({ $in: { talks: data.talk } }, { $pull: { talks: { _id: data.talk._id } } })
  .then(() => {
    
  }).catch(err => {});
}

exports.cancelTeaching = (io, socket, data) => {
  socket.leave('teachers_room');
};
