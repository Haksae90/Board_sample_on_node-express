const mongoose = require('mongoose');

const commentsSchema = mongoose.Schema({
  articleId: {
    type: String,
    required: true,
  },
  commentId: {
    type: String,
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

module.exports = mongoose.model('comments', commentsSchema);
