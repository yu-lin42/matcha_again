var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var connection = require('../dbc').connection;

/* GET home page. */
router.get('/', (req, res, next) => {
	res.render('login', {
		title: 'Login',
		loginStatus: req.session.userID ? 'logged_in' : 'logged_out',
		errors: [],
		verify: ``
	});
});
router.post('/attempt', (req, res, next) => {
	let alphaNumRegex = /^[0-9A-Za-z_.-]+$/;
	let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
	let usernameEmail = req.body.usernameEmail.trim();
	let password = req.body.password.trim();

	let usernameEmailErrors = {
		fieldLength : ``,
		casing : ``,
		noErrors : `No`,
		dbErrors : ``
	};
	let passwordErrors = {
		fieldLength : ``,
		casing : ``,
		noErrors : `No`,
		dbErrors : ``
	}

	if (usernameEmail.length > 0) {
		if (!usernameEmail.match(alphaNumRegex) && !usernameEmail.match(emailRegex)) {
			usernameEmailErrors.casing = `Invalid syntax`;
		}
		else {
			if (usernameEmail.match(alphaNumRegex)) {
				usernameEmailErrors.noErrors = `Yes`;
			}
			else if (usernameEmail.match(emailRegex)) {
				usernameEmailErrors.noErrors = `Yes`;
			}
		}
	}
	else {
		usernameEmailErrors.fieldLength = `This field cannot be blank`;
	}
	if (password.length > 0) {
		if (!password.match(passwordRegex)) {
			passwordErrors.casing = `Invalid password`;
		}
		if (password.length > 15) {
			passwordErrors.fieldLength = `Character limit exceeded`;
		}
		else if (password.match(passwordRegex) && password.length <= 15) {
			passwordErrors.noErrors = `Yes`;
		}
	}
	else {
		passwordErrors.fieldLength = `This field cannot be blank`;
	}
	if (usernameEmailErrors.noErrors === `No` || passwordErrors === `No`) {
		console.log(`It done didn't worked`);
		let errors = [
			usernameEmailErrors,
			passwordErrors
		];
		console.log(passwordErrors);
		console.log(usernameEmailErrors);
		res.render('login', {
			title: 'Login',
			loginStatus: req.session.userID ? 'logged_in' : 'logged_out',
			errors: errors,
			verify: ``
		});
	}
	else if (usernameEmailErrors.noErrors === `Yes` && passwordErrors.noErrors === `Yes`) {
		console.log(`It done worked`);
		let saltRounds = 10;
		let dataCheck = [usernameEmail, usernameEmail];
		let dataCheckQuery = `SELECT email, username, password, verified, firstLogin, id FROM users WHERE email = ? OR username = ?`
		connection.query(dataCheckQuery, dataCheck, (err, results) => {
			let databaseErrors = [
				usernameEmailErrors,
				passwordErrors
			];
			if (err) {
				throw err;
			}
			else if (results.length === 0) {
				// console.log(`no hablo engles`);
				usernameEmailErrors.dbErrors = `User not found`;
				res.render('login', {
					title: 'Login',
					loginStatus: req.session.userID ? 'logged_in' : 'logged_out',
					errors: databaseErrors,
					verify: ``
				});
			}
			else if (results.length > 0) {
				console.log(results[0].password);
				// console.log(password);
				console.log(`Your face`);
				if (bcrypt.compareSync(password, results[0].password)) {
					console.log(`Found password mugglefucker`);
					if (results[0].verified === 0) {
						console.log(`Oh shit`);
						res.render('login', {
							title: 'Login',
							loginStatus: req.session.userID ? 'logged_in' : 'logged_out',
							errors: [],
							verify: `Please verify your email address.`
						});
					}
					else if (results[0].verified === 1) {
						console.log(`Well done`);
						req.session.userID = results[0].id;
						if (results[0].firstLogin === 1) {
							res.redirect('/setupProfile');
						}
						else if (results[0].firstLogin === 0) {
							res.redirect('/users');
						}
					}
				}
				else {
					console.log(`Wrong password bitch`);
					passwordErrors.dbErrors = `Incorrect password`;
					res.render('Login', {
						title: 'Login',
						loginStatus: req.session.userID ? 'logged_in' : 'logged_out',
						errors: databaseErrors,
						verify: ``
					});
				}
			}
			// console.log(fields);
		});
	}
});

module.exports = router;
