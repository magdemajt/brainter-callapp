
const mongoose = require('mongoose');

const { Schema } = mongoose;

const tagSchema = new Schema({
  tag: { type: Schema.Types.ObjectId, ref: 'Tag' },
  name: { type: 'String' },
  talks: [{ type: Schema.Types.ObjectId, ref: 'TeacherTalk' }],
  createdAt: { type: 'Date', default: Date.now, required: true },
});

module.exports = mongoose.model('TalkPool', tagSchema);
