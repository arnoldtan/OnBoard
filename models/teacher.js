"use strict";

module.exports = function(sequelize, DataTypes) {
  var Teacher = sequelize.define("Teacher", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        setUrl: function () {
            this.setDataValue('url', shortid.generate());
        },
        destroyUrl: function () {
            this.setDataValue('url', null);
        }
    }
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });

  return Teacher;
};