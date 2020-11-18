const Sequelize = require('sequelize');

const connection = new Sequelize('guiapress','root','root',{
    host: 'localhost',
    dialect: 'mariadb'
});

module.exports = connection;