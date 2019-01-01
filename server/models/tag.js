
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: { type: 'String', required: true, unique: true },
  aliases: { type: 'Array' },
  createdAt: { type: 'Date', default: Date.now, required: true },
});

module.exports = mongoose.model('Tag', tagSchema);
