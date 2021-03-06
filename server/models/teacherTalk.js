
const mongoose = require('mongoose');

const { Schema } = mongoose;

const tagSchema = new Schema({
  topic: { type: 'String', default: 'No Topic...' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  teacher: { type: 'Boolean', default: false },
  paid: { type: 'Boolean', default: false },
  selectedTags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  createdAt: { type: 'Date', default: Date.now, required: true },
});

module.exports = mongoose.model('TeacherTalk', tagSchema);
