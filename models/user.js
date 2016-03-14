'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    username: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
            len: [ 0, 64 ]
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passwordText: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
        validate: {
            len: [ 7, 64 ]
        }
    },
    salt: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    roles: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 1,
        allowNull: false 
    }
  }, 
  {
    freezeTableName: true,
    timestamps: true,
    getterMethods: {
        public: function(){
            return {
                id: this.id,
                username: this.username,
                email: this.email,
                roles: this.roles,
            };
        }
    },
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