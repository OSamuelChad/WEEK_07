'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Tags', 
      'produtoId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Produtos', 
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Tags',
      'produtoId'
    );
  }
};
