
const mongoose = require('mongoose');

const { Schema } = mongoose;

const tagSchema = new Schema({
  tag: { type: Schema.Types.ObjectId, ref: 'Tag' },
  name: { type: 'String' },
  talks: [{
    topic: { type: 'String', default: 'No Topic...' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    selectedTags: [{ type: Schema.Types.ObjectId, ref:'Tag' }]
  }],
  createdAt: { type: 'Date', default: Date.now, required: true },
});

module.exports = mongoose.model('TalkPool', tagSchema);
