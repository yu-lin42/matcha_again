var express = require('express');
var router = express.Router();
var connection = require('../dbc').connection;

router.get('/', (req, res, next) => {
	id = req.session.userID;
	let userDetails = `gender`;
	let userDetailsQuery = `SELECT ${userDetails} FROM users WHERE id = ?`;
	connection.query(userDetailsQuery, id, (err, results) => {
		if (err) {
			throw err;
		}
		else {
			res.render('setupProfile', {
				title : `Setup Profile`,
				loginStatus: req.session.userID ? 'logged_in' : 'logged_out',
				errorMessages : []
			});
		}
	});
});

router.post('/location', (req, res) => {
		id = req.session.userID;
		latitude = req.body.lat;
		longitude = req.body.lon;
		cityname = req.body.cityname;
		console.log(cityname);
		// timestamp = req.body.timestamp;
		console.log(req.body);
		let userLocation = [latitude, longitude, cityname, id];
		let updateUserLocation = `UPDATE users SET latitude = ?, longitude = ?, city = ? WHERE id = ?`;
		connection.query(updateUserLocation, userLocation, (err) => {
			if (err) {
				throw err;
			}
			else {
				console.log('User location updated');
			}
		});
	});

router.post('/check', (req, res, next) => {
	// need to add errr checks
	biography = req.body.bio;
	interests = req.body.interests;
	sexualOrientation = req.body.sexualOrientation;
	agePreference = req.body.agePreference
	id = req.session.userID;
	console.log(biography);
	let bioErrors = {
		fieldLength : ``,
		noErrors : `No`
	};
	let interestErrors = {
		noSelection : ``,
		numberOfErrors : ``,
		noErrors : `No`
	};
	let sexualOrientationErrors = {
		noSelection : ``,
		noErrors : `No`
	};
	let agePreferenceErrors = {
		noSelection : ``,
		noErrors : `No`
	};
	
	if (biography.length === 0) {
		bioErrors[`fieldLength`] = `This field may not be empty.`;
	} else {
		bioErrors[`noErrors`] = `Yes`;
	}
	if (interests === undefined) {
		interestErrors[`noSelection`] = `This field cannot be empty.`;
	} else if (interests.length !== 4) {
		interestErrors[`numberOfErrors`] = `You must only pick 4 topics.`;
	} else {
		interestErrors[`noErrors`] = `Yes`;
	}
	if (sexualOrientation === undefined) {
		sexualOrientationErrors[`noSelection`] = `This field cannot be empty.`;
	} else {
		sexualOrientationErrors[`noErrors`] = `Yes`;
	}
	if (agePreferenceErrors === undefined) {
		agePreferenceErrors[`noSelection`] = `This field cannot be empty`;
	} else {
		agePreferenceErrors[`noErrors`] = `Yes`;
	}
	if (bioErrors.noErrors === `No` || interestErrors.noErrors === `No` || sexualOrientationErrors.noErrors === `No` || agePreferenceErrors.noErrors === `No`) {
		let errors = [
			bioErrors,
			sexualOrientationErrors,
			agePreferenceErrors,
			interestErrors
		];
		console.log(errors);
		res.render(`setupProfile`, {
			title : `Setup Profile`,
			loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
			errorMessages : errors
		});
	}
	else {
		let queryStuff = [interests[0], interests[1], interests[2], interests[3], `0`, sexualOrientation, agePreference, biography, req.session.userID];
		let interestQuery = `UPDATE users SET interest1 = ?, interest2 = ?, interest3 = ?, interest4 = ?, firstLogin = ?, sexualOrientation = ?, agePreference = ?, biography = ? WHERE id = ?`;
		connection.query(interestQuery, queryStuff, (err, results)  => {
			if (err){
				console.log(err);
				throw(err);
			}
			else {
				res.redirect('/users');
			}
		});
	}
});
module.exports = router;