'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salt: {
        type: DataTypes.STRING(32),
        allowNull: false
    },
    roles: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 1,
        allowNull: false
    }
  }, {
    timestamps: true,
    classMethods: {
      associate: function(models) {
        User.hasMany(models.UserArticleReaded, { 
            onDelete: 'cascade', 
            hooks: true,
            foreignKey: 'userId' 
        });
        User.hasMany(models.UserArticleSaved, { 
            onDelete: 'cascade', 
            hooks: true,
            foreignKey: 'userId' 
        });
      }
    }
  });
  return User;
};