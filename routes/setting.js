var express = require('express');
var router = express.Router();
var connection = require('../dbc').connection;
var bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
	let id = req.session.userID;
	let userDetails = `name, surname, email, gender, biography, sexualOrientation, agePreference, interest1, interest2, interest3, interest4`;
	let userDetailsQuery = `SELECT ${userDetails} FROM users WHERE id = ?`;
	// document.getElementById("Personal").style.display = "block";
	connection.query(userDetailsQuery, id, (err, results) => {
		if (err) {
			throw err;
		}
		else {
			console.log('results are sent');
			// console.log(results[0]);
			// console.log(typeof(results));
			res.render('setting', {
				title: 'Setting',
				loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
				userData : results,
				errorMessages : []
			});
		}
	});
});

router.post('/upload', (req, res) => {
	console.log("request received");
	console.log(req.body);
});

router.post('/updatePersonal', (req, res) => {
	let id = req.session.userID;
	let name = req.body.name.trim();
	let surname = req.body.surname.trim();
	let email = req.body.email.trim().toLowerCase();
	let gender = req.body.gender;

	let alphaRegex = /^[A-Za-z]+$/;
	let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

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

	if (name.length > 0) {
		if (!name.match(alphaRegex)) {
			nameErrors[`casing`] = `Only uppercase and lowercase characters allowed.`;
		}
		if (name.length > 20) {
			nameErrors[`fieldLength`] = `May not be more than 20 characters.`;
		}
		else if (name.match(alphaRegex) && name.length <= 20) {
			nameErrors[`noErrors`] = `Yes`;
		}
	}
	else {
		nameErrors[`fieldLength`] = `This field cannot be blank.`;
	}

	if (surname.length > 0) {
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
		surnameErrors[`fieldLength`] = `This field cannot be blank.`;
	}

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
	
	if (nameErrors.noErrors === `No` || surnameErrors.noErrors === `No` || emailErrors.noErrors === `No`) {
		let errors = [
			nameErrors,
			surnameErrors,
			emailErrors
		];
		let id = req.session.userID;
		let userDetails = `name, surname, email, gender`;
		let userDetailsQuery = `SELECT ${userDetails} FROM users WHERE id = ?`;
		connection.query(userDetailsQuery, id, (err, results) => {
			if (err) {
				throw err;
			}
			else {
				console.log(errors);
				console.log(results);
				console.log('errors are sent');
				res.render('setting', {
					title : `Setting`,
					loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
					userData : [],
					errorMessages : errors
				});
			}
		});
	}
	else if (nameErrors.noErrors === `Yes` && surnameErrors.noErrors === `Yes` && emailErrors.noErrors === `Yes`) {
		let updateUserValues = [name, surname, email, gender, id];
		let updateUser = `UPDATE users SET name = ?, surname = ?, email = ?, gender = ? WHERE id = ?`;
		connection.query(updateUser, updateUserValues, (err) => {
			if (err) {
				throw err;
			}
			else {
				console.log('User updated');
				res.redirect(`/profile`);
			}
		});
	}
});

router.post('/updateInterests', (req, res) => {
	id = req.session.userID;
	agePreference = req.body.agePreference;
	interests = req.body.interests;
	sexualOrientation = req.body.sexualOrientation;
	biography = req.body.bio;
	// console.log(sexualOrientation);
	// console.log(sexualPref);
	// console.log(agePref);
	// console.log(interests);
	let updateInterestsValues = [biography, sexualOrientation, agePreference, interests[0], interests[1], interests[2], interests[3], id];
	let updateInterests = `UPDATE users SET biography = ?, sexualOrientation = ?, agePreference = ?, interest1 = ?, interest2 = ?, interest3 = ?, interest4 = ? WHERE id = ?`;
	connection.query(updateInterests, updateInterestsValues, (err) => {
		if (err) {
			throw err;
		}
		else {
			console.log('Interests updated');
			res.redirect(`/profile`);
		}
	});
});

router.post('/updatePassword', (req, res) => {
	let id = req.session.userID;
	let newPassword = req.body.newPassword.trim();
	let confirmPassword = req.body.confirmNewPassword.trim();
	let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
	
	let newPasswordErrors = {
		fieldLength : ``,
		casing : ``,
		noErrors : `No`
	};
	let confirmPasswordErrors = {
		fieldLength : ``,
		casing : ``,
		noErrors : `No`
	};

	if (newPassword.length > 0) {
		if (!newPassword.match(passwordRegex)) {
			newPasswordErrors[`casing`] = `Minimum 8 characters comprised of: 1 uppercase and 1 lowercase character, 1 number, and 1 special character.`;
		}
		if (newPassword.length > 15) {
			newPasswordErrors[`fieldLength`] = `Password exceeds maximum number of characters (15).`; 
		}
		else if (newPassword.match(passwordRegex) && newPassword.length <= 15) {
			newPasswordErrors[`noErrors`] = `Yes`;
			if (confirmPassword.length > 0) {
				if (confirmPassword !== newPassword) {
					confirmPasswordErrors[`casing`] = `Passwords do not match.`;
				}
				else if (confirmPassword === newPassword) {
					// console.log('passwords match');
					confirmPasswordErrors[`noErrors`] = `Yes`;
				}
			}
			else {
				confirmPasswordErrors[`fieldLength`] = `This field cannot be blank.`;
			}
		}
	}
	else {
		newPasswordErrors[`fieldLength`] = `This field cannot be blank.`;
	}

	if (newPasswordErrors.noErrors === `No` || confirmPasswordErrors.noErrors === `No`) {
		let errors = [
			newPasswordErrors,
			confirmPasswordErrors
		];
		console.log(errors[0]);
		console.log(errors[1]);
		console.log('errors sent');
		res.render('setting', {
			title : `Setting`,
			loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
			userData : [],
			errorMessages : errors
		});
	}
	else if (newPasswordErrors.noErrors === `Yes` && confirmPasswordErrors.noErrors === `Yes`) {
		console.log('no errors');
		let saltRounds = 10;
		let hashPassword = bcrypt.hashSync(newPassword, saltRounds);
		let updatePasswordValues = [hashPassword, id];
		let updatePassword = `UPDATE users SET password = ? WHERE id = ?`;
		connection.query(updatePassword, updatePasswordValues, (err) => {
			if (err) {
				throw err;
			}
			else {
				console.log('Password updated');
				res.redirect(`/profile`);
			}
		});
	}
});

module.exports = router;