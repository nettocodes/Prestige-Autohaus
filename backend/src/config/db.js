const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    process.env.DB_PORT,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
);

sequelize
    .authenticate()
    .then(() => console.log('Conexão com banco de dados bem-sucedida!'))
    .catch((error) => console.error('Erro ao conectar ao banco de dados:', error));

module.exports = { sequelize };
