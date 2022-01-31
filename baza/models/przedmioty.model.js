module.exports = (sequelize, Sequelize) => {
  const Przedmioty = sequelize.define("przedmioty", {
    id: {        
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING
    }
  });

  return Przedmioty;
};