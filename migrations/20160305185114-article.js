'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Article', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      title: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      description: {
          type: Sequelize.TEXT,
          allowNull: true,
      },
      summary: {
          type: Sequelize.TEXT,
          allowNull: true,
      },
      link: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      pubDate: {
          type: Sequelize.DATETIME,
          allowNull: true,
      },
      date: {
          type: Sequelize.DATETIME,
          allowNull: true,
      },
      author: {
          type: Sequelize.STRING,
          allowNull: true,
      },
      image: {
          type: Sequelize.STRING,
          allowNull: true,
      },
      uniqId: {
          type: Sequelize.STRING,
          allowNull: true,
          unique: true
      },
      channelId: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: { model: 'Channel', key: 'id' },
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
    return queryInterface.dropTable('Article');
  }
};