var express = require('express');
var router = express.Router();
var connection = require('../dbc').connection;

const mysql = require('../test');

function measureDistance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		// if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}
/* GET users listing. */
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

router.get('/', (req, res, next) => {
	// let lat1 = -26.698866;
	// let lon1 = 27.84233;
	// let lat2 = -26.205178;
	// let lon2 = 28.042372;
	// let distance = measureDistance(lat1, lon1, lat2, lon2, "K");
	// console.log(Math.round(distance) + "KM away");
	id = req.session.userID;
	let selectValues = `id, username, firstLogin, interest1, interest2, interest3, interest4, 
	sexualOrientation, name, surname, age, gender, agePreference, biography, city, rating`
	let displayUsersQuery = `SELECT ${selectValues} FROM users`;
	connection.query(displayUsersQuery, (err, results) => {
		if (err) {
			throw err;
		}
		else {
			let dataArray = [];
			let userDataArray = [];
			results.forEach(function(data){
				// seperate the other users from the current user
				if (data.id !== id) {
					let array = {
						username : data.username,
						interest1 : data.interest1,
						interest2 : data.interest2,
						interest3 : data.interest3,
						interest4 : data.interest4,
						sexualOrientation : data.sexualOrientation,
						name : data.name,
						surname : data.surname,
						age : data.age,
						gender : data.gender,
						agePreference : data.agePreference,
						biography : data.biography,
						city : data.city,
						rating : data.rating
					};
					dataArray.push(array);
				}
				// the current user
				else {
					let array = {
						username : data.username,
						interest1 : data.interest1,
						interest2 : data.interest2,
						interest3 : data.interest3,
						interest4 : data.interest4,
						sexualOrientation : data.sexualOrientation,
						name : data.name,
						surname : data.surname,
						age : data.age,
						gender : data.gender,
						agePreference : data.agePreference,
						biography : data.biography,
						city : data.city,
						rating : data.rating
					};
					userDataArray.push(array);
				}
			});
			// pick out users according to preference
			let otherUsersDataArray = [];
			dataArray.forEach(function(data){
				if (userDataArray[0].agePreference === '18-25' && (data.age >= 18 && data.age <= 25)) {
					// female user looking for males
					if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'male') && (data.sexualOrientation === 'straight')){
						let array = {
							username : data.username,
							interest1 : data.interest1,
							interest2 : data.interest2,
							interest3 : data.interest3,
							interest4 : data.interest4,
							sexualOrientation : data.sexualOrientation,
							name : data.name,
							surname : data.surname,
							age : data.age,
							gender : data.gender,
							agePreference : data.agePreference,
							biography : data.biography,
							city : data.city,
							rating : data.rating
						};
						otherUsersDataArray.push(array);
					}
					// female user looking for females
					if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'lesbian') && (data.gender === 'female') && (data.sexualOrientation === 'lesbian')) {
						let array = {
							username : data.username,
							interest1 : data.interest1,
							interest2 : data.interest2,
							interest3 : data.interest3,
							interest4 : data.interest4,
							sexualOrientation : data.sexualOrientation,
							name : data.name,
							surname : data.surname,
							age : data.age,
							gender : data.gender,
							agePreference : data.agePreference,
							biography : data.biography,
							city : data.city,
							rating : data.rating
						};
						otherUsersDataArray.push(array);
					}
					// male user looking for females
					if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'female') && (data.sexualOrientation === 'straight')) {
						let array = {
							username : data.username,
							interest1 : data.interest1,
							interest2 : data.interest2,
							interest3 : data.interest3,
							interest4 : data.interest4,
							sexualOrientation : data.sexualOrientation,
							name : data.name,
							surname : data.surname,
							age : data.age,
							gender : data.gender,
							agePreference : data.agePreference,
							biography : data.biography,
							city : data.city,
							rating : data.rating
						};
						otherUsersDataArray.push(array);
					}
					// male user looking for males
					if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'gay') && (data.gender === 'male') && (data.sexualOrientation === 'gay')) {
						let array = {
							username : data.username,
							interest1 : data.interest1,
							interest2 : data.interest2,
							interest3 : data.interest3,
							interest4 : data.interest4,
							sexualOrientation : data.sexualOrientation,
							name : data.name,
							surname : data.surname,
							age : data.age,
							gender : data.gender,
							agePreference : data.agePreference,
							biography : data.biography,
							city : data.city,
							rating : data.rating
						};
						otherUsersDataArray.push(array);
					}
				}
				else if (userDataArray[0].agePreference === '25-30' && (data.age >= 25 && data.age <= 30)) {
					// female user looking for males
					if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'male') && (data.sexualOrientation === 'straight')){
						let array = {
							username : data.username,
							interest1 : data.interest1,
							interest2 : data.interest2,
							interest3 : data.interest3,
							interest4 : data.interest4,
							sexualOrientation : data.sexualOrientation,
							name : data.name,
							surname : data.surname,
							age : data.age,
							gender : data.gender,
							agePreference : data.agePreference,
							biography : data.biography,
							city : data.city,
							rating : data.rating
						};
						otherUsersDataArray.push(array);
					}
					// female user looking for females
					if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'lesbian') && (data.gender === 'female') && (data.sexualOrientation === 'lesbian')) {
						let array = {
							username : data.username,
							interest1 : data.interest1,
							interest2 : data.interest2,
							interest3 : data.interest3,
							interest4 : data.interest4,
							sexualOrientation : data.sexualOrientation,
							name : data.name,
							surname : data.surname,
							age : data.age,
							gender : data.gender,
							agePreference : data.agePreference,
							biography : data.biography,
							city : data.city,
							rating : data.rating
						};
						otherUsersDataArray.push(array);
					}
					// male user looking for females
					if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'female') && (data.sexualOrientation === 'straight')) {
						let array = {
							username : data.username,
							interest1 : data.interest1,
							interest2 : data.interest2,
							interest3 : data.interest3,
							interest4 : data.interest4,
							sexualOrientation : data.sexualOrientation,
							name : data.name,
							surname : data.surname,
							age : data.age,
							gender : data.gender,
							agePreference : data.agePreference,
							biography : data.biography,
							city : data.city,
							rating : data.rating
						};
						otherUsersDataArray.push(array);
					}
					// male user looking for males
					if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'gay') && (data.gender === 'male') && (data.sexualOrientation === 'gay')) {
						let array = {
							username : data.username,
							interest1 : data.interest1,
							interest2 : data.interest2,
							interest3 : data.interest3,
							interest4 : data.interest4,
							sexualOrientation : data.sexualOrientation,
							name : data.name,
							surname : data.surname,
							age : data.age,
							gender : data.gender,
							agePreference : data.agePreference,
							biography : data.biography,
							city : data.city,
							rating : data.rating
						};
						otherUsersDataArray.push(array);
					}
				}
				else if (userDataArray[0].agePreference === '30-35' && (data.age >= 30 && data.age <= 35)) {
					// female user looking for males
					if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'male') && (data.sexualOrientation === 'straight')){
						let array = {
							username : data.username,
							interest1 : data.interest1,
							interest2 : data.interest2,
							interest3 : data.interest3,
							interest4 : data.interest4,
							sexualOrientation : data.sexualOrientation,
							name : data.name,
							surname : data.surname,
							age : data.age,
							gender : data.gender,
							agePreference : data.agePreference,
							biography : data.biography,
							city : data.city,
							rating : data.rating
						};
						otherUsersDataArray.push(array);
					}
					// female user looking for females
					if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'lesbian') && (data.gender === 'female') && (data.sexualOrientation === 'lesbian')) {
						let array = {
							username : data.username,
							interest1 : data.interest1,
							interest2 : data.interest2,
							interest3 : data.interest3,
							interest4 : data.interest4,
							sexualOrientation : data.sexualOrientation,
							name : data.name,
							surname : data.surname,
							age : data.age,
							gender : data.gender,
							agePreference : data.agePreference,
							biography : data.biography,
							city : data.city,
							rating : data.rating
						};
						otherUsersDataArray.push(array);
					}
					// male user looking for females
					if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'female') && (data.sexualOrientation === 'straight')) {
						let array = {
							username : data.username,
							interest1 : data.interest1,
							interest2 : data.interest2,
							interest3 : data.interest3,
							interest4 : data.interest4,
							sexualOrientation : data.sexualOrientation,
							name : data.name,
							surname : data.surname,
							age : data.age,
							gender : data.gender,
							agePreference : data.agePreference,
							biography : data.biography,
							city : data.city,
							rating : data.rating
						};
						otherUsersDataArray.push(array);
					}
					// male user looking for males
					if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'gay') && (data.gender === 'male') && (data.sexualOrientation === 'gay')) {
						let array = {
							username : data.username,
							interest1 : data.interest1,
							interest2 : data.interest2,
							interest3 : data.interest3,
							interest4 : data.interest4,
							sexualOrientation : data.sexualOrientation,
							name : data.name,
							surname : data.surname,
							age : data.age,
							gender : data.gender,
							agePreference : data.agePreference,
							biography : data.biography,
							city : data.city,
							rating : data.rating
						};
						otherUsersDataArray.push(array);
					}
				}
				else  if (userDataArray[0].agePreference === '35+' && data.age >= 35) {
				// female user looking for males
					if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'male') && (data.sexualOrientation === 'straight')){
						let array = {
							username : data.username,
							interest1 : data.interest1,
							interest2 : data.interest2,
							interest3 : data.interest3,
							interest4 : data.interest4,
							sexualOrientation : data.sexualOrientation,
							name : data.name,
							surname : data.surname,
							age : data.age,
							gender : data.gender,
							agePreference : data.agePreference,
							biography : data.biography,
							city : data.city,
							rating : data.rating
						};
						otherUsersDataArray.push(array);
					}
					// female user looking for females
					if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'lesbian') && (data.gender === 'female') && (data.sexualOrientation === 'lesbian')) {
						let array = {
							username : data.username,
							interest1 : data.interest1,
							interest2 : data.interest2,
							interest3 : data.interest3,
							interest4 : data.interest4,
							sexualOrientation : data.sexualOrientation,
							name : data.name,
							surname : data.surname,
							age : data.age,
							gender : data.gender,
							agePreference : data.agePreference,
							biography : data.biography,
							city : data.city,
							rating : data.rating
						};
						otherUsersDataArray.push(array);
					}
					// male user looking for females
					if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'female') && (data.sexualOrientation === 'straight')) {
						let array = {
							username : data.username,
							interest1 : data.interest1,
							interest2 : data.interest2,
							interest3 : data.interest3,
							interest4 : data.interest4,
							sexualOrientation : data.sexualOrientation,
							name : data.name,
							surname : data.surname,
							age : data.age,
							gender : data.gender,
							agePreference : data.agePreference,
							biography : data.biography,
							city : data.city,
							rating : data.rating
						};
						otherUsersDataArray.push(array);
					}
					// male user looking for males
					if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'gay') && (data.gender === 'male') && (data.sexualOrientation === 'gay')) {
						let array = {
							username : data.username,
							interest1 : data.interest1,
							interest2 : data.interest2,
							interest3 : data.interest3,
							interest4 : data.interest4,
							sexualOrientation : data.sexualOrientation,
							name : data.name,
							surname : data.surname,
							age : data.age,
							gender : data.gender,
							agePreference : data.agePreference,
							biography : data.biography,
							city : data.city,
							rating : data.rating
						};
						otherUsersDataArray.push(array);
					}
				}
			});
			// console.log(userDataArray);
			console.log('Getting values');
			res.render('users', {
				title : 'Users',
				loginStatus: req.session.userID ? 'logged_in' : 'logged_out',
				id : id,
				otherUsersData : otherUsersDataArray,
				userData : userDataArray[0]
			});
		}

	});
});

