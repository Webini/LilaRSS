'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserArticleSaved = sequelize.define('UserArticleSaved', {
    articleId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: true,
    classMethods: {
      associate: function(models) {
          UserArticleSaved.belongsTo(models.User);
          UserArticleSaved.belongsTo(models.Article);
      }
    }
  });
  return UserArticleSaved;
};