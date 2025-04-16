const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',      // Dockerなら 'localhost' or 'db'
  user: 'charauser',
  password: 'charapass',
  database: 'chara_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;