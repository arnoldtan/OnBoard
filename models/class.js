"use strict";

module.exports = function(sequelize, DataTypes) {
  var Class = sequelize.define("Class", {
    classCode: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
        validate: {
          notEmpty: true
        }
    }
  }, {
    classMethods: {
      associate: function(models) {
        Class.belongsToMany(models.User, { through: 'UserClass' });
        Class.belongsToMany(models.Lesson, { through: 'LessonClass' });
        Class.belongsToMany(models.Post, { through: 'ClassPost' });
      }
    }
  });

  return Class;
};