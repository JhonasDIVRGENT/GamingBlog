// Data Access Layer for Blog
const sql = require('mssql');
const config = require('../config/dbConfig');

async function getAllPosts() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Posts');
        return result.recordset;
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

module.exports = { getAllPosts };
