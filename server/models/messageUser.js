
const mongoose = require('mongoose');

const { Schema } = mongoose;

const messageUserSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  requestingId: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: 'Date', default: Date.now, required: true },
});
messageUserSchema.statics.findMessageUsers = function (user, part, callback) {
  return this.find({ participants: { $elemMatch: { $eq: user } } })
    .sort('+updatedAt')
    .limit(15)
    .skip(part * 15)
    .populate({ path: 'participants', select: ['name', 'photo'] })
    .populate({
      path: 'messages',
      options: {
        limit: 25,
        sort: '-createdAt',
      }
    })
    .populate({
      path: 'messages.sender',
      select: ['photo', 'name'],
      model: 'User'
    })
    .then(callback);
};
messageUserSchema.statics.findAllMessageUsers = function (user, callback) {
  return this.find({ participants: { $elemMatch: { $eq: user }, $size: 2 } })
    .sort('+updatedAt')
    .populate({ path: 'participants', select: 'name' })
    .then(callback)
    .catch(err => console.log(err));
};
messageUserSchema.statics.findMessages = function (messageUser, part, callback) {
  return this.findById(messageUser)
    .populate({
      path: 'messages',
      options: {
        limit: 25,
        sort: '-createdAt',
        skip: part
      }
    }).populate({
      path: 'messages.sender',
      select: ['photo', 'name']
    })
    .then(callback);
};
messageUserSchema.statics.addMessage = function (messageUser, message, callback) {
  return this.findOneAndUpdate({ _id: messageUser }, { $set: { updatedAt: Date.now() }, $push: { messages: message } }, { new: true })
    .then(callback);
};
messageUserSchema.statics.createOrReturn = function (participants, requester, callback) {
  return this.find({ $and: [{ participants: { $all: participants } }, { participants: { $size: participants.length } }] }).populate('participants').sort('-updatedAt')
    .populate({
      path: 'messages',
      options: {
        limit: 25,
        sort: '-createdAt'
      }
    })
    .populate({ path: 'participants', select: ['name', 'photo'] })
    .then((mu) => {
      if (mu.length > 0) {
        callback(mu);
      } else {
        this.create({ participants, requestingId: requester }).then((messageUser) => {
          this.find({ _id: messageUser._id }).populate({ path: 'participants', select: ['name', 'photo'] }).then(callback);
        });
      }
    });
};
module.exports = mongoose.model('MessageUser', messageUserSchema);
