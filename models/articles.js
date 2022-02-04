const mongoose = require('mongoose');

const articlesSchema = mongoose.Schema({
    articleId: {
        type: Number,
        required: true,
    },
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

module.exports = mongoose.model('articles', articlesSchema);
