var express = require('express');
var router = express.Router();
var connection = require('../dbc').connection;

router.get('/', (req, res, next) => {
	// check if firstTime is a thing
	console.log(req.session.userID);
	let checkFirstLoginArray = [req.session.userID];
	let selectValues = `username, firstLogin, interest1, interest2, interest3, interest4, 
	sexualOrientation, name, surname, age, gender`
	let checkFirstLoginQuery = `SELECT ${selectValues} FROM users WHERE id = ?`;
	connection.query(checkFirstLoginQuery, checkFirstLoginArray, (err, results) => {
		// console.log(results[0].firstLogin);
		if (err) {
			throw err;
		}
		else {
			let username = results[0].username;
			let name = results[0].name;
			let surname = results[0].surname;
			let age = results[0].age;
			let gender = results[0].gender;
			let sexualPref = results[0].sexualOrientation;
			// let sexualPref = results[0].sexualOrientation;
			let priorityArray = [{
				interest1 : '',
				interest2 : '',
				interest3 : '',
				interest4 : '',
			}];
			// console.log(results[0].interest1);
			// console.log(results[0].interest2);
			// console.log(results[0].interest3);
			// console.log(results[0].interest4);
			// console.log(results[0].firstLogin)
			if (results[0].firstLogin === 0) {
				if (results[0].interest1 !== null) {
					priorityArray[0].interest1 = results[0].interest1;
					// console.log(results[0].interest1);
				}
				if (results[0].interest2 !== null) {
					priorityArray[0].interest2 = results[0].interest2;
				}
				if (results[0].interest3 !== null) {
					priorityArray[0].interest3 = results[0].interest3;
				}
				if (results[0].interest4 !== null) {
					priorityArray[0].interest4 = results[0].interest4;
				}
				// if (results[0].interest1 === null) {
				// 	priorityArray[0].interest1 = 0;
				// }
				// else if (results[0].interest1 !== null) {
				// 	priorityArray[0].interest1 = 1;
				// }
				// if (results[0].interest2 === null) {
				// 	priorityArray[0].interest2 = 0;
				// }
				// else if (results[0].interest2 !== null) {
				// 	priorityArray[0].interest2 = 1;
				// }
				// if (results[0].interest3 === null) {
				// 	priorityArray[0].interest3 = 0;
				// }
				// else if (results[0].interest3 !== null) {
				// 	priorityArray[0].interest3 = 1;
				// }
				// if (results[0].interest4 === null) {
				// 	priorityArray[0].interest4 = 0;
				// }
				// else if (results[0].interest4 !== null) {
				// 	priorityArray[0].interest4 = 1;
				// }
				res.render('profile', {
					title: 'Profile',
					loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
					firstTimeSetup : 1,
					priorityArray : priorityArray,
					username : username,
					name : name,
					surname : surname,
					age : age,
					gender : gender,
					sexualPref : sexualPref
				});
			}
			else if (results[0].firstLogin === 1) {
				res.render('profile', {
					title: 'Profile',
					loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
					firstTimeSetup : 0,
					priorityArray : []
				});
			}
		}
	});
});

module.exports = router;
