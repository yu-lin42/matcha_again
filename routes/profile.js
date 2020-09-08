var express = require('express');
var router = express.Router();
var connection = require('../dbc').connection;
const mysql = require('../test');

router.get('/', (req, res, next) => {
	// check if firstTime is a thing
	console.log(req.session.userID);
	// function getNotifications() {
	// 	console.log('Testing');
	// }
	// setInterval(getNotifications, 1000);
	let checkFirstLoginArray = [req.session.userID];
	let selectValues = `username, firstLogin, interest1, interest2, interest3, interest4, 
	sexualOrientation, name, surname, age, gender, agePreference, biography, city, viewedBy, rating`
	let checkFirstLoginQuery = `SELECT ${selectValues} FROM users WHERE id = ?`;
	
	async function viewMatched() {
		const connection = await mysql.connection();
		try {
			let username = await connection.query(`SELECT username FROM users WHERE id = ?`, [req.session.userID]);
			let matchedData = await connection.query(`SELECT usernameOfLiked FROM connections WHERE username = ? AND matched = ?`, [username[0].username, 1]);
			// console.log(matchedData);
			return(matchedData);
		}
		catch (err) {
			await connection.query('ROLLBACK');
			throw err;
		}
		finally {
			connection.release();
		}
	}
	
	connection.query(checkFirstLoginQuery, checkFirstLoginArray, (err, results) => {
		if (err) {
			throw err;
		}
		else {
			let username = results[0].username;
			let name = results[0].name;
			let surname = results[0].surname;
			let age = results[0].age;
			let gender = results[0].gender;
			let biography = results[0].biography;
			let sexualOrientation = results[0].sexualOrientation;
			let agePreference = results[0].agePreference;
			let priorityArray = [{
				interest1 : '',
				interest2 : '',
				interest3 : '',
				interest4 : '',
			}];
			// console.log(results[0].viewedBy);
			let viewedBy = [];
			if (results[0].viewedBy !== null) {
				viewedBy = (results[0].viewedBy).split(",");
			}
			
			// console.log("its empty");
			// else {
				// }
			let rating = results[0].rating;
			let city = results[0].city;
			let foundMatched = [];

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
				viewMatched().then((matchedObject) => {
						matchedObject.forEach((matchedData) => {
						foundMatched.push(matchedData);
					})
					// console.log(foundMatched);
				
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
						sexualOrientation : sexualOrientation,
						agePreference : agePreference,
						biography : biography,
						city : city,
						viewedBy : viewedBy,
						rating : rating,
						matched : foundMatched
					});
				})
				.catch((err) => {
					console.log(err);
				});
				// res.render('profile', {
				// 	title: 'Profile',
				// 	loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
				// 	firstTimeSetup : 1,
				// 	priorityArray : priorityArray,
				// 	username : username,
				// 	name : name,
				// 	surname : surname,
				// 	age : age,
				// 	gender : gender,
				// 	sexualOrientation : sexualOrientation,
				// 	agePreference : agePreference,
				// 	biography : biography,
				// 	city : city,
				// 	viewedBy : viewedBy,
				// 	rating : rating,
				// 	// matched : foundMatched
				// });
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



