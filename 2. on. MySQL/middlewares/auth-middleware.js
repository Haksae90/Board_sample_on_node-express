const jwt = require('jsonwebtoken');
const Users = require('../models/users');

module.exports = (req, res, next) => {
  // authoriztion 참조
  const { authorization } = req.headers; // 프론트에서 대문자로 보내도 여기서는 소문자로 변환됨
  const [tokenType, tokenValue] = authorization.split(' '); // 공백을 기준으로 배열을 반환

  if (tokenType !== 'Bearer') {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요',
    });
    return;
  }
  try {
    const { userId } = jwt.verify(tokenValue, process.env.TOKENKEY); // 디코드에서 userID 값만 암호화했으니
    Users.findById(userId)
      .exec()
      .then((user) => {
        // async가 아니기 때문에 then으로
        res.locals.user = user; // locals는 나중에 소멸
        next(); // 이 경우 에만 next를 허용 / next 안하면 미들웨어에서 에러처리에 걸림
      });
    // 원래는 유저가 없는 것도 가정해야함
  } catch (error) {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요',
    });
    return;
  }
};
