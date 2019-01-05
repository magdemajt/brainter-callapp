
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  permission: { type: Number, required: true },
  updatedAt: { type: 'Date', default: Date.now, required: true },
});
adminSchema.statics.findRole = function (user, callback) {
  return this.find({ user: user._id })
    .then(callback);
};

module.exports = mongoose.model('Admin', adminSchema);
