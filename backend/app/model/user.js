const bcrypt = require('bcrypt-nodejs')

module.exports = function(sequelize, Sequelize) {
  const User = sequelize.define('users', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    name: Sequelize.STRING,
    registered: Sequelize.STRING
  })

  User.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
  }

  User.validPassword = function(password, user) {
    return bcrypt.compareSync(password, user.password)
  }

  return User
}
