// Simple seed script to create admin user from env vars (development convenience)
const bcrypt = require('bcrypt');
require('dotenv').config();
const { sequelize, User } = require('./models');

async function run() {
  try {
    await sequelize.sync();
    const username = process.env.ADMIN_USER || 'admin';
    const password = process.env.ADMIN_PASS || 'password';
    const hash = await bcrypt.hash(password, 10);
    const [user, created] = await User.findOrCreate({ where: { username }, defaults: { passwordHash: hash, role: 'admin' } });
    if (created) console.log('Admin user created:', username);
    else console.log('Admin user already exists');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

if (require.main === module) run();
module.exports = run;
