const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  storage: dbConfig.storage,
  dialect: dbConfig.dialect,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.kategorie = require("./kategorie.model.js")(sequelize, Sequelize);
db.oceny = require("./oceny.model.js")(sequelize, Sequelize);
db.przedmioty = require("./przedmioty.model.js")(sequelize, Sequelize);
db.uzytkownicy = require("./uzytkownicy.model.js")(sequelize, Sequelize);

module.exports = db;