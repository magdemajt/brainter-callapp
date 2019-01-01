const User = require('../models/user');
const errors = require('./errorHandle/errorStatusCodes');
const handleStatusCodes = require('./errorHandle/errorStatuses');
const UserAction = require('../models/userAction');
const TagAction = require('../models/tagAction');

const checkIfEmailInDB = async (email) => {
  const isAvailable = await User.find({ email })
    .then((emails) => {
      if (emails.length > 0) {
        return false;
      }
      return true;
    })
    .catch((error) => {
    console.log(error); // eslint-disable-line
    });
  return isAvailable;
};

exports.createNewUser = async (req, res) => {
  const input = req.body;
  const emailAvailable = checkIfEmailInDB(input.email);
  let err = null;
  if (!emailAvailable) {
    err = errors.emailAlreadyInDB;
  }
  if (err !== null) {
    res.status(500).send({ statusCode: err, status: handleStatusCodes(err) });
    return null;
  }
  const user = new User({
    name: input.name,
    email: input.email,
    photo: { data: '', contentType: '' },
    birthDate: Date.now(),
    tags: []
  });
  const actionStorage = new UserAction({});
  user.setPassword(input.pass);
  const token = user.createToken();
  user.assignStorage(actionStorage);
  user.save().then(() => {
    actionStorage.save()
      .then(() => {
        res.cookie('token', token).send(token);
      })
      .catch(err => console.log(err));
  })
    .catch(err => console.log(err));
};

exports.checkIfEmailAvailable = async (req, res) => {
  const available = await checkIfEmailInDB(req.params.email);
  if (available) {
    res.send(available);
  } else {
    res.send('');
  }
};


exports.login = (req, res) => {
  User.findOne({ email: req.body.email }).select('+password +salt')
    .then((user) => {
      if (user !== null) {
        if (user.validPassword(req.body.pass)) {
        // Create token
          const token = user.createToken();
          user.save();
          res.cookie('token', token).send(token);
        } else {
          res.send({ statusCode: errors.invalidPassword, status: handleStatusCodes(errors.invalidPassword) });
        }
      } else {
        res.status(404).send('Incorrect email or password');
      }
    })
    .catch((err) => {
    console.error(err); // eslint-disable-line
      res.status(500).send('Problem with accesing the database');
    });
};
