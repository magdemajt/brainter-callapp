const User = require('../models/user');
const Tag = require('../models/tag');
const TalkPool = require('../models/talkPool');
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
  const talkPool = new TalkPool({
    tag,
    name: 'New Pool ' + parseInt(Math.random() * 10000) - parseInt(Math.random() * 5)
  });
  tag.save().then(() => {
    talkPool.save().then(() => {
      res.send(true);
    });
  }).catch(err => {
    console.log(err);
    res.sendStatus(500);
  });
}