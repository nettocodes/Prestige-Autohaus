const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'junction.proxy.rlwy.net',
    user: 'root',
    password: 'HvSjKlVKMNNoqyfislewexPKdJneNzio',
    database: 'railway',
    port: 43166,
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL Database!');
});

module.exports = db;
