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
  // here find recommended user to talk to algorithm
  User.find({ _id: { $ne: socket.authUser._id }, active: true }).select('name photo active').limit(4).populate('tags.tag')
    .then((users) => {
      socket.emit('recom_users', { users });
    })
    .catch(err => console.log(err));
};

exports.getUser = (req, res) => {
  User.getById(req.params.id, (user) => {
    user ? res.send(user) : res.sendStatus(404);
  });
};

exports.getUsers = (req, res) => {
  User.find({}).select('name photo active').limit(20).skip(req.params.offset * 20)
    .populate('tags')
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {});
};

exports.findUsers = (io, socket, { filter }) => {
  const usersToSend = [];

  User.find({ name: { $regex: `.*${filter}.*`, $options: 'i' }, _id: { $nin: usersToSend.map(user => user._id) } }).select('name photo active').limit(10).then((users) => {
    usersToSend.push(...users);
    User.find({ name: filter, _id: { $nin: usersToSend.map(user => user._id) } }).select('name photo active').then((users2) => {
      usersToSend.unshift(...users2);
      if (filter.includes('@')) {
        User.find({ email: filter }).select('name photo active email').then((user3) => {
          if (user3.length > 0) {
            usersToSend.unshift(user3[0]);
            socket.emit('found_users', { users: usersToSend });
          }
        });
      } else {
        socket.emit('found_users', { users: usersToSend });
      }
    });
    // console.log(usersToSend);
  })
    .catch(err => console.log(err));
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
