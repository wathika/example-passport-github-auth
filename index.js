/**
 * Module dependencies
 */

var express = require('express')
var app = express()
var passport = require('passport')
var GithubStrategy = require('passport-github').Strategy
var config = require('./argv')
var path = require('path')
var cookieParser = require('cookie-parser')
var session = require('express-session')

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(obj, done) {
  done(null, obj)
})

// Use Github Strategy

passport.use(new GithubStrategy({
  clientID: config.githubClientId,
  clientSecret: config.githubClientSecret,
  callbackURL: "http://127.0.0.1:3000/auth/github/callback",
}, function(accessToken, refreshToken, profile, done) {
  return done(null, profile)
}))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// middleware
//
app.use(session({
  secret: 'keyboard cat'
}))

app.use(passport.initialize())
app.use(passport.session())

// routes

app.get('/', function(req, res) {
  console.log('open index')
  res.render('index', {
    user: req.user
  })
})

app.get('/home', ensureAuthenticated, function(req, res) {
  res.render('home', {
    user: req.user
  })
})

app.get('/login', function(req, res) {
  res.render('login')
})

app.get('/auth/github', passport.authenticate('github', {
  scope: ['user:email']
}), function(req, res) {
  console.log('auth github')
    // res.redirect('/home')
})

app.get('/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    res.redirect('/home');
  });

app.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/login')
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

// Listen server on port 3000

app.listen(3000, function() {
  console.log('listen on *:3000')
})
