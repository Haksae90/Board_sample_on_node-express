# 초보자를 위한 게시판 만들기 샘플 on node&express

Node.js & Express을 사용하여 게시판을 만들었습니다.<br>
초보자 분들을 위해, DB는 Mongoose(MongoDB), SQL, Sequelize를 사용한 게시판 샘플을 만들어봤습니다..<br>
약간의 도움이나마 되었으면 좋겠습니다. (향후 야금야금 여러 기술들을 추가해볼 생각입니다)

🔨 Tech Stack
- Node.js
- Express
- MongoDB & Mongoose
- SQL
- Sequelize
- cors
- dotenv
- joi
- jsonwebtoken
- prettier


## ⚙️ AWS RDS 사용하고 싶으신 분 참고
- 혹시 RDS를 사용하고 싶으신 분이 계시다면, 아래의 링크를 참고하여 도전해보세요-! 순서대로 최대한 자세하게 적어놨습니다 ☺️
- RDS란 무엇인가 (https://haksae.tistory.com/208)
- RDS 셋팅 및 EC2와 연동하기 (https://haksae.tistory.com/207)
- Workbench로 RDS 연결하기 (https://haksae.tistory.com/209)


## 📋 Installation
### 프로젝트 실행을 위해 하단의 상세 설명을 참고해 주세요.

1. 프로젝트 클론

```console
$ git clone https://github.com/Haksae90/Board_sample_on_node-express.git
```

2. 패키지 설치 (1-3번 중에 원하는 환경을 선택하세요)

```console
$ cd Board_sample_on_node-express
$ cd 1.\ on\ Mongoose
$ npm install
```


3. 환경변수 설정

1) .env 설정

```text
// 1-3번 폴더 안에 .env 파일 생성 후 아래의 내용을 기입 후 저장해주세요.

1. on Mongoose
PORT='원하는 포트 설정'
TOKENKEY='원하는 JWT 토큰 값 설정'
MONGO_URL='원하는 몽고 DB URL 설정' ex) 'mongodb://localhost:27017/board_project'

2. on MySQL
PORT='원하는 포트 설정'
TOKENKEY='원하는 JWT 토큰 값 설정'
mysql_host='프로젝트 환경의 HOST 주소'
mysql_user='프로젝트 환경의 MySQL ID'
mysql_password='프로젝트 환경의 MySQL 패스워드'
mysql_database='연결할 DB명'

3. on Sequelize
PORT='원하는 포트 설정'
TOKENKEY='원하는 JWT 토큰 값 설정'

```

2) Sequelize config 설정

```text
// sequelize는 추가로 config 설정을 해주셔야합니다.

sequelize cli 설치
$npm i sequelize sequelize-cli sqlite3

sequelize CLI를 사용하여 config, 테이블 생성 및 마이그레이션, 테이터 추가
$npx sequelize init

// config 파일을 생성됐다면 config를 설정해주세요. 메인 디렉토리에서 config 폴더 안에, config.json 파일을 아래와 같이 셋팅해주시면 됩니다
{
  "development": {
    "username": "프로젝트 환경의 MySQL ID",
    "password": "프로젝트 환경의 Password",
    "database": "연결할 DB명",
    "host": "프로젝트 환경의 HOST 주소",
    "dialect": "mysql"
  },

// 서버를 돌리기 전에 sequelize로 DB 생성하는 것도 잊지마셔요
데이터베이스 생성
$npx sequelize db:migrate

```


## 📋 서비스 관련

1. 회원 가입 페이지
    - 회원가입 버튼을 클릭하기
    - 닉네임, 비밀번호, 비밀번호 확인을 입력하기
    - 닉네임은 `최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)`로 구성하기
    - 비밀번호는 `최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패`로 만들기
    - 비밀번호 확인은 비밀번호와 정확하게 일치하기
    - 데이터베이스에 존재하는 닉네임을 입력한 채 회원가입 버튼을 누른 경우 "중복된 닉네임입니다." 라는 에러메세지를 프론트엔드에서 보여주기
    - 회원가입 버튼을 누르고 에러메세지가 발생하지 않는다면 `로그인 페이지`로 이동시키기
2. 로그인 페이지
    - 로그인, 회원가입 버튼을 만들기
    - 닉네임, 비밀번호 입력란 만들기
    - 로그인 버튼을 누른 경우 닉네임과 비밀번호가 데이터베이스에 등록됐는지 확인한 뒤, 하나라도 맞지 않는 정보가 있다면 "닉네임 또는 패스워드를 확인해주세요"라는 메세지를 프론트엔드에서 보여주기
    - 로그인 버튼을 눌러서 에러 메세지가 발생하지 않는다면 `전체 게시글 목록 조회 페이지`로 이동시키기
3. 로그인 검사
    - `아래 페이지를 제외하고` 모두 로그인 한 경우만 볼 수 있도록 하기
        - 회원가입 페이지
        - 로그인 페이지
        - 게시글 목록 조회 페이지
        - 게시글 조회 페이지
    - 로그인을 하지 않거나 올바르지 않은 경로로 접속한 사용자가 로그인이 필요한 경로에 접속한 경우 "로그인이 필요합니다." 라는 메세지를 프론트엔드에서 띄워주고 `로그인 페이지`로 이동시키기
    - 로그인 한 사용자가 로그인 페이지 또는 회원가입 페이지에 접속한 경우 "이미 로그인이 되어있습니다."라는 메세지를 띄우고 `전체 게시글 목록 조회 페이지`로 이동시키기
4. 게시글 조회 페이지 > 댓글 목록 조회
    - 로그인 하지 않은 사용자도 댓글 목록 조회가 가능하도록 하기
    - 현재 조회중인 게시글에 작성된 모든 댓글을 목록 형식으로 볼 수 있도록 하기
    - 댓글 목록 위에 댓글 작성란 만들기
        - 댓글 작성에 관한 기능은 5번 요구사항으로 연결하기
    - 댓글 목록 중, 내가 작성한 댓글인 경우 댓글 수정, 댓글 삭제 버튼 만들기
        - 댓글 수정 버튼을 누르면 6번 요구사항으로 연결하기
        - 댓글 삭제 버튼을 누르면 7번 요구사항으로 연결하기
    - 제일 최근 작성된 댓글을 맨 위에 띄우기
5. 게시글 조회 페이지 > 댓글 작성
    - 로그인 한 사용자만 댓글 작성이 가능하도록 하기
    - 게시글 조회 페이지 하단에 댓글 내용을 입력할 수 있는 댓글 작성 버튼 만들기
    - 로그인 하지 않은 사용자가 댓글 작성란을 누르면 "로그인이 필요한 기능입니다." 라는 메세지를 띄우고 `로그인 페이지`로 이동시키기
    - 댓글 내용란을 비워둔 채 댓글 작성 버튼을 누르면 "댓글 내용을 입력해주세요" 라는 메세지를 띄우기
    - 댓글 내용을 입력하고 댓글 작성 버튼을 누른 경우 작성한 댓글을 추가하기
6. 게시글 조회 페이지 > 댓글 수정
    - 내가 작성한 댓글만 수정 가능하도록 하기
    - 댓글 본문이 사라지고, 댓글 내용, 저장 버튼 생성하기
    - 댓글 내용에는 이전에 입력했던 댓글 내용을 기본 값으로 채우기
    - 수정할 댓글 내용은 비어 있지 않도록 하기
    - 저장 버튼을 누른 경우 기존 댓글의 내용을 새로 입력한 댓글 내용으로 바꾸기
7. 게시글 조회 페이지 > 댓글 삭제
    - 내가 작성한 댓글만 삭제 가능하도록 하기
    - "정말로 삭제하시겠습니까?" 메세지를 띄우고, 확인/취소 버튼 중 "확인" 버튼을 누른 경우 목록에서 해당 댓글을 삭제하기
    - 취소를 누른 경우 삭제되지 않고 그대로 유지하기
