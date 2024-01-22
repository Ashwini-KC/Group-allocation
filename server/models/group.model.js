const { sequelize: db } = require('../config/dbConfig');
const { DataTypes } = require('sequelize');

const Group = db.define('group',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
});

const GroupUser = db.define('GroupUser', {
    groupId: {
        type: DataTypes.INTEGER,
    },
    studentEmail: {
        type: DataTypes.STRING
    }
})

GroupUser.sync();

module.exports=Group;

module.exports.GroupUser = GroupUser;