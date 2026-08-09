module.exports = {
  development: {
    url: process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/ims_dev',
    dialect: 'postgres'
  },
  test: {
    url: process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/ims_test',
    dialect: 'postgres'
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  }
};
