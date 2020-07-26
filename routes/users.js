var express = require('express');
var router = express.Router();
var connection = require('../dbc').connection;

/* GET users listing. */
router.get('/', (req, res, next) => {
	let selectValues = `username, firstLogin, interest1, interest2, interest3, interest4, 
	sexualOrientation, name, surname, age, gender, agePreference, biography`
	let displayUsersQuery = `SELECT ${selectValues} FROM users`;
	connection.query(displayUsersQuery, (err, results) => {
		if (err) {
			throw err;
		}
		else {
			console.log('Getting values');
			res.render('users', {
				title : 'Users',
				loginStatus: req.session.userID ? 'logged_in' : 'logged_out',
				userData : results
			});
		}
	});
});

module.exports = router;
