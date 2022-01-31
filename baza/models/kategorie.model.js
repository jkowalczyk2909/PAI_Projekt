module.exports = (sequelize, Sequelize) => {
  const Kategorie = sequelize.define("kategorie", {
    id: {        
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING
    },
    color: {
      type: Sequelize.STRING
    },
    weight: {
      type: Sequelize.INTEGER
    }
  });

  return Kategorie;
};