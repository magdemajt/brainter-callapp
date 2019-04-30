
const mongoose = require('mongoose');

const { Schema } = mongoose;
const crypto = require('crypto');

const lessonSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  teacher: { type: Schema.Types.ObjectId, ref: 'User' },
  tag: { type: Schema.Types.ObjectId, ref: 'Tag' },
  beginTime: { type: 'Date', required: true },
  endTime: { type: 'Date', required: true },
  //  interests: { type: 'Array', default: null },
  options: {
    advancement: { type: 'Number', default: 0 },
    maxPeople: { type: 'Number', default: 1 },
  },
  createdAt: { type: 'Date', default: Date.now, required: true },
});

// lessonSchema.methods.validPassword = function (password) {
//   const hash = crypto.pbkdf2Sync(password,
//     this.salt, 1000, 64, 'sha512').toString('hex');
//   return this.password === hash;
// };

// lessonSchema.statics.getById = function (id, callback) {
//   return this.findById(id).populate('tags.tag').then(callback);
// };

module.exports = mongoose.model('Lesson', lessonSchema);
