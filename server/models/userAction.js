
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userActionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
  nameChanges: { type: 'Array', required: false },
  passwordChanges: { type: 'Array', required: false },
  pointInputs: { type: 'Array', required: false },
  emailChanges: { type: 'Array', required: false },
  tagActions: [{ type: Schema.Types.ObjectId, ref: 'TagAction' }],
  logins: { type: 'Array', default: [] },
});

userActionSchema.methods.assignUser = function (user) {
  this.user = user._id;
};
userActionSchema.methods.assignTagAction = function (tagAction) {
  this.tagActions = tagAction._id;
  tagAction.assignUser(this.user);
};

module.exports = mongoose.model('UserAction', userActionSchema);
