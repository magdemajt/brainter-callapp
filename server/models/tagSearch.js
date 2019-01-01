const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSearchSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  tag: { type: Schema.Types.ObjectId, ref: 'Tag' },
  updatedAt: { type: 'Date', default: Date.now, required: true },
});

module.exports = mongoose.model('TagSearch', tagSearchSchema);
