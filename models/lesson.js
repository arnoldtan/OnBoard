"use strict";

module.exports = function(sequelize, DataTypes) {
  var Lesson = sequelize.define("Lesson", {
    lessonUrl: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    imagePath: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notNull: false,
        notEmpty: false
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        Lesson.belongsToMany(models.Class, { through: 'LessonClass' });
      }
    }
  });

  return Lesson;
};