const pool = require('./db');

async function getLinesByTagOrScene(tag, scene) {
  const connection = await pool.getConnection();
  try {
    let [rows] = await connection.query(
      `SELECT text FROM cocoa_lines 
       WHERE (tags LIKE ? OR scene = ?)
       ORDER BY RAND() LIMIT 1`, 
      [`%${tag}%`, scene]
    );
    return rows.length > 0 ? rows[0].text : "えへへっ……ちょっと考えすぎちゃったかも〜💦";
  } finally {
    connection.release();
  }
}

module.exports = { getLinesByTagOrScene };
