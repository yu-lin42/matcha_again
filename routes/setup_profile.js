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
				userdata : results
			});
		}
	});
});
router.post('/check', (req, res, next) => {
	interests = req.body.interests;
	sexualOrientation = req.body.sexualOrientation;
	agePreference = req.body.agePreference
	id = req.session.userID;
	let queryStuff = [interests[0], interests[1], interests[2], interests[3], `0`, sexualOrientation, agePreference, req.session.userID];
	let interestQuery = `UPDATE users SET interest1 = ?, interest2 = ?, interest3 = ?, interest4 = ?, firstLogin = ?, sexualOrientation = ?, agePreference = ? WHERE id = ?`;
	connection.query(interestQuery, queryStuff, (err, results)  => {
		if (err){
			console.log(err);
			throw(err);
		}
		else{
			res.redirect('/users');
		}
	});
});
module.exports = router;