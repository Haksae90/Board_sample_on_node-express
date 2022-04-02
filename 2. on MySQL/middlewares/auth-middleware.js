const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  // authoriztion 참조
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = authorization.split(' ');

  if (tokenType !== 'Bearer') {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요',
    });
    return;
  }
  try {
    const { userId } = jwt.verify(tokenValue, process.env.TOKENKEY);
    const connection = await req.app
      .get('pool')
      .getConnection(async (conn) => conn);
    const [users] = await connection.query(
      'SELECT * FROM Users WHERE userId=? LIMIT 1',
      [userId]
    );
    const user = users[0];
    connection.release();
    res.locals.userId = user.userId;
    next();
  } catch (error) {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요',
    });
    return;
  }
};
