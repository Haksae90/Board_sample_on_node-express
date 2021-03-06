const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000;
const { sequelize } = require('./models');

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('DB Connected Success');
  })
  .catch((err) => {
    console.error(err);
  });

const usersRouter = require('./routes/users');
const boardRouter = require('./routes/board');
const commentsRouter = require('./routes/comments');

const requestMiddleware = (req, res, next) => {
  console.log('Request URL:', req.originalUrl, ' - ', new Date());
  next();
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestMiddleware);
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// ejs view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//정적파일 사용
app.use(express.static('./views'));

// 라우터 연결 연결
app.use('/board', boardRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);

// 전체 목록(home) 페이지 연결
app.get('/', (req, res) => {
  res.render('board');
});

// 콘솔창에 이 포트로 서버가 켜졌다고 알려줌
app.listen(port, () => {
  console.log(port, '포트로 서버가 켜졌습니다.');
});
