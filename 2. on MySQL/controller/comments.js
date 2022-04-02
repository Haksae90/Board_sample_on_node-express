// 코멘트 작성
const postComment = async (req, res) => {
  const connection = await req.app.get('pool').getConnection(async conn => conn)
  await connection.query(
    'INSERT INTO Comments(userId, articleId, comment, createdAt, updatedAt) VALUES(?,?,?,NOW(),NOW())',
    [res.locals.userId, req.body.articleId, req.body.comment]
  );
  connection.release();
  res.json({ success: true });
};

// 코멘트 불러오기 (비회원시)
const getCommentsNonAuth = async (req, res) => {
  try {
    const connection = await req.app.get('pool').getConnection(async conn => conn)
    const existComments = await connection.query(
      `SELECT U.nickname, C.comment FROM Comments C
      JOIN Users U ON U.userId = C.userId
      WHERE articleId=?`,
      [req.params.articleId]
    );
    const comments = existComments[0]
      connection.release();
      res.json({ comments });
  } catch (err) {
    res.status(400).send({});
  }
};

// 코멘트 불러오기
const getCommentsAuth = async (req, res) => {
  try {
      const connection = await req.app.get('pool').getConnection(async conn => conn)
      const existComments = await connection.query(
        `SELECT U.nickname, C.comment, C.commentId FROM Comments C
        JOIN Users U ON U.userId = C.userId
        WHERE articleId=?`,
        [req.params.articleId]
      );
      const comments = existComments[0]
      const [userNickname] = await connection.query(
        'SELECT nickname FROM Users WHERE userId=? LIMIT 1',
        [res.locals.userId]
      );
      connection.release();
      res.json({ comments, userNickname });
  } catch (err) {
    res.status(400).send({});
  }
};

// 코멘트 수정
const editComment = async (req, res) => {
  try {
    const connection = await req.app.get('pool').getConnection(async conn => conn)
    await connection.query(
      'UPDATE Comments SET comment=? WHERE commentId=?',
      [req.body.comment, req.params.commentId]
    );
    connection.release();
    res.status(200).send({});
  } catch {
    res.status(400).send({});
  }
};

// 코멘트 삭제
const deleteComment = async (req, res) => {
  try {
    const connection = await req.app.get('pool').getConnection(async conn => conn)
    await connection.query(
      'DELETE FROM Comments WHERE commentId=?',
      [req.params.commentId]
    );
    connection.release();
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
