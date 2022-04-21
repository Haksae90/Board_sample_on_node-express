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
router.post('/', authMiddleware, postComment);

// 코멘트 불러오기 (비회원시)
router.get('/notHost/:articleId', getCommentsNonAuth);

// 코멘트 불러오기
router.get('/host/:articleId', authMiddleware, getCommentsAuth);

// 코멘트 수정
router.put('/:commentId', editComment);

// 코멘트 삭제
router.delete('/:commentId', deleteComment);

module.exports = router;
