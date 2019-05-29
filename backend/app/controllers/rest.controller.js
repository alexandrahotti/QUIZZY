const express = require('express')

const router = express.Router()
const passport = require('passport')
const model = require('../model.js')

function isAuthenticated(req, res, next) {
  if (req.user) return next()
  return res.status(401).json({
    error: 'User not authenticated'
  })
}

router.get('/', function(req, res) {
  res.json({
    message: 'hooray! welcome to our api!'
  })
})

router.get('/logout', isAuthenticated, function(req, res) {
  req.logout()
  res.json({
    message: 'LOGOUT'
  })
})

router.get('/user', isAuthenticated, function(req, res) {
  console.log('Fetching user')

  model.getUser(req.user.id).then(user => {
    console.log('User fetched.')

    return res.json({
      user
    })
  })
})

router.get('/randomQuote', isAuthenticated, function(req, res) {
  console.log('Fetching random quote')

  model.getRandomQuote().then(quote => {
    console.log('Quote fetched.')

    return res.json({
      quote
    })
  })
})

router.get('/matchHistory', isAuthenticated, function(req, res) {
  console.log('Fetching user history')

  model.getMatchHistory(req.user.id).then(matches => {
    console.log('MatchHistory fetched.')

    return res.json({
      matches
    })
  })
})

router.get('/stats', isAuthenticated, function(req, res) {
  console.log('Router get - stats.')

  model
    .getLastMonthStats()
    .then(stats => {
      console.log('Stats fetched.')
      return res.json({
        stats
      })
    })
    .catch(err => {
      console.log(err)
      console.log('Error retrieving stats.')
    })
})

router.get('/personalStats', isAuthenticated, function(req, res) {
  console.log('Router get - personalStats.')

  model
    .getPersonalStats(req.user.id)
    .then(personalStats => {
      console.log('Personal stats fetched.')
      return res.json({
        personalStats
      })
    })
    .catch(err => {
      console.log(err)
      console.log('Error retrieving Personal stats.')
    })
})

router.post('/signup', function(req, res, next) {
  passport.authenticate('local-signup', function(err, user) { // eslint-disable-line
    // eslint-disable-line consistent-return
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.redirect('/api/login/fail')
    }
    req.logIn(user, function(err) {  // eslint-disable-line
      // eslint-disable-line no-shadow
      if (err) {
        return next(err)
      }
      return res.redirect('/api/login/redirect')
    })
  })(req, res, next)
})

router.post(
  '/login',
  passport.authenticate('local-login', {
    successRedirect: '/api/login/redirect', // redirect to the secure profile section
    failureRedirect: '/api/login/fail' // redirect back to the signup page if there is an error
  })
)

router.get('/login/redirect', function(req, res) {
  console.log('Login Succesful')

  res.json({
    message: 'SUCCESS'
  })
})

router.get('/login/fail', function(req, res) {
  console.log('Login Failed')

  res.json({
    message: 'FAILURE'
  })
})

router.get('/checkauth', isAuthenticated, function(req, res) {
  res.status(200).json({
    status: 'Auth Successful!'
  })
})

router.get('/game', isAuthenticated, function(req, res) {
  res.json({
    game: model.getAllGames()
  })
})

router.post('/submitUserQuestion', isAuthenticated, function(req, res) {
  console.log('Submit user question POST')
  model
    .submitUserQuestion(req.body, req.user)
    .then(() => {
      console.log('Submit user question successful')
      res.json({
        message: 'SUCCESS'
      })
    })
    .catch(err => {
      console.log('Submit user question error in REST')
      console.log(err)
    })
})

router.post('/runGame', isAuthenticated, function(req, res) {
  console.log('REST IN RUNGAME')
  res.json(model.getGameByID(req.body.gameID))
})

router.post('/game', isAuthenticated, function(req, res) {
  console.log('Joining game in rest')
  const { gameID, noOpenGameRoom } = model.findOpenGameRoom(req.user.username)

  if (noOpenGameRoom) {
    return model
      .createGame(req.body.userName)
      .then(newGame => {
        res.json(newGame)
      })
      .catch(err => {
        console.error(err)
      })
  }
  return res.json(model.getOpenGameRoom(req.body.userName, gameID))
})

router.post('/storeGameStatisticsAndHistory', isAuthenticated, function(req, res) {
  const { gameID } = req.body
  const { username } = req.user
  const userId = req.user.id

  model
    .createOrUpdatePlayerStats(gameID, username, userId)
    .then(msg => {
      console.log(msg)
      model
        .insertMatchHistoryHandler(gameID, userId)
        .then(msg2 => {
          console.log(msg2)
          res.json({ result: 'SUCCESS' })
        })
        .catch(err => {
          console.log(err)
          console.log('Error in insertMatchHistoryHandler REST')
        })
    })
    .catch(err => {
      console.log(err)
      console.log('Error in createOrUpdatePlayerStats REST')
    })
})

router.post('/getUserNames', isAuthenticated, function(req, res) {
  console.log('Usernames in rest:')
  console.log(model.getUserNames(req.body.gameID))
  res.json(model.getUserNames(req.body.gameID))
})

router.post('/gameResults', isAuthenticated, function(req, res) {
  res.json(model.getGameResults(req.body.gameID))
})

router.post('/allQuestionsAnswered', isAuthenticated, function(req, res) {
  res.json(model.allQuestionsAnswered(req.body.gameID))
})

router.post('/registerAnswer', isAuthenticated, function(req, res) {
  console.log('registering answer!!')

  model.registerAnswer(req.body.gameID, req.body.userName, req.body.ans, req.body.questionNo)

  res.json({
    message: 'SUCCESS'
  })
})

router.post('/playerFinished', isAuthenticated, function (req, res) {
  // used to update the gameobject in model to notify that the cutrrent player is at the results screen
      res.json(
        model.playerFinishedGame(req.body.gameID, req.user.username)
      );
  });

router.post('/didAllPlayersFinishGame', isAuthenticated, function (req, res) {
    // used to check in the gameobject in model if all players are at the results screen
      res.json(
        model.didAllPlayersFinishGame(req.body.gameID)
      );
  });







module.exports = router
