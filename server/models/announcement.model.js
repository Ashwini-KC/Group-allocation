const { sequelize: db } = require('../config/dbConfig');
const { DataTypes } = require('sequelize');
const { hasMany } =require('sequelize');

const Announcement = db.define('announcement',{
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,      
    },
    details: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Announcement