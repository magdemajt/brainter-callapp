
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const talkSchema = new Schema({
  topic: { type: 'String', required: true },
  date: { type: 'Date', default: Date.now },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  pointsFor: { type: 'Number', required: true, default: 10 },
  surveys: [{
    respondent: { type: Schema.Types.ObjectId, ref: 'User' },
    knowledge: { type: 'Number', default: -1 },
    culture: { type: 'Number', default: -1 },
    teaching: { type: 'Number', default: -1 },
    lesson: { type: 'Number', default: -1 }, // Ocena lekcji
    comment: { type: 'String' }
  }],
  caller: { type: Schema.Types.ObjectId, ref: 'User' },
  blackboard: {
    text: 'String'
  },
  messageUser: { type: Schema.Types.ObjectId, ref: 'MessageUser' },
  finishedAt: { type: 'Date' },
  createdAt: { type: 'Date', default: Date.now, required: true },
});

talkSchema.statics.getSurveysByUser = function (userId, callback) {
  this.find({ $and: [ { 'surveys.respondent': userId }, { 'surveys.knowledge': -1 }] }).populate({ path: 'caller', select: 'name' })
  .lean()
  .then(talks => {
    const sendTalks = talks.map(talk => {
      const surveys = talk.surveys.filter(survey => {
        return survey !== null && survey.respondent.toString() === userId.toString();
      });
      return { ...talk, surveys };
    });
    callback(sendTalks);
  }).catch(err => console.log(err));
}

module.exports = mongoose.model('Talk', talkSchema);
