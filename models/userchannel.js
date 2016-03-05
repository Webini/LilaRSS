'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserChannel = sequelize.define('UserChannel', {
    channelId: {
        type: DataTypes.INTEGER.UNSIGNED,
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
          UserChannel.belongsTo(models.User);
          UserChannel.belongsTo(models.Channel);
      }
    }
  });
  return UserChannel;
};