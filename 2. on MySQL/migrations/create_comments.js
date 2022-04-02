const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  let connection = await mysql.createConnection({
    host: process.env.mysql_host,
    user: process.env.mysql_user,
    password: process.env.mysql_password,
  });

  await connection.query(`USE ${process.env.mysql_database}`);

  await connection.query(`
    CREATE TABLE Comments(
        userId INT NOT NULL,
        FOREIGN KEY(userId) REFERENCES Users(userId) ON UPDATE CASCADE, 
        articleId INT NOT NULL,
        FOREIGN KEY(articleId) REFERENCES Articles(articleId) ON UPDATE CASCADE,
        commentId INT NOT NULL AUTO_INCREMENT,
        PRIMARY KEY(commentId),
        comment TEXT NOT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
    )
    `);

  await connection.end();
}

main();
