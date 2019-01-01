const User = require('../models/user');
const Tag = require('../models/tag');
const errors = require('./errorHandle/errorStatusCodes');
const handleStatusCodes = require('./errorHandle/errorStatuses');
const UserAction = require('../models/userAction');
const TagAction = require('../models/tagAction');

exports.getTags = (req, res) => {
  Tag.find({})
  .then(tags => {
    res.send(tags);
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(500);
  })
}

exports.addTag = (req, res) => {
  const tag = new Tag({
    name: req.body.name.toLowerCase(),
    aliases: req.body.aliases || []
  });
  tag.save().then(() => {
    res.sendStatus(200);
  }).catch(err => {
    console.log(err);
    res.sendStatus(500);
  });
}