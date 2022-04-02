const jwt = require('jsonwebtoken');
const Joi = require('joi');
const crypto = require('crypto');

// 회원가입 Joi
const joinUsersSchema = Joi.object({
  nickname: Joi.string().alphanum().min(3).required(),
  password: Joi.string().min(4).required(),
  confirmPassword: Joi.string().min(4).required(),
});

// 회원가입
const join = async (req, res) => {
  try {
    const { nickname, password, confirmPassword } =
      await joinUsersSchema.validateAsync(req.body);
    if (password !== confirmPassword) {
      res.status(400).json({
        errorMessage: '패스워드가 확인란과 동일하지 않습니다.',
      });
      return;
    }
    const connection = await req.app
      .get('pool')
      .getConnection(async (conn) => conn);
    const [existUsers] = await connection.query(
      'SELECT * FROM Users WHERE nickname=? LIMIT 1',
      [nickname]
    );
    const existUser = existUsers[0];
    if (existUser) {
      res.status(400).json({
        errorMessage: '이미 가입된 닉네임입니다.',
      });
      return;
    }
    if (password.includes(nickname)) {
      res.status(400).json({
        errorMessage: '비밀번호에 닉네임이 포함되어 있습니다.',
      });
      return;
    }
    const cryptoPass = crypto
      .createHash('sha512')
      .update(password)
      .digest('base64');

    await connection.query(
      'INSERT INTO Users(nickname, password, created_at) VALUES(?,?,NOW())',
      [nickname, cryptoPass]
    );
    connection.release();
    res.status(201).json({ message: '회원가입이 완료되었습니다' });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
};

// 로그인 Joi
const authUsersSchema = Joi.object({
  nickname: Joi.string().required(),
  password: Joi.string().required(),
});

const login = async (req, res) => {
  try {
    const { nickname, password } = await authUsersSchema.validateAsync(
      req.body
    );
    const cryptoPass = crypto
      .createHash('sha512')
      .update(password)
      .digest('base64');

    const connection = await req.app
      .get('pool')
      .getConnection(async (conn) => conn);
    const [users] = await connection.query(
      'SELECT * FROM Users WHERE nickname=? AND password=? LIMIT 1',
      [nickname, cryptoPass]
    );
    const user = users[0];
    connection.release();

    if (!user) {
      res.status(400).json({
        errorMessage: '닉네임 또는 패스워드를 확인해주세요.',
      });
      return;
    }
    const token = jwt.sign({ userId: user.userId }, process.env.TOKENKEY);
    res.json({
      token,
      ok: true,
      message: '로그인 성공',
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
};

// 로그인 인증
const auth = async (req, res) => {
  const { userId } = res.locals;
  res.json({
    user: {
      userId,
    },
  });
};

module.exports = {
  join,
  login,
  auth,
};
