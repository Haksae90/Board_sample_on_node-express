const mongoose = require('mongoose');

const commentsSchema = mongoose.Schema({
  articleId: {
    type: Number,
    required: true,
  },
  commentId: {
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

module.exports = mongoose.model('comments', commentsSchema);
