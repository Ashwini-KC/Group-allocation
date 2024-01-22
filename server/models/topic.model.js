const { sequelize: db,sequelize } = require('../config/dbConfig');
const { DataTypes } = require('sequelize');
const User = require('./user.model')
const Preference=require('./preference.model')
const { hasMany } =require('sequelize');


const Topic = db.define('topic', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
},
{
    timestamps: false
})

module.exports = Topic