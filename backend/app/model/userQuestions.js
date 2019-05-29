module.exports = function(sequelize, Sequelize) {
  const UserQuestions = sequelize.define('userQuestions', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    question: Sequelize.STRING,
    answer1: Sequelize.STRING,
    answer2: Sequelize.STRING,
    answer3: Sequelize.STRING,
    answer4: Sequelize.STRING,
    correctAnswer: Sequelize.STRING,
    name: Sequelize.STRING,
    user_id: Sequelize.INTEGER, // FK
    submitted: Sequelize.STRING
  })

  return UserQuestions
}
