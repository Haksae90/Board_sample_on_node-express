const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const authMiddleware = require("../middlewares/auth-middleware")


// 로그인 페이지 연결
router.get("/auth", (req, res) => { 
    res.render("auth");
});
// .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
const joinUsersSchema = Joi.object({
    nickname: Joi.string().alphanum().min(3).required(),
    password: Joi.string().min(4).required(),
    confirmPassword: Joi.string().min(4).required(),
});

// 회원가입
router.post("/register", async (req, res) => {
    try {
        const { nickname, password, confirmPassword } = await joinUsersSchema.validateAsync(req.body);
        if (password !== confirmPassword) {
            res.status(400).send({
                errorMessage: "패스워드가 확인란과 동일하지 않습니다."
            });
            return;
        }
        const existUsers = await Users.find({ nickname });
        if (existUsers.length) {
            res.status(400).send({
                errorMessage: "이미 가입된 닉네임입니다."
            });
            return;
        }
        if (password.includes(nickname)) {
            res.status(400).send({
                errorMessage: "비밀번호에 닉네임이 포함되어 있습니다."
            });
            return;
        }
        const user = new Users ({ nickname, password });
        await user.save();
        res.status(201).send({});
    } catch(err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "요청한 데이터 형식이 올바르지 않습니다."
        })
    }
});

// 로그인
const authUsersSchema = Joi.object({
    nickname: Joi.string().required(),
    password: Joi.string().required(),
  });

router.post("/auth", async (req, res) => {
    try {
        const { nickname, password } = req.body;
        const user = await Users.findOne({ nickname, password });

        if (!user) {
            res.status(400).send({
                errorMessage: "닉네임 또는 패스워드를 확인해주세요."
            });
            return;
        }
        const token = jwt.sign({ userId: user.userId }, "haksae-key");
        res.send({
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "요청한 데이터 형식이 올바르지 않습니다."
        });
    }
});

// 로그인 인증
router.get("/me", authMiddleware, async (req, res) => {
    const { user } = res.locals;
    res.send({
        user: {
            nickname: user.nickname
        }
    });
});

module.exports = router;