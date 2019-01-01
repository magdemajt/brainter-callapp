
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const crypto = require('crypto');

const userSchema = new Schema({
  name: { type: 'String', required: true },
  points: { type: 'Number', required: true, default: 0 },
  email: { type: 'String', required: true, unique: true },
  //  interests: { type: 'Array', default: null },
  tags: [{
    tag: { type: Schema.Types.ObjectId, ref: 'Tag' },
    level: { type: 'Number', default: 0 },
  }],
  token: { type: 'String', default: '', select: false },
  password: { type: 'String', select: false },
  desc: { type: 'String', default: '' },
  photo: { data: String, contentType: String },
  birthDate: { type: 'Date' },
  salt: { type: 'String', select: false },
  talks: [{ type: Schema.Types.ObjectId, ref: 'Talk' }],
  createdAt: { type: 'Date', default: Date.now, required: true },
  actionStorage: { type: Schema.Types.ObjectId, ref: 'UserAction' }
});

userSchema.methods.setPassword = function (password) {
  // creating a unique salt for a particular user
  this.salt = crypto.randomBytes(16).toString('hex');
  // hashing user's salt and password with 1000 iterations,
  // 64 length and sha512 digest
  this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function (password) {
  const hash = crypto.pbkdf2Sync(password,
    this.salt, 1000, 64, 'sha512').toString('hex');
  return this.password === hash;
};

userSchema.methods.createToken = function () {
  const salt = crypto.randomBytes(16).toString('hex');
  this.token = crypto.pbkdf2Sync(Date.now().toString() + this.email, salt, 1000, 64, 'sha512').toString('hex');
  return this.token;
};
userSchema.methods.assignStorage = function (storage) {
  this.actionStorage = storage._id;
  storage.assignUser(this);
};
userSchema.statics.findByToken = function (token, callback) {
  return this.findOne({ token }).select('+token').populate('tags.tag').then(callback);
};
userSchema.statics.getById = function (id, callback) {
  return this.findById(id).populate('tags.tag').then(callback);
};
userSchema.statics.findByTags = function (tags, callback) {
  const filteredUsers = [];
  this.find({}).populate('tags.tag').then((users) => {
    users.forEach((user) => {
      if (user.tags.find(tag => tags.includes(tag._id))) {
        filteredUsers.push(user);
      }
    });
    callback(users);
  });
};

module.exports = mongoose.model('User', userSchema);
