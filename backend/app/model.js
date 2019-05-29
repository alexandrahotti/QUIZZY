/* jslint node: true */

const { createGameObject } = require('./model/games.js')
const { getCurrentYearMonthDayTime, getCurrentYearMonth } = require('./helpers.js')

const noPlayers = 2
var games = new Map() // eslint-disable-line

const { Stats, User, Matches, Quotes, UserQuestions } = require('../config/database')

exports.getUsers = function() {
  return User.findAll().then(allUsers => allUsers)
}

exports.getRandomQuote = function() {
  return Quotes.findAll().then(quotes => Quotes.randomQuote(quotes))
}

exports.submitUserQuestion = function(body, user) {
  const now = getCurrentYearMonthDayTime()
  return UserQuestions.build({
    question: body.question,
    answer1: body.answer1,
    answer2: body.answer2,
    answer3: body.answer3,
    answer4: body.answer4,
    correctAnswer: body.answer1,
    name: user.name,
    user_id: user.id,
    submitted: now
  })
    .save()
    .then(newUserQuestion => {
      console.log(newUserQuestion)
      return newUserQuestion
    })
    .catch(error => {
      console.log('Error occured.')
      return error
    })
}

exports.getUser = function(id) {
  return User.findAll({
    where: {
      id
    }
  }).then(allUsers => allUsers)
}

const getUserByName = function(userName) {
  // retrives a User form the usertable based on a userName
  return User.findAll({
    where: {
      username: userName
    }
  })
    .then(user => user)
    .catch(err => {
      console.log(err)
      console.log('Error in get user by name')
    })
}

exports.getLastMonthStats = function() {
  return Stats.findAll({
    include: [User]
  }).then(stats => Stats.filterByLastMonth(stats))
}

exports.getPersonalStats = function(id) {
  return Stats.findAll({
    where: {
      user_id: id
    },
    include: [User]
  }).then(stats => stats)
}

exports.getMatchHistory = function(id) {
  const matches = []
  return Matches.findAll({
    where: {
      player1_id: id
    },
    include: [
      {
        model: User,
        as: 'id1'
      },
      {
        model: User,
        as: 'id2'
      }
    ]
  }).then(match1 => {
    matches.push(match1)
    return Matches.findAll({
      where: {
        player2_id: id
      },
      include: [
        {
          model: User,
          as: 'id1'
        },
        {
          model: User,
          as: 'id2'
        }
      ]
    }).then(match2 => {
      matches.push(match2)
      console.log(matches)
      return matches
    })
  })
}

const insertMatch = function(userIDs, gameID, winnerId) {
  console.log('#### Build or create in matches');
  // inserts the results from a game ( gameID ) into the Matches table
  const currentGame = getGameByID(gameID)
  const player1 = 0
  const player2 = 1
  const dateTime = getCurrentYearMonthDayTime()

  console.log(userIDs)
  console.log(currentGame)
  console.log(dateTime)

  return Matches.build({
    player1_id: userIDs[player1],
    player2_id: userIDs[player2],
    winner: winnerId,
    player1_score: currentGame.scores[player1],
    player2_score: currentGame.scores[player2],
    date: dateTime
  })
    .save()
    .then(newMatch => newMatch)
    .catch(err => {
      console.log(err)
      console.log('Error occured in Match build')
    })
}

exports.insertMatchHistoryHandler = function(gameID, userId) {
  // after a game is done thes function updates the matches table based on a gameid

  const currentGame = getGameByID(gameID)
  console.log('CURRENT GAME')

  console.log(currentGame)

  const userIDs = []
  const usernamePlayer1 = currentGame.players[0]
  const usernamePlayer2 = currentGame.players[1]

  // First we get the first player form the user table based on the players username
  // we want to store these ids in userIDs
  return getUserByName(usernamePlayer1)
    .then(user => {
      userIDs.push(user[0].id)
      return getUserByName(usernamePlayer2)
        .then(user2 => {
          userIDs.push(user2[0].id)
          console.log('USER IDS')

          console.log(userIDs)

          // Long explanation: next we also want to know who was the winner
          // the default value for the winner in games.js is '' ( i kow u think it should be null)
          // so if there was a tie the value will still be ''
          // therefore we only get the winners ID by caliing getUserByName() if we have a winner
          if (currentGame.winner !== '') {
            // Short explanation: If there is a winner, i.e the game was not a tie
            return getUserByName(currentGame.winner)
              .then(winnerUser => {
                if(userId === userIDs[0]) {   // This makes the insert only happen once per game, only one user can match
                  return insertMatch(userIDs, gameID, winnerUser[0].id).then(res => res)
                }
                return "SUCCESS"

              })
              .catch(err => {
                console.log(err)
                console.log('Error occured in get user by winner in insertMatchHistoryHandler.')
              })
          }
          // The game was a tie. Therefore we provide a dummy value for the winnerId entry: '
          if(userId === userIDs[0]) {
            return insertMatch(userIDs, gameID, '').then(res => res)
          }
          return "SUCCESS"
        })
        .catch(err => {
          console.log(err)
          console.log('Error occured in get user by name 2 in insertMatchHistoryHandler..')
        })
    })
    .catch(err => {
      console.log(err)
      console.log('Error occured in get user by name 1 in insertMatchHistoryHandler..')
    })
}

