const mysql = require('mysql2/promise');
require('dotenv').config()

async function main() {
    let connection = await mysql.createConnection({
        host: process.env.mysql_host,
        user: process.env.mysql_user,
        password: process.env.mysql_password,
    })

    try {
        await connection.query(`CREATE DATABASE ${process.env.mysql_database}`)
    } catch(err) {}

    await connection.query(`USE ${process.env.mysql_database}`)

    await connection.query(`
    CREATE TABLE Users(
        userId INT NOT NULL AUTO_INCREMENT,
        PRIMARY KEY(userId),
        nickname VARCHAR(30) NOT NULL,
        password VARCHAR(30) NOT NULL,
        created_at DATETIME NOT NULL
    )
    `)

    await connection.end()

}

main()