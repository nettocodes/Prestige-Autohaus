const mysql = require('mysql2');

// Configuração do banco de dados
const dbConfig = {
    host: 'shortline.proxy.rlwy.net',
    user: 'root',
    password: 'jZdQHGdQpvSGWFEbYDHhbqIsvHrUEpFs',
    database: 'railway',
    port: 48083,
};

// Criar conexão com o banco
let db;

function handleDisconnect() {
    db = mysql.createConnection(dbConfig);

    db.connect((err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err);
            setTimeout(handleDisconnect, 2000); // Tentar reconectar após 2 segundos
        } else {
            console.log('Conectado ao banco de dados MySQL!');
        }
    });

    db.on('error', (err) => {
        console.error('Erro no banco de dados:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect(); // Reconectar automaticamente em caso de perda de conexão
        } else {
            throw err;
        }
    });
}

handleDisconnect();

module.exports = db;
