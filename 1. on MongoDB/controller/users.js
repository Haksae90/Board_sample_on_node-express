const Users = require('../models/users');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

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
      res.status(400).send({
        errorMessage: '패스워드가 확인란과 동일하지 않습니다.',
      });
      return;
    }
    const existUsers = await Users.find({ nickname });
    if (existUsers.length) {
      res.status(400).send({
        errorMessage: '이미 가입된 닉네임입니다.',
      });
      return;
    }
    if (password.includes(nickname)) {
      res.status(400).send({
        errorMessage: '비밀번호에 닉네임이 포함되어 있습니다.',
      });
      return;
    }
    const user = new Users({ nickname, password });
    await user.save();
    res.status(201).send({});
  } catch (err) {
    console.log(err);
    res.status(400).send({
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
    const { nickname, password } = req.body;
    const user = await Users.findOne({ nickname });

    if (!user) {
      res.status(400).send({
        errorMessage: '닉네임 또는 패스워드를 확인해주세요.',
      });
      return;
    }
    user.checkPassword(password, (err, isMatch) => {
      // 입력한 비밀번호와 암호화한 비밀번호가 동일한지 체크
      if (!isMatch)
        return res
          .status(400)
          .json({ ok: false, message: '아이디 혹은 비밀번호를 확인해주세요' });

      const token = jwt.sign({ userId: user.userId }, process.env.TOKENKEY);
      res.json({
        token,
        ok: true,
        message: '로그인 성공',
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
};

// 로그인 인증
const auth = async (req, res) => {
  const { user } = res.locals;
  res.send({
    user: {
      nickname: user.nickname,
    },
  });
};

module.exports = {
  join,
  login,
  auth,
};
