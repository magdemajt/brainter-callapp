const User = require('../models/user');
const Message = require('../models/message');
const MessageUser = require('../models/messageUser');
const Admin = require('../models/admin');

exports.checkIfAdmin = (req, res, next) => {
    Admin.findRole({ _id: req.authUser._id }).then(admins => {
        if(admins.length > 0) {
          req.authUser.permission = admins[0].permission;
          next(); 
        } else {
            res.sendStatus(403);
        }
    }).catch(err => {
        res.sendStatus(500);
    })
};

exports.getPermission = (req, res) => {
    res.send(`${req.authUser.permission}`);
};

exports.getMessageUserStats = (req, res) => {
    MessageUser.find({ updatedAt: new Date(req.params.selectedDate) }).sort('-updatedAt').populate({ path: 'participants', select: 'createdAt email' }).populate({path: 'messages', select: 'createdAt sender' })
    .then(mu => {
        res.send(mu);
    }).catch(err => {});
};
exports.getMessageStats = (req, res) => {
    Message.find({ createdAt: new Date(req.params.selectedDate) }).sort('-updatedAt').populate({ path: 'sender', select: 'createdAt' })
    .then(messages => {
        res.send(messages);
    }).catch(err => {})
};
exports.getUsersStats = (req, res) => {
    User.find({ createdAt: new Date(req.params.selectedDate) }).select(['createdAt', 'email'])
    .then(users => {
        res.send(users);
    })
    .catch(err => {});
}