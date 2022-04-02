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
    CREATE TABLE Articles(
        userId INT NOT NULL, FOREIGN KEY(userId) REFERENCES Users(userId) ON UPDATE CASCADE, 
        articleId INT NOT NULL AUTO_INCREMENT,
        PRIMARY KEY(articleId),
        title VARCHAR(30) NOT NULL,
        content TEXT NOT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
    )
    `);

  await connection.end();
}

main();
