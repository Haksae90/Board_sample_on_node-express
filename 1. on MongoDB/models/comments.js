const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const commentsSchema = mongoose.Schema({
  articleId: {
    type: Number,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

commentsSchema.plugin(AutoIncrement, { inc_field: 'commentId' });
module.exports = mongoose.model('comments', commentsSchema);
