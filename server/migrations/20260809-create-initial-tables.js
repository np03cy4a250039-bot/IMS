'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: Sequelize.STRING, allowNull: false, unique: true },
      passwordHash: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.STRING, allowNull: false, defaultValue: 'admin' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    await queryInterface.createTable('Suppliers', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      contactEmail: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING },
      address: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    await queryInterface.createTable('Products', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      sku: { type: Sequelize.STRING, unique: true },
      price: { type: Sequelize.DECIMAL(10,2), allowNull: false },
      quantity: { type: Sequelize.INTEGER, defaultValue: 0 },
      imageUrl: { type: Sequelize.STRING },
      supplierId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Suppliers', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Products');
    await queryInterface.dropTable('Suppliers');
    await queryInterface.dropTable('Users');
  }
};
