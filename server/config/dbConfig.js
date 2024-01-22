const { Sequelize } = require('sequelize');
const db = {}

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_NAME = process.env.DB_NAME || "API_GA"

const sequelize = new Sequelize(DB_NAME, 'root', 'password', {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;