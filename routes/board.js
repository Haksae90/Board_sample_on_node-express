const express = require('express');
const router = express.Router();
const Articles = require('../models/articles');
const authMiddleware = require('../middlewares/auth-middleware');

// 게시글 전체 목록 조회
router.get('/articles', async (req, res) => {
  try {
    const articles = await Articles.find({}).sort('-articleId').exec();
    res.json({
      articles,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({});
  }
});

// 게시글 상세 조회
router.get('/articles/:articleId', async (req, res) => {
  try {
    const {
      params: { articleId },
    } = req;
    const article = await Articles.find({ articleId });
    res.status(200).render('detail', { article });
  } catch (err) {
    console.log(err);
    res.status(400).send({});
  }
});

// 게시글 작성
router.post('/post', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const articlesIdMax = await Articles.findOne().sort('-articleId').exec();
  let articleId = 1;

  if (articlesIdMax) {
    articleId = Number(articlesIdMax.articleId) + 1;
  }

  const nickname = res.locals['user']['nickname'];
  await Articles.create({
    articleId,
    nickname,
    title,
    content,
  });
  res.json({ success: true });
});

// 게시글 수정 페이지 로드
router.get('/edit/:articleId', async (req, res) => {
  try {
    const {
      params: { articleId },
    } = req;
    const article = await Articles.find({ articleId });
    res.status(200).render('edit', { article });
  } catch (err) {
    res.status(400).send({});
  }
});

// 게시글 작성자 확인
router.get('/checkHost/:articleId', authMiddleware, async (req, res) => {
  try {
    const {
      params: { articleId },
    } = req;
    const article = await Articles.find({ articleId });
    const author = article[0].nickname;
    const nickname = res.locals['user']['nickname'];
    if (author === nickname) {
      res.json({ result: true });
    } else {
      res.json({ result: false });
    }
  } catch (err) {
    res.status(400).send({});
  }
});

// 게시글 수정
router.put('/edit/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;
    const { title, content } = req.body;
    const existsArticle = await Articles.find({ articleId });
    if (!existsArticle.length) {
      return res.status(400).json({
        success: false,
        errorMessage: '해당 게시글은 삭제된 상태입니다.',
      });
    }
    await Articles.updateOne({ articleId }, { $set: { title, content } });
    res.status(200).send({});
  } catch (err) {
    res.status(400).send({});
  }
});

// 게시글 삭제
router.delete('/delete/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;
    await Articles.deleteOne({ articleId });
    res.status(200).send({});
  } catch (err) {
    res.status(400).send({});
  }
});

module.exports = router;
