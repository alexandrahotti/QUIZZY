// import { AsyncStorage } from 'react-native'
export const ip = '130.229.170.139'

export const checkauthPath = `http://${ip}:8989/api/checkauth`
export const logoutPath = `http://${ip}:8989/api/logout`
export const loginPath = `http://${ip}:8989/api/login`
export const signupPath = `http://${ip}:8989/api/signup`
export const statsPath = `http://${ip}:8989/api/stats`
export const personalStatsPath = `http://${ip}:8989/api/personalStats`
export const userPath = `http://${ip}:8989/api/user`
export const matchHistoryPath = `http://${ip}:8989/api/matchHistory`
export const randomQuotePath = `http://${ip}:8989/api/randomQuote`
export const submitUserQuestionPath = `http://${ip}:8989/api/submitUserQuestion`
export const registerAnswerPath = `http://${ip}:8989/api/registerAnswer`
export const socketAdressPath = `http://${ip}:8989`
export const runGamePath = `http://${ip}:8989/api/runGame`
export const newGamePath = `http://${ip}:8989/api/game`
export const getUserNamesPath = `http://${ip}:8989/api/getUserNames`
export const gameResultsPath = `http://${ip}:8989/api/gameResults`
export const gameOverPath = `http://${ip}:8989/api/allQuestionsAnswered`
export const storeGameStatisticsAndHistoryPath = `http://${ip}:8989/api/storeGameStatisticsAndHistory`
export const playerFinishedPath =  `http://${ip}:8989/api/playerFinished`;
export const didAllPlayersFinishGamePath =  `http://${ip}:8989/api/didAllPlayersFinishGame`;

var RCTNetworking = require('RCTNetworking') // eslint-disable-line

const params = {
  credentials: 'include',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
}

export function makePlayerFinishedRequest(gameID) {
// This function is used so that one player can notify the server that it has gone to the reuslts screen/ is at the
// reuslts screen
    const fetchParams = {
        method: 'POST',
        ...params,
        body: JSON.stringify({
            gameID,
        }),
    }

    return fetch(playerFinishedPath, fetchParams)
        .then(response => response)
        .then(res => res.json())
}

export function makeDidAllPlayersFinishGameRequest(gameID) {
  // This request is used to check if both players have notified that they are at the results screen
    const fetchParams = {
        method: 'POST',
        ...params,
        body: JSON.stringify({
            gameID,
        }),
    }
    return fetch(didAllPlayersFinishGamePath, fetchParams)
        .then(response => response)
        .then(res => res.json())
}

// General get request
export function makeGetRequest(path) {
  const fetchParams = {
    method: 'GET',
    ...params
  }

  return fetch(path, fetchParams)
    .then(response => response)
    .then(data => data.json())
}

export function makeSignUpRequest(username, email, password, name) {
  // (async () => {
  //     AsyncStorage.removeItem('userCookie')
  // })();
  RCTNetworking.clearCookies(cleared => {
    console.log(`Cookies cleared, had cookies= ${cleared.toString()}`)
  })

  const fetchParams = {
    method: 'POST',
    ...params,
    body: JSON.stringify({
      username,
      email,
      password,
      name
    })
  }

  return fetch(signupPath, fetchParams)
    .then(response => response)
    .then(data => data.json())
}

export function makeSubmitQuestionRequest(answer1, answer2, answer3, answer4, question) {
  const fetchParams = {
    method: 'POST',
    ...params,
    body: JSON.stringify({
      answer1,
      answer2,
      answer3,
      answer4,
      question
    })
  }

  return fetch(submitUserQuestionPath, fetchParams)
    .then(response => response)
    .then(data => data.json())
}

export function makeLoginRequest(username, password) {
  RCTNetworking.clearCookies(cleared => {
    console.log(`Cookies cleared, had cookies= ${cleared.toString()}`)
  })

  const fetchParams = {
    method: 'POST',
    ...params,
    body: JSON.stringify({
      username,
      password
    })
  }

  return fetch(loginPath, fetchParams)
    .then(response => response)
    .then(res => res.json())
}

export function makeNewGameRequest(username) {
  const fetchParams = {
    method: 'POST',
    ...params,
    body: JSON.stringify({
      userName: username
    })
  }

  return fetch(newGamePath, fetchParams)
    .then(response => response)
    .then(res => res.json())
}

export function makeRunGameRequest(gameID) {
  const fetchParams = {
    method: 'POST',
    ...params,
    body: JSON.stringify({
      gameID
    })
  }

  return fetch(runGamePath, fetchParams)
    .then(response => response)
    .then(res => res.json())
}

export function makeGetGameResultsRequest(gameID) {
  const fetchParams = {
    method: 'POST',
    ...params,
    body: JSON.stringify({
      gameID
    })
  }

  return fetch(gameResultsPath, fetchParams)
    .then(response => response)
    .then(res => res.json())
}

export function makeAllQuestionsAnsweredRequest(gameID) {
  const fetchParams = {
    method: 'POST',
    ...params,
    body: JSON.stringify({
      gameID
    })
  }

  return fetch(gameOverPath, fetchParams)
    .then(response => response)
    .then(res => res.json())
}

export function makeStoreGameStatisticsAndHistoryRequest(gameID) {
  const fetchParams = {
    method: 'POST',
    ...params,
    body: JSON.stringify({
      gameID
    })
  }

  return fetch(storeGameStatisticsAndHistoryPath, fetchParams)
    .then(response => response)
    .then(res => res.json())
}

export function makeRegisterAnswerRequest(gameID, userName, ans, questionNo) {
  const fetchParams = {
    method: 'POST',
    ...params,
    body: JSON.stringify({
      gameID,
      userName,
      ans,
      questionNo
    })
  }

  return fetch(registerAnswerPath, fetchParams)
    .then(response => response)
    .then(res => res.json())
}

export function makeGetUserNamesRequest(gameID) {
  const fetchParams = {
    method: 'POST',
    ...params,
    body: JSON.stringify({
      gameID
    })
  }

  return fetch(getUserNamesPath, fetchParams)
    .then(response => response)
    .then(res => res.json())
}
