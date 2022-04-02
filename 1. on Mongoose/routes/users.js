const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

const { join, login, auth } = require('../controller/users');

// 로그인 페이지 연결
router.get('/login', (req, res) => {
  res.render('login');
});

// 회원가입 페이지 연결
router.get('/join', (req, res) => {
  res.render('join');
});

// 회원가입
router.post('/join', join);

// 로그인
router.post('/login', login);

// 로그인 확인
router.get('/auth', authMiddleware, auth);

module.exports = router;
