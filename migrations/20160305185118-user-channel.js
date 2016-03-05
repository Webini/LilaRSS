'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('UserChannel', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      channelId: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: { model: 'Channel', key: 'id' },
          onDelete: 'cascade'
      },
      userId: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: { model: 'User', key: 'id' },
          onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },{
        "charset": "utf8",
        "collate": "utf8_general_ci"
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('UserChannel');
  }
};