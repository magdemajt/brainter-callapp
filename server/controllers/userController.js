const path = require('path');
const User = require('../models/user');
const errors = require('./errorHandle/errorStatusCodes');
const handleStatusCodes = require('./errorHandle/errorStatuses');
const UserAction = require('../models/userAction');
const TagAction = require('../models/tagAction');
const { addUserTags } = require('./usersController');

exports.validateUserToken = (req, res, next) => {
  const token = req.headers.authorization !== undefined ? req.headers.authorization : (req.cookies !== undefined ? req.cookies.token : null);
  User.findByToken(token, (user) => {
    if (user) {
      req.authUser = user;
      next();
    } else {
      res.cookie('token', 'no', { maxAge: 100 });
      res.status(401).send('Auth error');
    }
  });
};

exports.validateUserTokenSockets = (socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    User.findByToken(socket.handshake.query.token, (user) => {
      if (user) {
        socket.authUser = user;
        next();
      } else {
        next(new Error('Authentication error'));
      }
    });
  }
};
exports.getImage = (req, res) => {
  User.findById(req.params.id).select('photo')
  .then(user => {
    const photo = user.photo;
    if (photo.data !== '') {
      res.sendFile(path.join(__dirname, '../../', photo.data));
    } else {
      res.sendFile(path.join(__dirname, '../../', './uploads/NoProfileImage'));
    }
  })
  .catch(err =>{});
};

exports.updateUser = (req, res) => {
  const user = req.authUser;
  user.desc = req.body.desc;
  user.save()
    .then((newUser) => {
      res.send(newUser);
    });
};

exports.updateUserMail = (req, res) => {
  User.find({email: req.body.email})
  .then(users => {
    if(users.length === 0) {
        const user = req.authUser;
        user.email = req.body.email;
        user.save()
        .then((newUser) => {
          res.send(newUser.email);
        }).catch(err => {
          console.log(err);
        })
      }
    }).catch(err => {});
};
exports.updatePassword = (req, res) => {
  User.findById(req.authUser._id).then(user => {
    if (user.validPassword(req.body.oldPass)) {
      user.setPassword(req.body.pass);
      user.save().then(() => {
        res.send('0');
      }).catch(err => {
        res.send('1');
      });
    } else {
      res.send('1');
    }
  }).catch(err => {
    res.send('1');
  })
};

exports.updatePhoto = (req, res) => {
  const photo = {
    data: `${req.file.path.substr(req.file.path.indexOf('uploads'))}`,
    contentType: 'image/png'
  };
  req.authUser.photo = photo;
  req.authUser.save();
  res.send(photo);
};

exports.getAuthUser = (req, res) => {
  if (req.authUser) {
    res.send(req.authUser);
  }
};

exports.addAuthTags = (req, res) => {
  const tags = req.body.tags;
  addUserTags(req.authUser, tags, () => {
    res.sendStatus(200);
  });
};

exports.updateUserWithTags = (req, res) => {
  const ids = [];
  const tags = [];
  req.body.tags.forEach((tag) => {
    if (!ids.includes(tag._id)) {
      tags.push(Object.assign({}, { tag: tag._id, level: tag.level }));
      ids.push(tag._id);
    }
  });
  User.findByIdAndUpdate(req.authUser._id, { $set: { tags, desc: req.body.desc } }).then(() => {
    res.sendStatus(200);
  }).catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
};

