const { getCurrentYearMonth } = require('../helpers.js')

module.exports = function(sequelize, Sequelize) {
  const Stats = sequelize.define('stats', {
    user_id: Sequelize.INTEGER, // Foreign Key
    games_played: Sequelize.INTEGER,
    wins: Sequelize.INTEGER,
    losses: Sequelize.INTEGER,
    year_and_month: Sequelize.STRING
  })

  Stats.removeAttribute('id')

  Stats.filterByLastMonth = function(stats) {
    const yearMonth = getCurrentYearMonth()

    return stats.filter(stat => stat.year_and_month === yearMonth)
  }

  return Stats
}
