// 코멘트 작성
const postComment = async (req, res) => {
  try {
    const connection = await req.app
      .get('pool')
      .getConnection(async (conn) => conn);
    await connection.query(
      'INSERT INTO Comments(userId, articleId, comment, createdAt, updatedAt) VALUES(?,?,?,NOW(),NOW())',
      [res.locals.userId, req.body.articleId, req.body.comment]
    );
    connection.release();
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ errorMessage: '잘못된 요청입니다' });
  }
};

// 코멘트 불러오기 (비회원시)
const getCommentsNonAuth = async (req, res) => {
  try {
    const connection = await req.app
      .get('pool')
      .getConnection(async (conn) => conn);
    const existComments = await connection.query(
      `SELECT U.nickname, C.comment FROM Comments C
      JOIN Users U ON U.userId = C.userId
      WHERE articleId=?`,
      [req.params.articleId]
    );
    const comments = existComments[0];
    connection.release();
    res.status(200).json({ comments });
  } catch (err) {
    console.error(err);
    res.status(400).json({ errorMessage: '잘못된 요청입니다' });
  }
};

// 코멘트 불러오기
const getCommentsAuth = async (req, res) => {
  try {
    const connection = await req.app
      .get('pool')
      .getConnection(async (conn) => conn);
    const existComments = await connection.query(
      `SELECT U.nickname, C.comment, C.commentId FROM Comments C
        JOIN Users U ON U.userId = C.userId
        WHERE articleId=?`,
      [req.params.articleId]
    );
    const comments = existComments[0];
    const [userNickname] = await connection.query(
      'SELECT nickname FROM Users WHERE userId=? LIMIT 1',
      [res.locals.userId]
    );
    connection.release();
    res.status(200).json({ comments, userNickname });
  } catch (err) {
    console.error(err);
    res.status(400).json({ errorMessage: '잘못된 요청입니다' });
  }
};

// 코멘트 수정
const editComment = async (req, res) => {
  try {
    const connection = await req.app
      .get('pool')
      .getConnection(async (conn) => conn);
    await connection.query('UPDATE Comments SET comment=? WHERE commentId=?', [
      req.body.comment,
      req.params.commentId,
    ]);
    connection.release();
    res.status(200).json({ message: '수정되었습니다' });
  } catch {
    console.error(err);
    res.status(400).json({ errorMessage: '잘못된 요청입니다' });
  }
};

// 코멘트 삭제
const deleteComment = async (req, res) => {
  try {
    const connection = await req.app
      .get('pool')
      .getConnection(async (conn) => conn);
    await connection.query('DELETE FROM Comments WHERE commentId=?', [
      req.params.commentId,
    ]);
    connection.release();
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
