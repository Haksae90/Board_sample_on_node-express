const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const articlesSchema = mongoose.Schema({
  nickname: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

articlesSchema.plugin(AutoIncrement, { inc_field: 'articleId' });

module.exports = mongoose.model('articles', articlesSchema);
