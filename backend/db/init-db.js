const fs = require('fs');
const db = require('./db');

const sql = fs.readFileSync('./init-database.sql', 'utf8');
const queries = sql.split(';').filter(q => q.trim());

console.log('Iniciando criação das tabelas...');

let completed = 0;
const totalQueries = queries.filter(q => q.trim()).length;

queries.forEach((query, index) => {
    if (query.trim()) {
        db.query(query, (err, result) => {
            if (err) {
                console.error(`Erro na query ${index + 1}:`, err.message);
            } else {
                console.log(`Query ${index + 1} executada com sucesso`);
            }
            completed++;
            if (completed === totalQueries) {
                console.log('Banco de dados inicializado com sucesso!');
                process.exit();
            }
        });
    }
});