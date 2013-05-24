
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , OpenIDStrategy = require('passport-openid').Strategy
  , chess = require('../chess_server.js')
  , http = require('http');

var app = express();

passport.serializeUser(function(user, done) {
  done(null, user.identifier);
});

passport.deserializeUser(function(identifier, done) {
  done(null, { identifier: identifier });
});

passport.use(new OpenIDStrategy({
		returnURL: 'http://localhost:8080/auth/openid/return',
		realm: 'http://localhost:8080/'
	},
	function(identifier, done) {
		// asynchronous verification, for effect...
		process.nextTick(function () {
			return done(null, { identifier: identifier })
		});
	}
));

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('571l343CFj3Xd8768D262z0s2291O1dHmY1A12KH334j558nx6P1'));
app.use(express.session({ secret: '68571l343CFj3Xd8768D26D262z0s2291O1dHmY11A12KH334j558334' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/game', routes.index);
app.get('/users', user.list);
app.get('/login', user.login);
app.get('/account', ensureAuthenticated, user.account);

// POST /auth/openid
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in OpenID authentication will involve redirecting
//   the user to their OpenID provider.  After authenticating, the OpenID
//   provider will redirect the user back to this application at
//   /auth/openid/return
app.post('/auth/openid', 
	passport.authenticate('openid', { failureRedirect: '/login' }),
	function(req, res) {
		res.redirect('/');
	}
);

// GET /auth/openid/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/openid/return', 
	passport.authenticate('openid', { failureRedirect: '/login' }),
	function(req, res) {
		res.redirect('/');
	}
);

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

chess.start(server);