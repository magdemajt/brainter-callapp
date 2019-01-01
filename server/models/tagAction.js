const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagActionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  tag: { type: Schema.Types.ObjectId, ref: 'Tag' },
  name: { type: 'String', required: true },
  type: { type: 'Number', default: 1 }, // 1 - add, -1 - remove
  dispatched: { type: 'Date', default: Date.now, required: true },
});

tagActionSchema.methods.assignUser = function (user) {
  this.user = user;
};
module.exports = mongoose.model('TagAction', tagActionSchema);
