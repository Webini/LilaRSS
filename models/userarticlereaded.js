'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserArticleReaded = sequelize.define('UserArticleReaded', {
    articleId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
  }, {
    timestamps: true,
    classMethods: {
      associate: function(models) {
          UserArticleReaded.belongsTo(models.User);
          UserArticleReaded.belongsTo(models.Article);
      }
    }
  });
  return UserArticleReaded;
};