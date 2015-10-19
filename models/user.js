"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      validate: {
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
      validate: {
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.ENUM('teacher', 'student'),
      unique: false,
      allowNull: true,
      validate: {
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