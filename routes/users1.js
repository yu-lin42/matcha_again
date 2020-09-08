var express = require('express');
var router = express.Router();
var connection = require('../dbc').connection;

const mysql = require('../test');

// function measureDistance(lat1, lon1, lat2, lon2, unit) {
// 	if ((lat1 == lat2) && (lon1 == lon2)) {
// 		return 0;
// 	}
// 	else {
// 		var radlat1 = Math.PI * lat1/180;
// 		var radlat2 = Math.PI * lat2/180;
// 		var theta = lon1-lon2;
// 		var radtheta = Math.PI * theta/180;
// 		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
// 		if (dist > 1) {
// 			dist = 1;
// 		}
// 		dist = Math.acos(dist);
// 		dist = dist * 180/Math.PI;
// 		dist = dist * 60 * 1.1515;
// 		if (unit=="K") { dist = dist * 1.609344 }
// 		// if (unit=="N") { dist = dist * 0.8684 }
// 		return dist;
// 	}
// }
/* GET users listing. */
// router.post('/location', (req, res) => {
// 	id = req.session.userID;
// 	latitude = req.body.lat;
// 	longitude = req.body.lon;
// 	cityname = req.body.cityname;
// 	console.log(cityname);
// 	// timestamp = req.body.timestamp;
// 	console.log(req.body);
// 	let userLocation = [latitude, longitude, cityname, id];
// 	let updateUserLocation = `UPDATE users SET latitude = ?, longitude = ?, city = ? WHERE id = ?`;
// 	connection.query(updateUserLocation, userLocation, (err) => {
// 		if (err) {
// 			throw err;
// 		}
// 		else {
// 			console.log('User location updated');
// 		}
// 	});
// });

