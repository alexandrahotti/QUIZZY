// load all the things we need
const LocalStrategy = require('passport-local').Strategy

// load up the user model
const { User } = require('./database')
const { getCurrentYearMonthDayTime } = require('../app/helpers')

// expose this function to our app using module.exports
module.exports = function(passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  // passport registration
  passport.serializeUser((user, done) => {
    console.log(user.id)

    return done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({
        where: {
          id
        }
      })
      console.log(user)

      done(null, user)
    } catch (err) {
      console.log('hej')

      done(err)
    }
  })

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, username, password, done) {
        User.findOne({
          where: {
            username
          }
        })
          .then(user => {   // eslint-disable-line
            
            if (user) {
              return done(null, false, {
                signupMessage: 'That username is already taken.'
              })
            }

            const hashedPassword = User.generateHash(password)

            const now = getCurrentYearMonthDayTime()

            User.build({
              username,
              email: req.body.email,
              name: req.body.name,
              password: hashedPassword,
              registered: now
            })
              .save()
              .then(newUser => {
                console.log(newUser)
                return done(null, newUser)
              })
              .catch(error => {
                console.log(error)
                console.log('Error occured in User build local signup.')
              })
          })
          .catch(err => done(err))
      }
    )
  )

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use(
    'local-login',
    new LocalStrategy(
      {
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, username, password, done) {
        // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({
          where: {
            username
          }
        })
          .then(user => {
            // if no user is found, return the message
            if (!user) return done(null, false, { loginMessage: 'No user found.' }) // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!User.validPassword(password, user)) return done(null, false, { loginMessage: 'Oops! Wrong password.' }) // create the loginMessage and save it to session as flashdata

            // all is well, return successful user

            return done(null, user)
          })
          .catch(err => done(err))
      }
    )
  )
}
