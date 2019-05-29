module.exports = function(sequelize, Sequelize) {
  const Quotes = sequelize.define('quotes', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    quote: Sequelize.STRING,
    author: Sequelize.STRING,
    added: Sequelize.STRING
  })

  Quotes.randomQuote = function(quotes) {
    return quotes[Math.floor(Math.random() * quotes.length)]
  }

  return Quotes
}
