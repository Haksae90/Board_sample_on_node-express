const { Users, Comments } = require('../models');

// 코멘트 작성
const postComment = async (req, res) => {
  const { articleId, comment } = req.body;
  const { userId } = res.locals;

  await Comments.create({
    userId,
    articleId,
    comment,
  });
  res.json({ success: true });
};

// 코멘트 불러오기 (비회원시)
const getCommentsNonAuth = async (req, res) => {
  try {
    const { articleId } = req.params;
    const comments = await Comments.findAll({
      where: { articleId },
      attributes: [ 'commentId', 'comment'],
      include: [
        { model: Users, attributes: ["nickname"]}
      ],
      order: [['commentId', 'DESC']],
      raw: true	
    });
    res.json({ comments });
  } catch (err) {
    res.status(400).send({});
  }
};

// 코멘트 불러오기
const getCommentsAuth = async (req, res) => {
  try {
    const { articleId } = req.params;
    const comments = await Comments.findAll({
      where: { articleId },
      attributes: [ 'commentId', 'comment'],
      include: [
        { model: Users, attributes: ["nickname"]}
      ],
      order: [['commentId', 'DESC']],
      raw: true	
    });
    const { userId } = res.locals;
    const userNickname = await Users.findOne({
      where: { userId },
      attributes: ['nickname'],
      raw: true
    });
    res.json({ comments, userNickname });
  } catch (err) {
    res.status(400).send({});
  }
};

// 코멘트 수정
const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;
    await Comments.update({
      comment
    } , {
      where: {commentId}
    });
    res.status(200).send({});
  } catch {
    res.status(400).send({});
  }
};

// 코멘트 삭제
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    await Comments.destroy({
      where: { commentId }
    })
    res.status(200).send({});
  } catch {
    res.status(400).send({});
  }
};

module.exports = {
  postComment,
  getCommentsNonAuth,
  getCommentsAuth,
  editComment,
  deleteComment,
};
