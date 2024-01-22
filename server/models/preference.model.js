const { sequelize: db, } = require('../config/dbConfig');
const { DataTypes } = require('sequelize');

const Preference = db.define('preference',{
    priority: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
            max: 4
        },
        primaryKey: true
    },
    userEmail:{
        type: DataTypes.STRING,
        primaryKey: true
    }
});


module.exports=Preference;