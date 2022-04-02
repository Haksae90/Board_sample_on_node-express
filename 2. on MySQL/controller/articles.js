// 게시글 전체 목록 조회
const getAllArticles = async (req, res) => {
  try {
    const connection = await req.app
      .get('pool')
      .getConnection(async (conn) => conn);
    const [articles] = await connection.query(
      `SELECT A.articleId, U.nickname, A.title FROM Articles A 
       JOIN Users U ON U.userId = A.userId
       ORDER BY articleId DESC`
    );
    connection.release();
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
    const connection = await req.app
      .get('pool')
      .getConnection(async (conn) => conn);
    const [articles] = await connection.query(
      `SELECT U.nickname, A.title, A.content, A.articleId FROM Articles A
       JOIN Users U ON U.userId = A.userId 
       WHERE articleId=? LIMIT 1`,
      [req.params.articleId]
    );
    connection.release();
    const article = articles[0];
    res.status(200).render('detail', { article });
  } catch (err) {
    console.error(err);
    res.status(400).json({ errorMessage: '잘못된 요청입니다 ' });
  }
};

// 게시글 작성
const postArticle = async (req, res) => {
  try {
    const connection = await req.app
      .get('pool')
      .getConnection(async (conn) => conn);
    await connection.query(
      'INSERT INTO Articles(userId, title, content, createdAt, updatedAt) VALUES(?,?,?,NOW(),NOW())',
      [res.locals.userId, req.body.title, req.body.content]
    );
    connection.release();
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ errorMessage: '잘못된 요청입니다 ' });
  }
};

// 게시글 수정 페이지 로드
const editPage = async (req, res) => {
  try {
    const connection = await req.app
      .get('pool')
      .getConnection(async (conn) => conn);
    const [articles] = await connection.query(
      'SELECT * FROM Articles WHERE articleId=?',
      [req.params.articleId]
    );
    const article = articles[0];
    connection.release();
    res.status(200).render('edit', { article });
  } catch (err) {
    console.error(err);
    res.status(400).json({ errorMessage: '잘못된 요청입니다 ' });
  }
};

// 게시글 작성자와 로그인한 유저가 동일한지 확인 (수정페이지)
const checkHost = async (req, res) => {
  try {
    const connection = await req.app
      .get('pool')
      .getConnection(async (conn) => conn);
    const [articles] = await connection.query(
      'SELECT * FROM Articles WHERE articleId=?',
      [req.params.articleId]
    );
    connection.release();
    const { userId } = res.locals;
    if (articles[0].userId === userId) {
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
    const connection = await req.app
      .get('pool')
      .getConnection(async (conn) => conn);
    const [existsArticles] = await connection.query(
      'SELECT * FROM Articles WHERE articleId=?',
      [req.params.articleId]
    );
    const existsArticle = existsArticles[0];
    if (!existsArticle) {
      return res.status(400).json({
        success: false,
        errorMessage: '해당 게시글은 삭제된 상태입니다.',
      });
    }
    await connection.query(
      'UPDATE Articles SET title=?, content=? WHERE articleId=?',
      [req.body.title, req.body.content, req.params.articleId]
    );
    connection.release();
    res.status(200).json({ message: '수정되었습니다' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ errorMessage: '잘못된 요청입니다' });
  }
};

// 게시글 삭제
const deleteArticle = async (req, res) => {
  try {
    const connection = await req.app
      .get('pool')
      .getConnection(async (conn) => conn);
    await connection.query('DELETE FROM Articles WHERE articleId=?', [
      req.params.articleId,
    ]);
    connection.release();
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