const getIncrementForWinStats = function(gameID, userName) {
  // if the provided username is the name of the winner in the game with the given gameID
  // then the returned increment is equal to 1. Otherwise 0 is returned
  const currentGame = getGameByID(gameID)

  const gameWinner = currentGame.winner

  if (gameWinner === userName) {
    return 1
  }
  return 0
}

const getIncrementForLossesStats = function(gameID, userName) {
  // if the provided username is the name of the loser in the game with the given gameID
  // then the returned increment is equal to 1. Otherwise 0 is returned

  const currentGame = getGameByID(gameID)

  if (currentGame.loser === userName) {
    return 1
  }
  return 0
}

const updateUserStats = function(gameID, username, userId) {

  console.log('########Update stats for userId: ' + userId) // eslint-disable-line
  return Stats.findOne({ where: { user_id: userId, year_and_month: getCurrentYearMonth() } })
    .then(stat => {
      console.log(stat)
      stat.games_played += 1    // eslint-disable-line
      stat.wins += getIncrementForWinStats(gameID, username) // eslint-disable-line
      stat.losses += getIncrementForLossesStats(gameID, username) // eslint-disable-line
      return stat
        .save({ fields: ['games_played', 'wins', 'losses'] })
        .then(() => {
          return stat
        })
        .catch(err => {
          console.log(err)
          console.log('Error saving stats update')
        })
    })
    .catch(err => {
      console.log(err)
      console.log('Error finding stat row to update')
    })
}

const createPlayerStats = function(gameID, userName) {
  // Here we create an entirely new entry into the stats Table

  // first we get the user from the user table so tah we can get its user id
  return getUserByName(userName).then(user => {
    console.log('####### building stats for USER: ' + user[0].id)  // eslint-disable-line
    console.log(getIncrementForWinStats(gameID, userName))
    console.log(getIncrementForLossesStats(gameID, userName))
    console.log(getCurrentYearMonth())

    Stats.build({
      user_id: user[0].id,
      games_played: 1,
      wins: getIncrementForWinStats(gameID, userName),
      losses: getIncrementForLossesStats(gameID, userName),
      year_and_month: getCurrentYearMonth()
    })
      .save()
      .then(newUser => newUser)
      .catch(err => {
        console.log(err)
        console.log('Error occured in stats build')
      })
      .catch(err => {
        console.log(err)
        console.log('Error occured in createPlayerStats.')
      })
  })
}

const doesExistInStats = function(userId) {
  return Stats.findOne({ where: { user_id: userId, year_and_month: getCurrentYearMonth() } })
    .then(user => {
      if (user === null) {
        // No user in stats table for this month
        return false
      }
      return true
    })
    .catch(err => {
      console.log(err)
      console.log('Error occured in doesExistsInStats.')
    })
}

exports.createOrUpdatePlayerStats = function(gameID, username, userId) {
  // either creates a row in Stats or updates an exisiting row in stats after a game
  // is finished based on a username

  return doesExistInStats(userId).then(bool => {
    if (bool === true) {
      console.log('Player exists in stats.')
      return updateUserStats(gameID, username, userId)
        .then(stat => {
          console.log(stat)
          console.log('Success updating userStat')
          return 'SUCCESS'
        })
        .catch(err => console.log(err))
    }
    // Else. The user dose not exist in stats for the current month, therefore we create a new entry into the stats table
    return createPlayerStats(gameID, username)
      .then(data => {
        console.log(data)
        console.log('Success creating new player stats row in createOrUpdatePlayerStats')
        return 'SUCCESS'
      })
      .catch(err => {
        console.log(err)
        console.log('Error creating new player stats row in createOrUpdatePlayerStats')
      })
  })
}