router.post('/viewed', (req, res) => {
	// console.log(req.query);
	username = req.query.user;
	view = req.query.view;
	
	let viewed = `INSERT INTO viewedby (username, viewedBy) VALUES (?, ?)`;
	let values = [view, username];
	connection.query(viewed, values, (err) => {
		if (err) {
			throw err;
		}
		else {
			console.log('Viewed by is known');
		}
	});
	// console.log(username);
	
	console.log("You, " + username + ", viewed " + view);
	let getViewedByQuery = `SELECT viewedBy, username FROM viewedby WHERE username = ?`;
	connection.query(getViewedByQuery, view, (err, results) => {
		if (err) {
			throw err;
		}
		else {
			console.log(results);
			let updateViewedQuery = `UPDATE users SET viewedBy = ? WHERE username = ?`;
			let usr = results[0].username;
			let viewedbyArray = [];
			results.forEach(function(data){
				viewedbyArray.push(data.viewedBy);
			});
			let string = viewedbyArray.toString();
			let updateValues = [string, usr];
			console.log(updateValues);
			connection.query(updateViewedQuery, updateValues, (err) => {
				if (err) {
					throw err;
				}
				else {
					console.log('Updated users table with whom you where viewed by');
				}
			});
		}
	});
});

router.post('/like', (req, res) => {
	username = req.query.username;
	liked = req.query.liked;
	console.log(req.query.liked);

	let increaseRating = `UPDATE users SET rating = (rating + 1) WHERE username = ?`;
	connection.query(increaseRating, liked, (err) => {
		if (err) {
			throw err;
		}
		else {
			console.log('Increased rating');
		}
	});
	// insertMatched(username, liked);
	let matching = `INSERT INTO connections (username, usernameOfLiked, matched) VALUES (?, ?, ?)`
	let values = [username, liked, 0];
	connection.query(matching, values, (err) => {
		if (err) {
			throw err;
		}
		else {
			console.log('added to connections');
		}
	});
	let ifMatched = `SELECT username, usernameOfLiked FROM connections WHERE (usernameOfLiked = ? AND username = ?) OR (usernameOfLiked = ? AND username = ?)`;
	let matchedValues = [username, liked, liked, username];
	connection.query(ifMatched, matchedValues, (err, results) => {
		if (err) {
			throw err;
		}
		else {
			let i = 1;
			if (i < results.length) {
				console.log("They should be connected");
				let user1 = results[0].username;
				let user2 = results[0].usernameOfLiked;
				let matched1 = `UPDATE connections SET matched = 1 WHERE (usernameOfLiked = ? AND username = ?)`;
				let values1 = [user1, user2];
				let matched2 = `UPDATE connections SET matched = 1 WHERE (usernameOfLiked = ? AND username = ?)`;
				let values2 = [user2, user1];
				async function updateLikes() {
					const connection = await mysql.connection();
					try {
						await connection.query('START TRANSACTION');
						await connection.query(matched1, values1);
						await connection.query(matched2, values2);
						await connection.query('COMMIT');
						console.log("HIIIIIIIIIIIIIIIIIII");
						res.render('users', {
							title : 'Users',
							loginStatus: req.session.userID ? 'logged_in' : 'logged_out',
							id : id,
							otherUsersData : otherUsersDataArray,
							userData : userDataArray[0]
						});
					}
					catch (err) {
						await connection.query('ROLLBACK');
						throw (err);
					}
					finally {
						connection.release();
					}

				}
				updateLikes();
				// connection.query(matched1, values1, (err) => {
				// 	if (err) {
				// 		throw err;
				// 	}
				// 	else {
				// 		console.log("user1");

				// 	}
				// });
				// connection.query(matched2, values2, (err) => {
				// 	if (err) {
				// 		throw err;
				// 	}
				// 	else {
				// 		console.log("user2");
				// 	}
				// });
			}
			else {
				console.log("Nope");
			}
			// console.log("They connected");
		}
	})
	// res.end;
});


router.post('/dislike', (req, res) => {
	disliked = req.query.username;
	let decreaseRating = `UPDATE users SET rating = (rating - 1) WHERE username = ?`;
	connection.query(decreaseRating, disliked, (err) => {
		if (err) {
			throw err;
		}
		else {
			console.log('Decreased rating');
		}
	});
});

module.exports = router;
