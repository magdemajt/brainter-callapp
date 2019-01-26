
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  seen: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: 'Date', default: Date.now, required: true }
});
messageSchema.statics.findUserMessages = function (user1, part, callback) {
  return this.find({ $or: [{ sender: user1 }, { sender: user2 }, { receiver: user1 }, { receiver: user2 }] })
    .sort('-createdAt')
    .limit(15)
    .skip(part * 15)
    .then(callback);
};
module.exports = mongoose.model('Message', messageSchema);