const createGameKey = function() {
  // The gamedict uses keys incremented from 0.
  // therefore the size of the dict will be equal to its next gamekey
  return games.size
}

exports.getGameByID = function(gameID) {
  return games.get(gameID)
}

const getGameByID = function(gameID) {
  return games.get(gameID)
}

const getPlayerIndexByUsername = function(gameID, userName) {

  const currentGame = getGameByID(gameID)

  const { players } = currentGame
  let playerindex = null

  for (let i = 0; i < players.length; i++) { // eslint-disable-line
    if (players[i] === userName) {
      playerindex = i
    }
  }
  return playerindex
}

const totalNumberOfQuestions = function(gameID) {
  // Counts the total number of questions to be answered total nmber of times during a game.
  // i.e. number of unique questions * 2.
  // We want to use this number to check if a game is over
  const currentGame = getGameByID(gameID)
  let totalNoQuestions = 0

  for (let p = 0; p < noPlayers; p++) { // eslint-disable-line
    totalNoQuestions += currentGame.questions.length
  }
  return totalNoQuestions
}

const noQuestionsProgressed = function(gameID) {
  // checks how many questions have passed so far in the game
  // i.e. how many have been answered/skipped for both of the players

  let noQuestions = 0
  const currentGame = getGameByID(gameID)

  for (var p = 0; p < noPlayers; p++) { // eslint-disable-line
    for (var a = 0; a < currentGame.answers[p].length; a++) { // eslint-disable-line
      // the default value in the games.js file is null.
      // therefore is the game still contains a registered null avlue
      // as a answer the we know that the game is not over yet
      if (currentGame.answers[p] !== null) {
        noQuestions += 1
      }
    }
  }
  return noQuestions
}

exports.allQuestionsAnswered = function(gameID) {
  // Checks if all questions have been answered at this point in teh game

  // all quetions are answered if the numbe rof answered questions are equal to the total numbe rof questions
  if (noQuestionsProgressed(gameID) === totalNumberOfQuestions(gameID)) {
    return { allAnswered: true }
  }
  return { allAnswered: false }

}

exports.registerAnswer = function(gameID, userName, ans, questionNo) {
  //  store the players answer into the games object

  const playerIndex = getPlayerIndexByUsername(gameID, userName)
  games.get(gameID).answers[playerIndex][questionNo - 1] = ans
  console.log('THE REGISTERED ANSWERS for this player is:');
  console.log(games.get(gameID).answers[playerIndex][questionNo - 1]);
}

const computeResultArray = function(game) {
  // the reuslt array is used for GRAPHICAL PURPOSES in the results screen.
  // R = right, W = Wrong. These components are used under the users to grahically
  // display how many wong/correct guesses they have made
  const results = [[], []]

  for (var q = 0; q < game.answers[0].length; q++) { // eslint-disable-line
    for (var p = 0; p < game.players.length; p++) { // eslint-disable-line
      if (game.questions[q].correct_answer === game.answers[p][q]) {
        // if the player p:s answer for a certain question q was correct we
        // insert the letter R into the players reuslt array. Which represents
        // that the player got the question right. W = wrong
        results[p].push('R')
      } else {
        results[p].push('W')
      }
    }
  }
  return results
}

const computeScoresForBothPlayers = function(game) {
  // computes a numerical score for both players based
  // on how many correct guesses they made during one game
  // this number is then used in the match history table
  const numberOfcorrectAnswersForEachPlayer = [0, 0]

  for (var q = 0; q < game.answers[0].length; q++) { // eslint-disable-line
    for (var p = 0; p < game.players.length; p++) { // eslint-disable-line
      if (game.questions[q].correct_answer === game.answers[p][q]) {
        // if the player p:s answer for a certain question q was correct we increment
        // the players score
        numberOfcorrectAnswersForEachPlayer[p]++ // eslint-disable-line
      }
    }
  }
  return numberOfcorrectAnswersForEachPlayer
}

