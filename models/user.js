"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        notEmpty: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true
    },
    type: {
      type: DataTypes.ENUM('teacher', 'student'),
      validate: {
        notNull: true,
        notEmpty: true
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        User.belongsToMany(models.Class, { through: 'UserClass' });
      }
    }
  });

  return User;
};