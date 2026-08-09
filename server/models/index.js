const { Sequelize, DataTypes } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];
const sequelize = new Sequelize(config.url, { dialect: 'postgres' });

const User = require('./User')(sequelize, DataTypes);
const Supplier = require('./Supplier')(sequelize, DataTypes);
const Product = require('./Product')(sequelize, DataTypes);

Supplier.hasMany(Product, { foreignKey: 'supplierId', onDelete: 'RESTRICT' });
Product.belongsTo(Supplier, { foreignKey: 'supplierId' });

module.exports = { sequelize, Sequelize, User, Supplier, Product };