const aggregateResults = function(game, gameID) {
  // Aggregates (sammanstaller) resultaten fran ett spel
  let msg = null
  const player1 = 0
  const player2 = 1

  // the reuslt array is used as a graphical component in the reusltsscreen. for more info see computeResultArray
  const results = computeResultArray(game)

  // we compute how many correct answers each player got into an array: numberOfcorrectAnswers
  const numberOfcorrectAnswers = computeScoresForBothPlayers(game)
  games.get(gameID).scores = numberOfcorrectAnswers

  // based on the number of correct answers each player got we want to provide the game players with different results

  if (numberOfcorrectAnswers[player1] > numberOfcorrectAnswers[player2]) {
    // player1 was the winner
    msg = `The winner is: ${game.players[player1]}`
    games.get(gameID).winner = game.players[player1]
    games.get(gameID).loser = game.players[player2]
    games.get(gameID).tie = false
  } else if (numberOfcorrectAnswers[player1] < numberOfcorrectAnswers[player2]) {
    // player2 was the winner
    msg = `The winner is: ${game.players[player2]}`
    games.get(gameID).winner = game.players[player2]
    games.get(gameID).loser = game.players[player1]
    games.get(gameID).tie = false
  } else {
    // It was a tie
    msg = 'It was a tie'
    games.get(gameID).tie = true
  }

  return { winner: games.get(gameID).winner, loser: games.get(gameID).winner, results, message: msg }
}

exports.getGameResults = function(gameID) {
  // When a game is over we call aggregateResults to extract and update results
  // from the game

  const game = getGameByID(gameID)
  return aggregateResults(game, gameID)
}

exports.findOpenGameRoom = function(username) {
  // When a user presses new game we look for an open game room. I.e we check if tehre is a room
  // which one user has joined earlier and is now waiting for another player in a waiting room

  let noOpenGameRoomExists = true
  let gameID = null
  // we go thorugh all gamekeys in the dict: games which contaings all previosuly established games
  loop1: // eslint-disable-line
  for (var gameKey of games.keys()) { // eslint-disable-line
    if (!games.get(gameKey).fullRoom && games.get(gameKey).players[0] !== username) {
      // if we find a gameroom that is not full, we want to notify that an Open Game Room does Exists
      // we also want to return the id of this open room

      noOpenGameRoomExists = false
      gameID = gameKey

      break loop1 // eslint-disable-line
    }
  }

  return { gameID, noOpenGameRoom: noOpenGameRoomExists }
}

exports.getOpenGameRoom = function(userName, gameID) {
  // gets a game room that has been entered by one user that now is waiting in the waiting room
  // for another user to join by an ID that has been extracted earlier
  const player2 = 1

  games.get(gameID).fullRoom = true // the room is now full since another user entered

  games.get(gameID).players[player2] = userName

  return { gameID, fullRoom: games.get(gameID).fullRoom }
}

exports.createGame = function(userName) {
  // If there is no open game room we create a new game room

  return createGameObject(userName)
    .then(newGame => {
      const gameID = createGameKey()

      games.set(gameID, newGame)

      return { gameID, fullRoom: games.get(gameID).fullRoom }
    })
    .catch(err => {
      console.log('Something went wrong while retriving the questions in MODEL')
      console.error(err)
    })
}

exports.getUserNames = function(gameID) {
  // gets the usernames for all players in a game

  return games.get(gameID).players
}








// //////////////////////////////////////////////////////////////////////////////////////////
// NEWLY ADDED FUNCTIONS TO MAKE SURE THAT STATS AND MATCHES ARE UPDATED ONCE PER PLAYER //
// ////////////////////////////////////////////////////////////////////////////////////////

exports.playerFinishedGame = function(gameID, userName) {
  // A player tells the server that it has finished playing the game and that has entered/gone to/is now at the results screen

    const player = getPlayerIndexByUsername(gameID, userName)
    games.get(gameID).finishedGame[player] = true;

    return 'SUCCESS';
}



exports.didAllPlayersFinishGame = function(gameID) {
  // We want to know if both players finished playing/answering all quetsions

  let gameFinished = true;

  for (let player = 0; player < games.get(gameID).players.length; player+=1) {

        if(!games.get(gameID).finishedGame[player]){
              gameFinished = false;

        }
    }
    return gameFinished;
}
