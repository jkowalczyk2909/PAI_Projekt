module.exports = (sequelize, Sequelize) => {
  const Oceny = sequelize.define("oceny", {
    id: {        
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category_id: {
      type: Sequelize.INTEGER
    },
    subject_id: {
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER
    },
    value: {
      type: Sequelize.STRING
    },
    title: {
      type: Sequelize.STRING
    }
  });

  return Oceny;
};