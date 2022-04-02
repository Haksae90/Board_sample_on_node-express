const { Users, Articles } = require('../models');
const sequilize = require('sequelize');

// 게시글 전체 목록 조회
const getAllArticles = async (req, res) => {
  try {
    const articles = await Articles.findAll({
      attributes: [
        'articleId',
        'title',
        [sequilize.col('User.nickname'), 'nickname'],
      ],
      include: [{ model: Users, attributes: [] }],
      order: [['articleId', 'DESC']],
    });
    res.status(200).json({
      articles,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ errorMessage: '잘못된 요청입니다 ' });
  }
};

// 게시글 상세 조회
const getArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await Articles.findOne({
      where: { articleId },
      attributes: ['articleId', 'title', 'content'],
      include: [{ model: Users, attributes: ['nickname'] }],
    });
    res.status(200).render('detail', { article });
  } catch (err) {
    console.error(err);
    res.status(400).json({ errorMessage: '잘못된 요청입니다 ' });
  }
};

// 게시글 작성
const postArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { userId } = res.locals;
    await Articles.create({
      userId,
      title,
      content,
    });
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ errorMessage: '잘못된 요청입니다 ' });
  }
};

// 게시글 수정 페이지 로드
const editPage = async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await Articles.findOne({
      where: { articleId },
    });
    res.status(200).render('edit', { article });
  } catch (err) {
    console.error(err);
    res.status(400).json({ errorMessage: '잘못된 요청입니다 ' });
  }
};

// 게시글 작성자와 로그인한 유저가 동일한지 확인 (수정페이지)
const checkHost = async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await Articles.findOne({
      where: { articleId },
    });
    const author = article.userId;
    const { userId } = res.locals;
    if (author === userId) {
      res.status(200).json({ result: true });
    } else {
      res.status(200).json({ result: false });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ errorMessage: '잘못된 요청입니다 ' });
  }
};

// 게시글 수정
const editArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { title, content } = req.body;
    const existsArticle = await Articles.findOne({
      where: { articleId },
    });
    if (!existsArticle) {
      return res.status(400).json({
        success: false,
        errorMessage: '해당 게시글은 삭제된 상태입니다.',
      });
    }
    await Articles.update(
      {
        title,
        content,
      },
      {
        where: { articleId },
      }
    );
    res.status(200).json({ message: '수정되었습니다' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ errorMessage: '잘못된 요청입니다' });
  }
};

// 게시글 삭제
const deleteArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    await Articles.destroy({
      where: { articleId },
    });
    res.status(200).json({ message: '삭제되었습니다' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ errorMessage: '잘못된 요청입니다 ' });
  }
};

module.exports = {
  getAllArticles,
  getArticle,
  postArticle,
  editPage,
  checkHost,
  editArticle,
  deleteArticle,
};
