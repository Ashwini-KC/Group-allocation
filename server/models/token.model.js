const { sequelize: db } = require('../config/dbConfig');
const { DataTypes } = require('sequelize');

const Token = db.define('token',{
    token: {
        type: DataTypes.STRING,
        allowNull: true
    }
});


module.exports=Token;