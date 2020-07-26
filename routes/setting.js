var express = require('express');
var router = express.Router();
var connection = require('../dbc').connection;

router.get('/', (req, res, next) => {
	let id = req.session.userID;
	let userDetails = `name, surname, email, gender`;
	let userDetailsQuery = `SELECT ${userDetails} FROM users WHERE id = ?`;
	connection.query(userDetailsQuery, id, (err, results) => {
		if (err) {
			throw err;
		}
		else {
			console.log('results are sent');
			res.render('setting', {
				title: 'Setting',
				loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
				userData : results,
				errorMessages : []
			});
		}
	});
});

router.post('/updatePersonal', (req, res) => {
	let id = req.session.userID;
	let name = req.body.name.trim();
	let surname = req.body.surname.trim();
	let email = req.body.email.trim().toLowerCase();
	// let username = req.body.username.trim();

	let alphaRegex = /^[A-Za-z]+$/;
	// let alphaNumRegex = /^[0-9A-Za-z_.-]+$/;
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
	// // console.log(name);
	// // console.log(surname);
	// // console.log(email);
	
	if (nameErrors.noErrors === `No` || surnameErrors.noErrors === `No` || emailErrors.noErrors === `No`) {
		let errors = [
			nameErrors,
			surnameErrors,
			emailErrors
		];
		console.log(errors);
		let id = req.session.userID;
		let userDetails = `name, surname, email`;
		let userDetailsQuery = `SELECT ${userDetails} FROM users WHERE id = ?`;
		connection.query(userDetailsQuery, id, (err, results) => {
			if (err) {
				throw err;
			}
			else {
				console.log('results are sent');
				res.render('setting', {
				title: 'Setting',
				loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
				userData : results,
				errorMessages : errors
				});
			}
		});
	}
	else {
		let updateUserValues = [name, surname, email, id];
		let updateUser = `UPDATE users SET name = ?, surname = ?, email = ? WHERE id = ?`;
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
	// 	}
	// });
});
module.exports = router;