router.get('/', (req, res, next) => {
	// let lat1 = -26.698866;
	// let lon1 = 27.84233;
	// let lat2 = -26.205178;
	// let lon2 = 28.042372;
	// let distance = measureDistance(lat1, lon1, lat2, lon2, "K");
	// console.log(Math.round(distance) + "KM away");
	id = req.session.userID;
	let selectValues = `id, username, firstLogin, interest1, interest2, interest3, interest4, 
	sexualOrientation, name, surname, age, gender, agePreference, biography, city, rating`;
	let displayUsersQuery = `SELECT ${selectValues} FROM users`;
	console.log("ANYTHING AFTER HERE???");

	async function findMatchingPeople() {
		const connection = await mysql.connection();
		try {
			let username = await connection.query(`SELECT username FROM users WHERE id = ?`, [id]);
			let likeData = await connection.query(`SELECT * FROM connections WHERE username = ?`, [username[0].username]);
			console.log(likedata);
			return(likeData);
		}
		catch (err) {
			await connection.query('ROLLBACK');
			throw (err);
		}
		finally {
			connection.release();
		}
	}
	async function bypassDisliked() {
		const connection = await mysql.connection();
		try {
			let username = await connection.query(`SELECT username FROM users WHERE id = ?`, [id]);
			let disklikeData = await connection.query(`SELECT * FROM dislikes WHERE username = ?`, [username[0].username]);
			return(disklikeData);
		}
		catch (err) {
			await connection.query('ROLLBACK');
			throw err;
		}
		finally {
			connection.release();
		}
	}
	// connection.query(getLikesQuery, (err, likeData) => {

	// 	connection.query(getDislikesQuery, (err, dislikeData) => {

	// 		connection.query(getUsersQuery, (err, users) => {
	// 			//fancy logic with likeData, dislikeData, and users;
	// 		})
	// 	})
	// })
	connection.query(displayUsersQuery, (err, results) => {
		if (err) {
			throw err;
		}
		else {
			let dataArray = [];
			let userDataArray = [];
			let foundLiked = [];
			let foundDisliked = [];
			console.log("what???");
			bypassDisliked().then((dislikedObject) => {
				dislikedObject.forEach((dislikeData) => {
					if (foundDisliked.includes(dislikeData.usernameOfDisliked)) {
						return;
					}
					else {
						foundDisliked.push(dislikeData.usernameOfDisliked);
					}
			findMatchingPeople()
			.then((likeObject) => {
				likeObject.forEach((likeData) => {
					if (foundLiked.includes(likeData.usernameOfLiked)) {
						return;
					}
					else {
						foundLiked.push(likeData.usernameOfLiked);
						// console.log(foundLiked);
					}
				});
				console.log(results);
				results.forEach(function(data){
					if (foundLiked.includes(data.username) || foundDisliked.includes(data.username)) {
						return;
					}
					if (data.id !== id) {
						let array = {
							id: data.id,
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
							id: data.id,
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

				let otherUsersDataArray = dataArray.filter(
					(data) => {
						if (userDataArray[0].agePreference === '18-25' && (data.age >= 18 && data.age <= 25)) {
							if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'male') && (data.sexualOrientation === 'straight')){
								return True;
							}
							// female user looking for females
							else if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'lesbian') && (data.gender === 'female') && (data.sexualOrientation === 'lesbian')) {
								return True;
							}
							// male user looking for females
							else if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'female') && (data.sexualOrientation === 'straight')) {
								return True;
							}
							// male user looking for males
							else if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'gay') && (data.gender === 'male') && (data.sexualOrientation === 'gay')) {
								return True;
							}
						}
						else if (userDataArray[0].agePreference === '25-30' && (data.age >= 25 && data.age <= 30)) {
							// female user looking for males
							if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'male') && (data.sexualOrientation === 'straight')){
								return True;
							}
							// female user looking for females
							if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'lesbian') && (data.gender === 'female') && (data.sexualOrientation === 'lesbian')) {
								return True;
							}
							// male user looking for females
							if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'female') && (data.sexualOrientation === 'straight')) {
								return True;
							}
							// male user looking for males
							if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'gay') && (data.gender === 'male') && (data.sexualOrientation === 'gay')) {
								return True;
							}
						}
						else if (userDataArray[0].agePreference === '30-35' && (data.age >= 30 && data.age <= 35)) {
							// female user looking for males
							if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'male') && (data.sexualOrientation === 'straight')){
								return True;
							}
							// female user looking for females
							if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'lesbian') && (data.gender === 'female') && (data.sexualOrientation === 'lesbian')) {
								return True;
							}
							// male user looking for females
							if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'female') && (data.sexualOrientation === 'straight')) {
								return True;
							}
							// male user looking for males
							if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'gay') && (data.gender === 'male') && (data.sexualOrientation === 'gay')) {
								return True;
							}
						}
						else if (userDataArray[0].agePreference === '35+' && data.age >= 35) {
						// female user looking for males
							if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'male') && (data.sexualOrientation === 'straight')){
								return True;
							}
							// female user looking for females
							if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'lesbian') && (data.gender === 'female') && (data.sexualOrientation === 'lesbian')) {
								return True;
							}
							// male user looking for females
							if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'female') && (data.sexualOrientation === 'straight')) {
								return True;
							}
							// male user looking for males
							if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'gay') && (data.gender === 'male') && (data.sexualOrientation === 'gay')) {
								return True;
							}
						}
						return False;
					}
				);
				
				// console.log(userDataArray);
				console.log('Getting values');
				res.render('users', {
					title : 'Users',
					loginStatus: req.session.userID ? 'logged_in' : 'logged_out',
					id : id,
					otherUsersData : otherUsersDataArray,
					userData : userDataArray[0]
				});
			})
			.catch((err) => {
				console.log(err)
			});
		});
	}).catch((problem) => {
		console.log(problem);
	})
		}
	});
});

