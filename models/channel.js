'use strict';
module.exports = function(sequelize, DataTypes) {
  var Channel = sequelize.define('Channel', {
    link: {
        type: DataTypes.STRING,
        allowNull: true
    },
    xmlurl: { //sometimes undefined, a rentrer a la mano
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    favicon: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lang: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    subscribers: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
        allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: true,
    classMethods: {
        associate: function(models) {
            Channel.hasMany(models.Article, { 
                onDelete: 'cascade', 
                hooks: true,
                foreignKey: 'channelId' 
            });
            Channel.hasMany(models.UserChannel, { 
                onDelete: 'cascade', 
                hooks: true,
                foreignKey: 'channelId' 
            });
        }
    }
  });
  return Channel;
};