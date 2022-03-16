const Comments = require('../models/comments');

// 코멘트 작성
const postComment = async (req, res) => {
  const { articleId, comment } = req.body;
  const commentIdMax = await Comments.findOne().sort('-commentId').exec();
  let commentId = 1;

  if (commentIdMax) {
    commentId = Number(commentIdMax.commentId) + 1;
  }

  const nickname = res.locals['user']['nickname'];
  await Comments.create({
    articleId,
    commentId,
    nickname,
    comment,
  });
  res.json({ success: true });
};

// 코멘트 불러오기 (비회원시)
const getCommentsNonAuth = async (req, res) => {
  try {
    const {
      params: { articleId },
    } = req;
    const comments = await Comments.find({ articleId })
      .sort('-commentId')
      .exec();
    res.json({ comments });
  } catch (err) {
    res.status(400).send({});
  }
};

// 코멘트 불러오기
const getCommentsAuth = async (req, res) => {
  try {
    const {
      params: { articleId },
    } = req;
    const comments = await Comments.find({ articleId })
      .sort('-commentId')
      .exec();
    const userNickname = res.locals['user']['nickname'];
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
    await Comments.updateOne({ commentId }, { $set: { comment } });
    res.status(200).send({});
  } catch {
    res.status(400).send({});
  }
};

// 코멘트 삭제
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    await Comments.deleteOne({ commentId });
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