router.post('/viewed', (req, res) => {
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
			// console.log(updateValues);
			async function updateViews() {
				const connection = await mysql.connection();
				try {
					await connection.query('START TRANSACTION');
					await connection.query(updateViewedQuery, updateValues);
					await connection.query('COMMIT');
				}
				catch (err) {
					await connection.query('ROLLBACK');
					throw (err);
				}
				finally {
					connection.release();
				}
			}
			updateViews()
			.then(() => {
				res.render('/users');
			})
			.catch((err) => {
				console.log(err);
			});
			console.log('Updated users table with whom you where viewed by');
		}
	});
});

router.post('/like', (req, res) => {
	userId = req.session.userID;
	likedId = req.query.likedId;
	// console.log(req.query.liked);

	let increaseRating = `UPDATE users SET rating = (rating + 1) WHERE username = ?`;
	connection.query(increaseRating, likedId, (err) => {
		if (err) {
			throw err;
		}
		else {
			console.log('Increased rating');
		}
	});
	let matching = `INSERT INTO connections (username, usernameOfLiked, matched) VALUES (?, ?, ?)`
	let values = [userId, likedId, 0];
	connection.query(matching, values, (err) => {
		if (err) {
			throw err;
		}
		else {
			console.log('added to connections');
		}
	});
	let ifMatched = `SELECT username, usernameOfLiked FROM connections WHERE (usernameOfLiked = ? AND username = ?) OR (usernameOfLiked = ? AND username = ?)`;
	let matchedValues = [userId, likedId, likedId, userId];
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
			}
			else {
				console.log("Nope");
				res.redirect('/users');
			}
		}
	})
});


router.post('/dislike', (req, res) => {
	// username = req.query.username;
	// disliked = req.query.disliked;
	userId = req.session.userID;
	dislikedId = req.query.dislikeId; 
	let dislikeQuery = `INSERT INTO dislikes (username, usernameOfDisliked) VALUES (?, ?)`
	let values = [userId, dislikedId];
	connection.query(dislikeQuery, values, (err) => {
		if (err) {
			throw err;
		}
		else {
			console.log('added to dislikes');
		}
	});
	let decreaseRating = `UPDATE users SET rating = (rating - 1) WHERE username = ?`;
	connection.query(decreaseRating, dislikedId, (err) => {
		if (err) {
			throw err;
		}
		else {
			console.log('Decreased rating');
		}
	});
	async function updateDislikes() {
		const connection = await mysql.connection();
		try {
			await connection.quer('START TRANSACTION');
			let dislikeFound = await connection.query(`SELECT COUNT (*) FROM dislikes WHERE username = ? AND usernameOfLiked`);
			await connection.query(dislikeQuery, values);
			await connection.query(decreaseRating, disliked);
			await connection.query('COMMIT');
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
			throw err;
		}
		finally {
			connection.release();
		}
		
	}

	res.redirect('/users');
});

module.exports = router;

