const { Users, Comments } = require('../models');

// 코멘트 작성
const postComment = async (req, res) => {
  try {
    const { articleId, comment } = req.body;
    const { userId } = res.locals;

    await Comments.create({
      userId,
      articleId,
      comment,
    });
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ errorMessage: '잘못된 요청입니다' });
  }
};

// 코멘트 불러오기 (비회원시)
const getCommentsNonAuth = async (req, res) => {
  try {
    const { articleId } = req.params;
    const comments = await Comments.findAll({
      where: { articleId },
      attributes: ['commentId', 'comment'],
      include: [{ model: Users, attributes: ['nickname'] }],
      order: [['commentId', 'DESC']],
    });
    res.status(200).json({ comments });
  } catch (err) {
    console.error(err);
    res.status(400).json({ errorMessage: '잘못된 요청입니다' });
  }
};

// 코멘트 불러오기
const getCommentsAuth = async (req, res) => {
  try {
    const { articleId } = req.params;
    const comments = await Comments.findAll({
      where: { articleId },
      attributes: ['commentId', 'comment'],
      include: [{ model: Users, attributes: ['nickname'] }],
      order: [['commentId', 'DESC']],
    });
    const { userId } = res.locals;
    const userNickname = await Users.findOne({
      where: { userId },
      attributes: ['nickname'],
    });
    res.status(200).json({ comments, userNickname });
  } catch (err) {
    console.error(err);
    res.status(400).json({ errorMessage: '잘못된 요청입니다' });
  }
};

// 코멘트 수정
const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;
    await Comments.update(
      {
        comment,
      },
      {
        where: { commentId },
      }
    );
    res.status(200).json({ message: '수정되었습니다' });
  } catch {
    console.error(err);
    res.status(400).json({ errorMessage: '잘못된 요청입니다' });
  }
};

// 코멘트 삭제
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    await Comments.destroy({
      where: { commentId },
    });
    res.status(200).json({ message: '삭제되었습니다' });
  } catch {
    console.error(err);
    res.status(400).json({ errorMessage: '잘못된 요청입니다' });
  }
};

module.exports = {
  postComment,
  getCommentsNonAuth,
  getCommentsAuth,
  editComment,
  deleteComment,
};
