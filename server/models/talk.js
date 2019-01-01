
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const talkSchema = new Schema({
  topic: { type: 'String', required: true },
  date: { type: 'Date', default: Date.now },
  pointsFor: { type: 'Number', required: true, default: 10 },
  messageUser: [{ type: Schema.Types.ObjectId, ref: 'MessageUser' }],
  createdAt: { type: 'Date', default: Date.now, required: true },
});

module.exports = mongoose.model('Talk', talkSchema);
