const Articles = require('../models/articles');

// 게시글 전체 목록 조회
const getAllArticles = async (req, res) => {
  try {
    const articles = await Articles.find({}).sort('-articleId').exec();
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
    const article = await Articles.find({ articleId });
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
    const nickname = res.locals['user']['nickname'];
    await Articles.create({
      nickname,
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
    const article = await Articles.find({ articleId });
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
    const article = await Articles.find({ articleId });
    const author = article[0].nickname;
    const nickname = res.locals['user']['nickname'];
    if (author === nickname) {
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
    const existsArticle = await Articles.find({ articleId });
    if (!existsArticle.length) {
      return res.status(400).json({
        success: false,
        errorMessage: '해당 게시글은 삭제된 상태입니다.',
      });
    }
    await Articles.updateOne({ articleId }, { $set: { title, content } });
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
    await Articles.deleteOne({ articleId });
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
