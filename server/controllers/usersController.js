const User = require('../models/user');
const errors = require('./errorHandle/errorStatusCodes');
const handleStatusCodes = require('./errorHandle/errorStatuses');
const UserAction = require('../models/userAction');
const TagAction = require('../models/tagAction');

exports.addUserTags = (user, tags, callback) => {
  User.update({ _id: user._id }, {
    $push: {
      tags: { $each: tags }
    }
  }).then(callback)
    .catch((err) => {

    });
};

exports.getRecommendedUsers = (io, socket, data) => {
  //here find recommended user to talk to algorithm
  socket.emit('recom_users', { users });
};

exports.getUser = (req, res) => {
  User.getById(req.params.id, (user) => {
    user ? res.send(user) : res.sendStatus(404);
  });
};

exports.getUsers = (req, res) => {
  User.find({}).select('name photo').limit(20).skip(req.params.offset * 20)
    .populate('tags')
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {});
};

exports.getUsersByTags = (req, res) => {
  const tags = req.body.tags.map(tag => tag._id);
  User.findByTags(tags, (users) => {
    if (users.length > 0) {
      res.send(users[Math.floor(Math.random() * users.length)]);
    } else {
      res.sendStatus(404);
    }
  });
};
