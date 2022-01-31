module.exports = (sequelize, Sequelize) => {
  const Uzytkownicy = sequelize.define("uzytkownicy", {
    id: {        
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    full_name: {
      type: Sequelize.STRING
    },
    login: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    teacher: {
      type: Sequelize.BOOLEAN
    }
  });

  return Uzytkownicy;
};