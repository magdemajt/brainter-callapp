
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
    .skip(part)
    .populate({ path: 'participants', select: 'name' })
    .populate({
      path: 'messages',
      options: {
        limit: 25,
        sort: '-createdAt',
      }
    })
    .then(callback);
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
    })
    .then(callback);
};
messageUserSchema.statics.addMessage = function (messageUser, message, callback) {
  return this.findOneAndUpdate({ _id: messageUser }, { $set: { updatedAt: Date.now() }, $push: { messages: message } }, { new: true })
    .then(callback);
};
messageUserSchema.statics.createOrReturn = function (participants, requester, callback) {
  return this.find({ participants: { $all: participants } }).populate('participants').sort('-updatedAt')
    .populate({
      path: 'messages',
      options: {
        limit: 25,
        sort: '-createdAt'
      }
    })
    .then((mu) => {
      if (mu.length > 0) {
        callback(mu);
      } else {
        this.create({ participants, requestingId: requester }).then(callback);
      }
    });
};
module.exports = mongoose.model('MessageUser', messageUserSchema);
