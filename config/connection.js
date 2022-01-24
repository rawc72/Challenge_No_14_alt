require("dotenv").config();

const Sequelize = require("sequelize");

// const sequelize = new Sequelize(process.env.DB_URL);

// const sequelize = new Sequelize(process.env.defaultDatabase, process.env.dbuser, process.env.dbuserPassword, {
//     host: process.env.dbUrl,
//     dialect: 'mysql'
// });

const sequelize = process.env.JAWSDB_URL ?
    new Sequelize(process.env.JAWSDB_URL) :
    new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
        host: process.env.DB_URL,
        port: process.env.DB_PORT,
        dialect: "mysql",
    });

sequelize.authenticate().then((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("MySQL database connected...");
    }
});

module.exports = sequelize;