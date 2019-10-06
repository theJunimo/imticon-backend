const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Emoticon = require('./emoticon')(sequelize, Sequelize);
db.Tag = require('./tag')(sequelize, Sequelize);

db.Emoticon.belongsToMany(db.Tag, { through: 'emtiTag' });
db.Tag.belongsToMany(db.Emoticon, { through: 'emtiTag' });

module.exports = db;
