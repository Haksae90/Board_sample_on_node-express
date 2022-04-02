const jwt = require('jsonwebtoken');
const { Users } = require('../models');

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
    const user = await Users.findOne({ where: { userId } });
    res.locals.userId = user.userId;
    next();
  } catch (error) {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요',
    });
    return;
  }
};
