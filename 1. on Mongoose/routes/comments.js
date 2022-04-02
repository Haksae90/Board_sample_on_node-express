const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

const {
  postComment,
  getCommentsNonAuth,
  getCommentsAuth,
  editComment,
  deleteComment,
} = require('../controller/comments');

// 코멘트 작성
router.post('/post', authMiddleware, postComment);

// 코멘트 불러오기 (비회원시)
router.get('/checkHost/notusers/:articleId', getCommentsNonAuth);

// 코멘트 불러오기
router.get('/checkHost/:articleId', authMiddleware, getCommentsAuth);

// 코멘트 수정
router.put('/edit/:commentId', editComment);

// 코멘트 삭제
router.delete('/delete/:commentId', deleteComment);

module.exports = router;
