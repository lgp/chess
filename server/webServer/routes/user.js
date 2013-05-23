/**
 * User accounts
 */

exports.list = function(req, res) {
	res.send('respond with resources');
};

exports.login = function (req, res) {
	res.render('login', {title: 'Sign in', user: req.user});
};

exports.account = function (req, res) {
	res.render('account', { title: 'User Account', user: req.user });
};