// dataArray.forEach(function(data){
				// 	if (userDataArray[0].agePreference === '18-25' && (data.age >= 18 && data.age <= 25)) {
				// // female user looking for males
				// 		if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'male') && (data.sexualOrientation === 'straight')){
				// 			let array = {
				// 				id: data.id,
				// 				username : data.username,
				// 				interest1 : data.interest1,
				// 				interest2 : data.interest2,
				// 				interest3 : data.interest3,
				// 				interest4 : data.interest4,
				// 				sexualOrientation : data.sexualOrientation,
				// 				name : data.name,
				// 				surname : data.surname,
				// 				age : data.age,
				// 				gender : data.gender,
				// 				agePreference : data.agePreference,
				// 				biography : data.biography,
				// 				city : data.city,
				// 				rating : data.rating
				// 			};
				// 			otherUsersDataArray.push(array);
				// 		}
				// // female user looking for females
				// 		if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'lesbian') && (data.gender === 'female') && (data.sexualOrientation === 'lesbian')) {
				// 			let array = {
				// 				id: data.id,
				// 				username : data.username,
				// 				interest1 : data.interest1,
				// 				interest2 : data.interest2,
				// 				interest3 : data.interest3,
				// 				interest4 : data.interest4,
				// 				sexualOrientation : data.sexualOrientation,
				// 				name : data.name,
				// 				surname : data.surname,
				// 				age : data.age,
				// 				gender : data.gender,
				// 				agePreference : data.agePreference,
				// 				biography : data.biography,
				// 				city : data.city,
				// 				rating : data.rating
				// 			};
				// 			otherUsersDataArray.push(array);
				// 		}
				// // male user looking for females
				// 		if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'female') && (data.sexualOrientation === 'straight')) {
				// 			let array = {
				// 				id: data.id,
				// 				username : data.username,
				// 				interest1 : data.interest1,
				// 				interest2 : data.interest2,
				// 				interest3 : data.interest3,
				// 				interest4 : data.interest4,
				// 				sexualOrientation : data.sexualOrientation,
				// 				name : data.name,
				// 				surname : data.surname,
				// 				age : data.age,
				// 				gender : data.gender,
				// 				agePreference : data.agePreference,
				// 				biography : data.biography,
				// 				city : data.city,
				// 				rating : data.rating
				// 			};
				// 			otherUsersDataArray.push(array);
				// 		}
				// // male user looking for males
				// 		if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'gay') && (data.gender === 'male') && (data.sexualOrientation === 'gay')) {
				// 			let array = {
				// 				id: data.id,
				// 				username : data.username,
				// 				interest1 : data.interest1,
				// 				interest2 : data.interest2,
				// 				interest3 : data.interest3,
				// 				interest4 : data.interest4,
				// 				sexualOrientation : data.sexualOrientation,
				// 				name : data.name,
				// 				surname : data.surname,
				// 				age : data.age,
				// 				gender : data.gender,
				// 				agePreference : data.agePreference,
				// 				biography : data.biography,
				// 				city : data.city,
				// 				rating : data.rating
				// 			};
				// 			otherUsersDataArray.push(array);
				// 		}
				// 	}
				// 	else if (userDataArray[0].agePreference === '25-30' && (data.age >= 25 && data.age <= 30)) {
				// 	// female user looking for males
				// 		if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'male') && (data.sexualOrientation === 'straight')){
				// 			let array = {
				// 				id: data.id,
				// 				username : data.username,
				// 				interest1 : data.interest1,
				// 				interest2 : data.interest2,
				// 				interest3 : data.interest3,
				// 				interest4 : data.interest4,
				// 				sexualOrientation : data.sexualOrientation,
				// 				name : data.name,
				// 				surname : data.surname,
				// 				age : data.age,
				// 				gender : data.gender,
				// 				agePreference : data.agePreference,
				// 				biography : data.biography,
				// 				city : data.city,
				// 				rating : data.rating
				// 			};
				// 			otherUsersDataArray.push(array);
				// 		}
				// 	// female user looking for females
				// 		if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'lesbian') && (data.gender === 'female') && (data.sexualOrientation === 'lesbian')) {
				// 			let array = {
				// 				id: data.id,
				// 				username : data.username,
				// 				interest1 : data.interest1,
				// 				interest2 : data.interest2,
				// 				interest3 : data.interest3,
				// 				interest4 : data.interest4,
				// 				sexualOrientation : data.sexualOrientation,
				// 				name : data.name,
				// 				surname : data.surname,
				// 				age : data.age,
				// 				gender : data.gender,
				// 				agePreference : data.agePreference,
				// 				biography : data.biography,
				// 				city : data.city,
				// 				rating : data.rating
				// 			};
				// 			otherUsersDataArray.push(array);
				// 		}
				// 	// male user looking for females
				// 		if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'female') && (data.sexualOrientation === 'straight')) {
				// 			let array = {
				// 				id: data.id,
				// 				username : data.username,
				// 				interest1 : data.interest1,
				// 				interest2 : data.interest2,
				// 				interest3 : data.interest3,
				// 				interest4 : data.interest4,
				// 				sexualOrientation : data.sexualOrientation,
				// 				name : data.name,
				// 				surname : data.surname,
				// 				age : data.age,
				// 				gender : data.gender,
				// 				agePreference : data.agePreference,
				// 				biography : data.biography,
				// 				city : data.city,
				// 				rating : data.rating
				// 			};
				// 			otherUsersDataArray.push(array);
				// 		}
				// 	// male user looking for males
				// 		if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'gay') && (data.gender === 'male') && (data.sexualOrientation === 'gay')) {
				// 			let array = {
				// 				id: data.id,
				// 				username : data.username,
				// 				interest1 : data.interest1,
				// 				interest2 : data.interest2,
				// 				interest3 : data.interest3,
				// 				interest4 : data.interest4,
				// 				sexualOrientation : data.sexualOrientation,
				// 				name : data.name,
				// 				surname : data.surname,
				// 				age : data.age,
				// 				gender : data.gender,
				// 				agePreference : data.agePreference,
				// 				biography : data.biography,
				// 				city : data.city,
				// 				rating : data.rating
				// 			};
				// 			otherUsersDataArray.push(array);
				// 		}
				// 	}
				// 	else if (userDataArray[0].agePreference === '30-35' && (data.age >= 30 && data.age <= 35)) {
				// 		// female user looking for males
				// 		if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'male') && (data.sexualOrientation === 'straight')){
				// 			let array = {
				// 				id: data.id,
				// 				username : data.username,
				// 				interest1 : data.interest1,
				// 				interest2 : data.interest2,
				// 				interest3 : data.interest3,
				// 				interest4 : data.interest4,
				// 				sexualOrientation : data.sexualOrientation,
				// 				name : data.name,
				// 				surname : data.surname,
				// 				age : data.age,
				// 				gender : data.gender,
				// 				agePreference : data.agePreference,
				// 				biography : data.biography,
				// 				city : data.city,
				// 				rating : data.rating
				// 			};
				// 			otherUsersDataArray.push(array);
				// 		}
				// 		// female user looking for females
				// 		if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'lesbian') && (data.gender === 'female') && (data.sexualOrientation === 'lesbian')) {
				// 			let array = {
				// 				id: data.id,
				// 				username : data.username,
				// 				interest1 : data.interest1,
				// 				interest2 : data.interest2,
				// 				interest3 : data.interest3,
				// 				interest4 : data.interest4,
				// 				sexualOrientation : data.sexualOrientation,
				// 				name : data.name,
				// 				surname : data.surname,
				// 				age : data.age,
				// 				gender : data.gender,
				// 				agePreference : data.agePreference,
				// 				biography : data.biography,
				// 				city : data.city,
				// 				rating : data.rating
				// 			};
				// 			otherUsersDataArray.push(array);
				// 		}
				// 		// male user looking for females
				// 		if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'female') && (data.sexualOrientation === 'straight')) {
				// 			let array = {
				// 				id: data.id,
				// 				username : data.username,
				// 				interest1 : data.interest1,
				// 				interest2 : data.interest2,
				// 				interest3 : data.interest3,
				// 				interest4 : data.interest4,
				// 				sexualOrientation : data.sexualOrientation,
				// 				name : data.name,
				// 				surname : data.surname,
				// 				age : data.age,
				// 				gender : data.gender,
				// 				agePreference : data.agePreference,
				// 				biography : data.biography,
				// 				city : data.city,
				// 				rating : data.rating
				// 			};
				// 			otherUsersDataArray.push(array);
				// 		}
				// 		// male user looking for males
				// 		if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'gay') && (data.gender === 'male') && (data.sexualOrientation === 'gay')) {
				// 			let array = {
				// 				id: data.id,
				// 				username : data.username,
				// 				interest1 : data.interest1,
				// 				interest2 : data.interest2,
				// 				interest3 : data.interest3,
				// 				interest4 : data.interest4,
				// 				sexualOrientation : data.sexualOrientation,
				// 				name : data.name,
				// 				surname : data.surname,
				// 				age : data.age,
				// 				gender : data.gender,
				// 				agePreference : data.agePreference,
				// 				biography : data.biography,
				// 				city : data.city,
				// 				rating : data.rating
				// 			};
				// 			otherUsersDataArray.push(array);
				// 		}
				// 	}
				// 	else  if (userDataArray[0].agePreference === '35+' && data.age >= 35) {
				// 	// female user looking for males
				// 		if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'male') && (data.sexualOrientation === 'straight')){
				// 			let array = {
				// 				id: data.id,
				// 				username : data.username,
				// 				interest1 : data.interest1,
				// 				interest2 : data.interest2,
				// 				interest3 : data.interest3,
				// 				interest4 : data.interest4,
				// 				sexualOrientation : data.sexualOrientation,
				// 				name : data.name,
				// 				surname : data.surname,
				// 				age : data.age,
				// 				gender : data.gender,
				// 				agePreference : data.agePreference,
				// 				biography : data.biography,
				// 				city : data.city,
				// 				rating : data.rating
				// 			};
				// 			otherUsersDataArray.push(array);
				// 		}
				// 		// female user looking for females
				// 		if ((userDataArray[0].gender === 'female') && (userDataArray[0].sexualOrientation === 'lesbian') && (data.gender === 'female') && (data.sexualOrientation === 'lesbian')) {
				// 			let array = {
				// 				id: data.id,
				// 				username : data.username,
				// 				interest1 : data.interest1,
				// 				interest2 : data.interest2,
				// 				interest3 : data.interest3,
				// 				interest4 : data.interest4,
				// 				sexualOrientation : data.sexualOrientation,
				// 				name : data.name,
				// 				surname : data.surname,
				// 				age : data.age,
				// 				gender : data.gender,
				// 				agePreference : data.agePreference,
				// 				biography : data.biography,
				// 				city : data.city,
				// 				rating : data.rating
				// 			};
				// 			otherUsersDataArray.push(array);
				// 		}
				// 		// male user looking for females
				// 		if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'straight') && (data.gender === 'female') && (data.sexualOrientation === 'straight')) {
				// 			let array = {
				// 				id: data.id,
				// 				username : data.username,
				// 				interest1 : data.interest1,
				// 				interest2 : data.interest2,
				// 				interest3 : data.interest3,
				// 				interest4 : data.interest4,
				// 				sexualOrientation : data.sexualOrientation,
				// 				name : data.name,
				// 				surname : data.surname,
				// 				age : data.age,
				// 				gender : data.gender,
				// 				agePreference : data.agePreference,
				// 				biography : data.biography,
				// 				city : data.city,
				// 				rating : data.rating
				// 			};
				// 			otherUsersDataArray.push(array);
				// 		}
				// 		// male user looking for males
				// 		if ((userDataArray[0].gender === 'male') && (userDataArray[0].sexualOrientation === 'gay') && (data.gender === 'male') && (data.sexualOrientation === 'gay')) {
				// 			let array = {
				// 				id: data.id,
				// 				username : data.username,
				// 				interest1 : data.interest1,
				// 				interest2 : data.interest2,
				// 				interest3 : data.interest3,
				// 				interest4 : data.interest4,
				// 				sexualOrientation : data.sexualOrientation,
				// 				name : data.name,
				// 				surname : data.surname,
				// 				age : data.age,
				// 				gender : data.gender,
				// 				agePreference : data.agePreference,
				// 				biography : data.biography,
				// 				city : data.city,
				// 				rating : data.rating
				// 			};
				// 			otherUsersDataArray.push(array);
				// 		}
				// 	}
				// });