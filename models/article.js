'use strict';
module.exports = function(sequelize, DataTypes) {
  var Article = sequelize.define('Article', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    summary: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pubDate: {
        type: DataTypes.DATETIME,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATETIME,
        allowNull: true,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    uniqId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    channelId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    }
  }, {
    timestamps: true,
    classMethods: {
      associate: function(models) {
          Article.belongsTo(models.Channel, {
              onDelete: "CASCADE"
          });
          Article.hasMany(models.UserArticleReaded, { 
              onDelete: 'CASCADE', 
              hooks: true,
              foreignKey: 'articleId' 
          });
          Article.hasMany(models.UserArticleSaved, { 
              onDelete: 'CASCADE', 
              hooks: true,
              foreignKey: 'articleId' 
          });
      }
    }
  });
  return Article;
};