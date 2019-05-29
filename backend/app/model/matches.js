module.exports = function(sequelize, Sequelize) {
  const Matches = sequelize.define('matches', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    player1_id: Sequelize.INTEGER, // FK
    player2_id: Sequelize.INTEGER, // FK
    winner: Sequelize.INTEGER,
    date: Sequelize.STRING,
    player1_score: Sequelize.INTEGER,
    player2_score: Sequelize.INTEGER
  })

  return Matches
}
