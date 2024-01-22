const { sequelize: db } = require('../config/dbConfig');
const { DataTypes } = require('sequelize');
const Topic = require('./topic.model');
const Preference = require('./preference.model');
const Group = require('./group.model');
const Token = require('./token.model');

const User = db.define('user', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,

    },
    course:{
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
        type: DataTypes.ENUM({
            values:["Admin","Supervisor","Student"]
        }),
        allowNull: false
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  },
  {
      
    timestamps:false,
    defaultScope: {
      attributes: { exclude: ['password'] }
    }
  },
);


User.hasMany(Topic, { onDelete: 'CASCADE'});

Topic.belongsTo(User, { onDelete: 'CASCADE'});

User.hasMany(Preference, {onDelete: 'CASCADE'});

Preference.belongsTo(User, { onDelete: 'CASCADE'});

Topic.hasMany(Preference, {onDelete: 'CASCADE'})

Preference.belongsTo(Topic, { onDelete: 'CASCADE'})

Group.belongsTo(Topic, { foreignKey: 'topicId' });
Group.belongsToMany(User, { through: 'GroupUser', foreignKey: 'groupId', otherKey: 'studentEmail' })

Group.sync({ alter: true})

Preference.sync({})

Topic.sync({})

Topic.sync({})

User.sync({})
User.hasMany(Token, { onDelete: 'CASCADE', onUpdate: 'CASCADE', foreignKey: 'userEmail'});
Token.sync({alter: true})

module.exports = User
