const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

const {
  getAllArticles,
  getArticle,
  postArticle,
  editPage,
  checkHost,
  editArticle,
  deleteArticle,
} = require('../controller/articles');

// 글쓰기 페이지 연결
router.get('/posts', (req, res) => {
  res.render('post');
});

// 게시글 전체 목록 조회
router.get('/articles', getAllArticles);

// 게시글 상세 조회
router.get('/articles/:articleId', getArticle);

// 게시글 작성
router.post('/posts', authMiddleware, postArticle);

// 게시글 수정 페이지 로드
router.get('/:articleId', editPage);

// 게시글 작성자 확인
router.get('/checkHost/:articleId', authMiddleware, checkHost);

// 게시글 수정
router.put('/:articleId', editArticle);

// 게시글 삭제
router.delete('/:articleId', deleteArticle);

module.exports = router;
