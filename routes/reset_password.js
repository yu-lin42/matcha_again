var express = require('express');
var router = express.Router();
var connection = require('../dbc').connection;
var bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
	res.render('reset_password', {
		title: 'Reset Password Request',
		loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
		errors : [],
		emailStatus : '',
		newPassword : ''
	});
});

router.post('/resetRequest', (req, res, next) => {
	let email = req.body.email.trim();

	let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	let emailErrors = {
		fieldLength : ``,
		casing : ``,
		noErrors : `No`,
		dbErrors : ``
	};
	if (email.length > 0) {
		if (!email.match(emailRegex)) {
			emailErrors[`casing`] = `Invalid email address.`;
		}
		else if (email.match(emailRegex)) {
			emailErrors[`noErrors`] = `Yes`;
		}
	}
	else {
		emailErrors[`fieldLength`] = `This field cannot be blank.`;
	}
	console.log(email);
	if (emailErrors.noErrors === `No`) {
		res.render('reset_password', {
			title: 'Reset Password',
			loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
			errors : emailErrors
		});
	}
	else if (emailErrors.noErrors === `Yes`) {
		let findExistingUser = "SELECT * FROM users WHERE email = ?";
		let replacedValues = [email];
		connection.query(findExistingUser, replacedValues, (err, result) => {
			if (err) {
				throw err;
			}
			else {
				if (result.length === 0) {
					emailErrors.dbErrors = `None`;
				}
				else if (result.length > 0) {
					if (email === results[0].email) {
						emailErrors.dbErrors = `Email has already been taken`;
					}
				}
			}
			if (emailErrors.dbErrors !== `None`) {
				res.render('reset_password', {
					title: 'Reset Password',
					loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
					errors : emailErrors,
					emailStatus : '',
					newPassword : ''
				});
			}
			else if (emailErrors.dbErrors === `None`) {
				let resetToken = bcrypt.hashSync(email, 10);
				let resetValues = [resetToken, email];
				let resetQuery = `UPDATE users SET reset_token = ? WHERE email = ?`
				connection.query(resetQuery, resetValues, (err) => {
					if (err) {
						throw err;
					}
					else {
						mailOptions.to = email;
						mailOptions.subject = 'Reset Password';
						mailOptions.text = `You have requested a password reset.\n`
						+ `Please click on the link below to reset your password.\n`
						+ `http://localhost:8888/reset_password/verify?email=${email}&token=${resetToken}`;
						transporter.sendMail(mailOptions, (err) => {
							if (err) {
								throw err;
							}
							else {
								console.log(`Sent from successful signup`);
								res.render(`signup`, {
									title : `Signup`,
									loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
									errorMessages : [],
									emailStatus : `Sent`,
									newPassword : ''
								});
							}
						})
					}
				});
			}
		});
		res.render('reset_password', {
			title: 'Reset Password',
			loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
			errors : [],
			emailStatus : '',
			newPassword : ''
		});
	}
});

router.get('/verify', (req, res, next) => {
	let email = req.query.email;
	let resetToken = req.query.token;
	let resetConfirmQuery = `SELECT token FROM users WHERE email = ? AND resetToken = ?`;
	let resetConfirmArray = [email, resetToken];
	connection.query(resetConfirmQuery, resetConfirmArray, (err) => {
		if (err) {
			throw err;
		}
		else {
			// res.render('reset_password', {
			// 	title: 'Reset Password',
			// 	loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
			// 	resetAllowed : 1
			// });
		}
	});

});

module.exports = router;