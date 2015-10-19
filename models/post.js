"use strict";

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    content: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: true,
        validate: {
          notEmpty: true
        }
    }
  }, {
    classMethods: {
      associate: function(models) {
        Post.belongsToMany(models.User, { through: 'UserPost' });
        Post.belongsToMany(models.Class, { through: 'ClassPost' });
      }
    }
  });

  return Post;
};