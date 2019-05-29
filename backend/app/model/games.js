const fetch = require("node-fetch");
const { UserQuestions } = require('../../config/database');
const Sequelize = require("sequelize");

const getGameQuestions = function() {
  const noOfQuestions = 2
  return fetch(`https://opentdb.com/api.php?amount=${noOfQuestions}&type=multiple`)//different formats are possible here
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.response_code ==0) {
          return UserQuestions.findAll({ order: [[Sequelize.literal('RAND()')]],limit: 1})
          .then((question) => {
            var question = question[0]
            question["incorrect_answers"] = [question.answer2, question.answer3, question.answer4]
            question["correct_answer"] = question.answer1
            console.log(question);

            responseJson.results.push(question);
            return responseJson.results;
        }).catch(err => console.log(err))
      }else{
        throw 'Something went wrong with the Trivia API';
      }
    })
    .catch((error) =>{
      console.error(error);
    });
}


function shuffle(array) {
  console.log('went into shuffle');
      var j, x, i;
      for (i = array.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          x = array[i];
          array[i] = array[j];
          array[j] = x;
      }
      return array;
  }

const shuffleAllAnswers = function(questionArrayObjects) {
  console.log('SHUFFLING  ');
  console.log(questionArrayObjects);


    let allShuffledAnswers = []

    for (var i = 0; i < questionArrayObjects.length; i++) {
      let answers = questionArrayObjects[i].incorrect_answers

      answers.push(questionArrayObjects[i].correct_answer)
      console.log(answers);
      allShuffledAnswers.push(shuffle(answers))

    }
    console.log('allShuffledAnswers');
    console.log(allShuffledAnswers);
    return allShuffledAnswers;

}

exports.createGameObject = function(userName) {
  return getGameQuestions().then((questionArray) => {
    let allShuffledAnswers = shuffleAllAnswers(questionArray);

    let gameJSON = {
      matchHistoryStored:false,
      fullRoom:false,
      finishedGame: [false,false],
      roomSize: 2,
      players: [userName, null],
      questions: questionArray,
      shuffledQuestions:allShuffledAnswers,
      answers: [[null,null,null],[null,null,null]],
      winner:'',
      loser:'',
      tie:'',
      scores: [0, 0],
    };
    return gameJSON;
  }).catch((err) => {
    console.log('Something went wrong while retriving the questions in games');
    console.error(err);
  })

}
