module.exports = (socket, io) => {

  socket.on('timer', req => {
    let countdown = req.countDownTime
    let countdownTimer

    countdownTimer = setInterval(function() {
      console.log(countdown)
      io.to(req.gameID).emit('timer', countdown)
      countdown -= 1
      if (countdown < 0) {
        clearInterval(countdownTimer)
        countdownTimer = null
        io.to(req.gameID).emit('stoppingTimer')
      }
    }, 1000)
  })

  socket.on('gameTimer', req => {
    let countdown = req.countDownTime
    let countdownTimer

    countdownTimer = setInterval(function() {
      console.log(countdown)
      io.to(req.gameID + req.userName).emit('gameTimer', countdown)
      countdown -= 1
      if (countdown < 0) {
        clearInterval(countdownTimer)
        countdownTimer = null
        io.to(req.gameID + req.userName).emit('stoppingTimer')
      }
    }, 1000)
  })

  socket.on('getTimer', req => {
    console.log('getTimer!!')

    const { gameID } = req

    io.to(gameID).emit('recieveTimer', req)
  })

  socket.on('join', req => {
    const { gameID } = req
    const { allPlayersJoined } = req

    socket.join(gameID)

    if (allPlayersJoined) {
      io.to(gameID).emit('getReady', req)
    }
  })

  socket.on('joinGameRoom', req => {
    const { gameID } = req
    const { userName } = req

    socket.join(gameID + userName)
  })




  ///////////////////////////////////////////////////////////////////////////////////////////////////
  /// CHANGED THESE TWO FUNCTIONS TO MAKE SURE THAT STATS AND MATCHES ARE UPDATED ONCE PER PLAYER///
  /////////////////////////////////////////////////////////////////////////////////////////////////
  socket.on('joinResultsRoom', req => {

    const { gameID } = req
    const allJoinedResultsRoom = req.allJoinedResultsRoom;

    if (allJoinedResultsRoom) {
      // emit something about starting game. broadcast
      io.to(gameID).emit('displayResults', req)
    }
  })

  socket.on('disconnect', () => {
    console.log('disconnecting in socket controller')
    socket.disconnect() // add on client side:   socket.disconnect(true);
  })

}
