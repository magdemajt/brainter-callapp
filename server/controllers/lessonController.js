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
const TeacherTalk = require('../models/teacherTalk');
const { addUserTags } = require('./usersController');

exports.searchTeacher = (io, socket, {
  topic, selectedTags, paid, multiperson
}) => {
  const tagsIds = selectedTags.map(tag => tag._id);
  if (multiperson) {
  } else {
    const talk = new TeacherTalk({
      selectedTags, topic, user: socket.authUser._id, paid
    });
    talk.save().then(() => {
      let count = 0;
      selectedTags.forEach((tag) => {
        TalkPool.updateOne({ tag: tag._id }, { $push: { talks: talk } })
          .then((t) => {
            count++;
            if (count === selectedTags.length || count === 3) {
              socket.emit('your_teacher_talk', { talk });
            }
          })
          .catch(err => console.log(err));
      });
    })
      .catch(err => console.log(err));
  }
};

exports.searchTeacherMulti = (io, socket, {
  topic, selectedTags, paid, multiperson
}) => {
  const tagsIds = selectedTags.map(tag => tag._id);
  TalkPool.find({ tag: { $in: tagsIds } }).populate({ path: 'talks', match: { createdAt: { $gte: Date.now - 5 * 60 * 1000 }, paid, teacher: true } }).select('talks')
    .populate({ path: 'talks.selectedTags', select: 'name' })
    .populate({ path: 'talks.user', select: 'name' })
    .then((talks) => {
      socket.emit('multi_talks', { talks });
    })
    .catch(err => console.log(err));
};

exports.leaveMultiRoom = (io, socket, {talk}) => {
  socket.emit('multi_joined_user', {talk});
  io.to(`multi_${talk._id}`).broadcast.emit('multi_left', { user: { _id: socket.authUser._id} });
  socket.join(`multi_${talk._id}`);
};

exports.joinMultiRoom = (io, socket, {talk}) => {
  socket.emit('multi_joined_user', {talk});
  io.to(`multi_${talk._id}`).broadcast.emit('multi_joined', { user: { _id: socket.authUser._id, name: socket.authUser.name } });
  socket.join(`multi_${talk._id}`);
};

exports.destroyMultiTalk = (io, socket, { talk }) => {
  socket.broadcast.to(`multi_${talk._id}`).emit('destroyed_multi_talk');
  socket.leave(`multi_${talk._id}`);
  TalkPool.updateMany({ talks: talk }, { $pull: { talks: talk._id } })
    .then(() => {

    }).catch((err) => {});
};

exports.startMultiTalk = (io, socket, { talk }) => {
  TalkPool.updateMany({ talks: talk }, { $pull: { talks: talk._id } })
    .then((t2) => {
      if (talk.teacher) {
        MessageUser.createOrReturn([talk.user, socket.authUser._id], socket.authUser._id, (messageUsers) => {
          const t = new Talk({
            topic: talk.topic,
            messageUser: messageUsers[0],
            tags: talk.selectedTags,
            caller: socket.authUser._id
          });
          t.save().then(() => {
            socket.emit('starting_teaching', { talk: t });
            io.to(`room_${talk.user._id}`).emit('teacher_call', { talk: t });
          });
        });
      }
    }).catch(err => console.log(err));
  // io.to(`multi_${talk._id}`).broadcast.emit('started_multi_talk')
};

exports.createMultiTalk = (io, socket, {
  paid, multiperson, topic, selectedTags
}) => {
  const talk = new TeacherTalk({
    selectedTags,
    topic,
    user: socket.authUser._id,
    paid,
    teacher: true
  });
  talk.save().then(() => {
    let count = 0;
    selectedTags.forEach((tag) => {
      TalkPool.updateOne({ tag: tag._id }, { $push: { talks: talk } })
        .then((t) => {
          count++;
          if (count === selectedTags.length || count === 3) {
            socket.join(`multi_${talk._id}`);
            socket.emit('your_teacher_talk', { talk });
          }
        })
        .catch(err => console.log(err));
    });
  })
    .catch(err => console.log(err));
};

exports.searchTalks = (io, socket, {
  paid, multiperson, topic, selectedTags
}) => {
  const tagsIds = selectedTags.map(tag => tag._id);
  TalkPool.find({ tag: { $in: tagsIds }, paid }).populate({ path: 'talks', match: { createdAt: { $gte: Date.now - 20 * 1000 } } }).select('talks')
    .populate({ path: 'talks.selectedTags', select: 'name' })
    .populate({ path: 'talks.user', select: 'name' })
    .then((talks) => {
      socket.join('teachers_room');
      socket.emit('teacher_talks', { teacherTalks: talks, date: Date.now });
    })
    .catch(err => console.log(err));
};

exports.selectTalk = (io, socket, data) => {
  TalkPool.updateMany({ talks: data.talk }, { $pull: { talks: data.talk._id } })
    .then((t2) => {
      if (!data.talk.teacher) {
        socket.broadcast.to('teachers_room').emit('selected_talk', { teacherTalk: data.talk });
        MessageUser.createOrReturn([data.talk.user, socket.authUser._id], socket.authUser._id, (messageUsers) => {
          const t = new Talk({
            topic: data.talk.topic,
            messageUser: messageUsers[0],
            tags: data.talk.selectedTags,
            caller: socket.authUser._id
          });
          t.save().then(() => {
            socket.emit('starting_teaching', { talk: t });
            io.to(`room_${data.talk.user._id}`).emit('teacher_call', { talk: t });
          });
        });
      }
    }).catch(err => console.log(err));
};

exports.cancelTalk = (io, socket, data) => {
  socket.join('teachers_room');
  socket.broadcast.to('teachers_room').emit('selected_talk', { teacherTalk: data.talk });
  socket.leave('teachers_room');
  TalkPool.updateMany({ talks: data.talk }, { $pull: { talks: data.talk._id } })
    .then(() => {

    }).catch((err) => {});
};

exports.cancelTeaching = (io, socket, data) => {
  socket.leave('teachers_room');
};
