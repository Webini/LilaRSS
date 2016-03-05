'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Channel', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      link: {
          type: Sequelize.STRING,
          allowNull: true
      },
      xmlurl: { //sometimes undefined, a rentrer a la mano
          type: Sequelize.STRING,
          allowNull: false
      },
      name: {
          type: Sequelize.STRING,
          allowNull: true
      },
      description: {
          type: Sequelize.TEXT,
          allowNull: true
      },
      favicon: {
          type: Sequelize.STRING,
          allowNull: true
      },
      lang: {
          type: Sequelize.STRING,
          allowNull: true
      },
      image: {
          type: Sequelize.STRING,
          allowNull: true
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
    return queryInterface.dropTable('Channel');
  }
};