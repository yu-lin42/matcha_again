var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var connection = require('../dbc').connection;
var transporter = require('../sendMail').transporter;
var mailOptions = require('../sendMail').mailOptions;

/* GET home page. */
router.get('/', (req, res, next) => {
	res.render('signup', {
		title: 'Signup',
		loginStatus: req.session.userID ? 'logged_in' : 'logged_out',
		errorMessages : [],
		emailStatus : ``
	});
});

router.post('/create', (req, res) => {
	// console.log(`dfsgs`);
	let name = req.body.name.trim();
	let surname = req.body.surname.trim();
	let email = req.body.email.trim();
	let username = req.body.username.trim();
	let password = req.body.password.trim();
	let confirmPassword = req.body.confirmPassword.trim();

	let gender = req.body.gender;
	let birth = req.body.birthday;
	let birthDate = new Date(birth);
	let age = 0;

	let alphaRegex = /^[A-Za-z]+$/;
	let alphaNumRegex = /^[0-9A-Za-z_.-]+$/;
	let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
	var today = new Date();
	let legal = 18;
	// var curDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

	let nameErrors = {
		fieldLength : ``,
		casing : ``,
		noErrors : `No`,
		dbErrors : ``
	};
	let surnameErrors = {
		fieldLength : ``,
		casing : ``,
		noErrors : `No`,
		dbErrors : ``
	};
	let emailErrors = {
		fieldLength : ``,
		casing : ``,
		noErrors : `No`,
		dbErrors : ``
	};
	let usernameErrors = {
		fieldLength : ``,
		casing : ``,
		noErrors : `No`,
		dbErrors : ``
	};
	let genderErrors = {
		noGender : ``,
		noErrors : `No`
	};
	let birthErrors = {
		noDate : ``,
		illegal : ``,
		noErrors : `No`
	};
	let passwordErrors = {
		fieldLength : ``,
		casing : ``,
		noErrors : `No`
	};
	let confirmPasswordErrors = {
		fieldLength : ``,
		casing : ``,
		noErrors : `No`
	};

//////////////////////////////////////////////////////////////////////
	// name field
	if (name.length > 0) {
		// console.log(`nameErrors`);
		if (!name.match(alphaRegex)) {
			nameErrors[`casing`] = `Only uppercase and lowercase characters allowed.`;
		}
		if (name.length > 20) {
			nameErrors[`fieldLength`] = `May not be more than 20 characters.`;
		}
		else if (name.match(alphaRegex) && name.length <= 20) {
			// console.log(`noNameErrors`);
			nameErrors[`noErrors`] = `Yes`;
		}
	}
	else {
		// console.log(`blankErrors`);
		nameErrors[`fieldLength`] = `This field cannot be blank.`;
	}
	// surname field
	if (surname.length > 0) {
		// console.log(`surnameErrors`);
		if (!surname.match(alphaRegex)) {
			surnameErrors[`casing`] = `Only uppercase and lowercase characters allowed.`;
		}
		if (surname.length > 20) {
			surnameErrors[`fieldLength`] = `May not be more than 20 characters.`;
		}
		else if (surname.match(alphaRegex) && surname.length <= 20) {
			surnameErrors[`noErrors`] = `Yes`;
		}
	}
	else {
		// console.log(`blankErrors`);
		surnameErrors[`fieldLength`] = `This field cannot be blank.`;
	}
	// email field
	if (email.length > 0) {
		// console.log(`emailErrors`);
		if (!email.match(emailRegex)) {
			emailErrors[`casing`] = `Invalid email address.`;
		}
		else if (email.match(emailRegex)) {
			emailErrors[`noErrors`] = `Yes`;
		}
	}
	else {
		// console.log(`blankErrors`);
		emailErrors[`fieldLength`] = `This field cannot be blank.`;
	}
	// username field
	if (username.length > 0) {
		// console.log(`usernameErrors`);
		if (!username.match(alphaNumRegex)) {
			usernameErrors[`casing`] = `Allowed characters include: Uppercase and lowercase letters and numbers.`;
		}
		if (username.length > 30) {
			usernameErrors[`fieldLength`] = `May not be more than 30 characters.`;
		}
		else if (username.match(alphaNumRegex) && username.length <= 30) {
			usernameErrors[`noErrors`] = `Yes`;
		}
	}
	else {
		// console.log(`blankErrors`);
		usernameErrors[`fieldLength`] = `This field cannot be blank.`;
	}

	// gender field
	if (gender === undefined) {
		// console.log('no gender');
		genderErrors[`noGender`] = `This field cannot be blank.`;
	}
	else {
		genderErrors[`noErrors`] = `Yes`;
	}///I think I should take that noErrors out

	// age field
	// console.log(curDate);
	// console.log(birthDate);
	if (birth === ``) {
		birthErrors[`noDate`] = `Enter a date of birth`;
	}
	else if (birth !== ``){
		age = (today.getFullYear() - birthDate.getFullYear());
		if (age < legal) {
			birthErrors[`illegal`] = `You are not old enough to sign up.`;
			// console.log(age);
		}
		else {
			birthErrors[`noErrors`] = `Yes`;
		}
	}

	// password field
	if (password.length > 0) {
		// console.log(`passwordErrors`);
		if (!password.match(passwordRegex)) {
			passwordErrors[`casing`] = `Minimum 8 characters comprised of: 1 uppercase and 1 lowercase character, 1 number, and 1 special character.`;
		}
		if (password.length > 15) {
			passwordErrors[`fieldLength`] = `Password exceeds maximum number of characters (15).`;
		}
		else if (password.match(passwordRegex) && password.length <= 15) {
			passwordErrors[`noErrors`] = `Yes`;
			// confirmPassword field
			if (confirmPassword.length > 0) {
				// console.log(`confirmPasswordErrors`);
				if (confirmPassword !== password) {
					confirmPasswordErrors[`casing`] = `Passwords do not match.`;
				}
				else if (confirmPassword === password) {
					confirmPasswordErrors[`noErrors`] = `Yes`;
				}
			}
			else {
				// console.log(`blankErrors`);
				confirmPasswordErrors[`fieldLength`] = `This field cannot be blank.`;
			}
		}
	}
	else {
		// console.log(`blankErrors`);
		passwordErrors[`fieldLength`] = `This field cannot be blank.`;
	}
	
//////////////////////////////////////////////////////////////////
	if (nameErrors.noErrors === `No` || surnameErrors.noErrors === `No` || usernameErrors.noErrors === `No` || emailErrors.noErrors === `No` || passwordErrors.noErrors === `No` || confirmPasswordErrors.noErrors === `No`) {
		// console.log(`Found errors`);
		let errors = [
			nameErrors,
			surnameErrors,
			emailErrors,
			usernameErrors,
			passwordErrors,
			confirmPasswordErrors,
			genderErrors,
			birthErrors
		];
		// console.log(errors);
		res.render(`signup`, {
			title : `Signup`,
			loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
			errorMessages : errors,
			emailStatus : ``
		});
	}
	else if (nameErrors.noErrors === `Yes` && surnameErrors.noErrors === `Yes` && usernameErrors.noErrors === `Yes` && emailErrors.noErrors === `Yes` && passwordErrors.noErrors === `Yes` && confirmPasswordErrors.noErrors === `Yes`) {
		// input database inserting things
		// console.log(`noerrors found`);
		// let findExistingEmail = "SELECT * FROM users WHERE email = ?";
		let findExistingUser = "SELECT * FROM users WHERE username = ? OR email = ?";
		let replacedValues = [username, email];
		// let findUsername = [username];
		connection.query(findExistingUser, replacedValues, (err, result) => {
			if (err) {
				throw err;
			}
			else {
				if (result.length === 0) {
					emailErrors.dbErrors = `None`;
					usernameErrors.dbErrors = `None`;
				}
				else if (result.length > 0) {
					if (email === result[0].email) {
						emailErrors.dbErrors = `Email has already been taken`;
					}
					if (username === result[0].username) {
						usernameErrors.dbErrors = `Username has already been taken`;
					}
				}
			}
			console.log(emailErrors);
			console.log(usernameErrors);
//////////////////////////////////////////////////////////
			if (emailErrors.dbErrors !== `None` || usernameErrors.dbErrors !== `None`) {
				let errors = [
					nameErrors,
					surnameErrors,
					emailErrors,
					usernameErrors,
					passwordErrors,
					confirmPasswordErrors,
					genderErrors,
					birthErrors
				];
				res.render(`signup`, {
					title : `Signup`,
					loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
					errorMessages : errors,
					emailStatus : ``
				});
			}
			else if (emailErrors.dbErrors === `None` && usernameErrors.dbErrors === `None`) {
				console.log(`Shit be working`);
				let saltRounds = 10;
				let hashPassword = bcrypt.hashSync(password, saltRounds);
				let hashToken = bcrypt.hashSync(username, saltRounds);
				let createNewUserValues = `name, surname, email, username, notifications, verified, token, password, firstLogin, gender, age`;
				let createNewUser = `INSERT INTO users(${createNewUserValues})`;
				let valuesArray = [
					name,
					surname,
					email,
					username,
					1,
					0,
					hashToken,
					hashPassword,
					1,
					gender,
					age
				];
				connection.query(createNewUser + `VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, valuesArray, (err) => {
					if (err) {
						throw err;
					}
					else {
						console.log(`User created`);
						mailOptions.to = email;
						mailOptions.subject = 'Verification Email';
						mailOptions.text = `You have successfully created your Matcha account.\n`
						+ `Please click on the link below to verify your email address.\n`
						+ `http://localhost:8888/signup/verify?email=${email}&token=${hashToken}`;
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
									emailStatus : `Sent`
								});
							}
						})
					}
				});
				// insert into database
			}
			// res.redirect(`/login`);
		});
	}
});

router.get('/verify', (req, res, next) => {
	let email = req.query.email;
	let token = req.query.token;
	console.log(email);
	console.log(token);
	let signUpConfirmQuery = `SELECT email, username, token, verified FROM users WHERE email = ? AND token = ?`;
	let signUpConfirmArray = [email, token];
	connection.query(signUpConfirmQuery, signUpConfirmArray, (err, results) => {
		if (err) {
			throw err;
		}
		else if (results[0].verified === 1) {
			console.log(`Your account has already been verified`);
			res.render('verify', {
				title : 'Already verified',
				loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
				verifiedStatus : 0
			});
		}
		else if (results[0].verified === 0) {
			console.log(results);
			// update verification in db
			let updateVerifiedStatusArray = [1, results[0].email, results[0].username];
			let updateVerifiedStatusQuery = `UPDATE users SET verified = ? WHERE email = ? AND username = ?`;
			connection.query(updateVerifiedStatusQuery, updateVerifiedStatusArray, (err, results) => {
				if (err) {
					throw err;
				}
				else {
					console.log(`Data successfully updated`);
					res.render('verify', {
						title : `Account verified`,
						loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
						verifiedStatus : 1
					});
				}
			});
		}
	});
});

module.exports = router;
