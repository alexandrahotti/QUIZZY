const Sequelize = require('sequelize')
const UserModel = require('../app/model/user')
const StatsModel = require('../app/model/stats')
const MatchesModel = require('../app/model/matches')
const QuotesModel = require('../app/model/quotes')
const UserQuestionsModel = require('../app/model/userQuestions')

const sequelize = new Sequelize('quizzy', 'root', 'william95', {
  // 'database', 'username', 'password',
  host: '127.0.0.1',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    multipleStatements: true
  },
  define: {
    timestamps: false // true by default
  }
})

// const sequelize = new Sequelize("hotti", "hottiadmin", "Oovie9oi7o", { //'database', 'username', 'password',
//   host: '2001:6b0:1:1300:250:56ff:fe01:25a',
//   dialect: 'mysql',
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   },
//   dialectOptions: {
//     multipleStatements: true
//   },
//   define: {
//     timestamps: false // true by default
//   }
// });

// const sequelize = new Sequelize("hottilocal", "root", "badgerz", { //'database', 'username', 'password',
//   host: '127.0.0.1',
//   dialect: 'mysql',
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   },
//   dialectOptions: {
//     multipleStatements: true
//   },
//   define: {
//     timestamps: false // true by default
//   }
// });

const User = UserModel(sequelize, Sequelize)
const Stats = StatsModel(sequelize, Sequelize)
const Matches = MatchesModel(sequelize, Sequelize)
const Quotes = QuotesModel(sequelize, Sequelize)
const UserQuestions = UserQuestionsModel(sequelize, Sequelize)

User.hasMany(UserQuestions, { foreignKey: 'user_id' })
UserQuestions.belongsTo(User, { foreignKey: 'user_id' })

User.hasMany(Stats, { foreignKey: 'user_id' })
Stats.belongsTo(User, { foreignKey: 'user_id' })

User.hasMany(Matches, { as: 'id1', foreignKey: 'player1_id' })
User.hasMany(Matches, { as: 'id2', foreignKey: 'player2_id' })
Matches.belongsTo(User, { as: 'id1', foreignKey: 'player1_id' })
Matches.belongsTo(User, { as: 'id2', foreignKey: 'player2_id' })

// USe to authenticate that connection to db is working
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

module.exports = {
  User,
  Stats,
  Matches,
  Quotes,
  UserQuestions
}
