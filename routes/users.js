var express = require('express');
var router = express.Router();
var connection = require('../dbc').connection;

/* GET users listing. */
router.get('/', (req, res, next) => {
	id = req.session.userID;
	latitude = req.body.lat;
	longitude = req.body.lon;
	// timestamp = req.body.timestamp;
	// console.log(timestamp);

	let userLocation = [latitude, longitude, id];
	let updateUserLocation = `UPDATE users SET latitude = ?, longitude = ? WHERE id = ?`;
	connection.query(updateUserLocation, userLocation, (err) => {
		if (err) {
			throw err;
		}
		else {
			console.log('User location updated');
		}
	});

	let selectValues = `id, username, firstLogin, interest1, interest2, interest3, interest4, 
	sexualOrientation, name, surname, age, gender, agePreference, biography, city`
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
						city : data.city
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
							city : data.city
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
							city : data.city
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
							city : data.city
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
							city : data.city
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
							city : data.city
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
							city : data.city
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
							city : data.city
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
							city : data.city
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
							city : data.city
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
							city : data.city
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
							city : data.city
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
							city : data.city
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
							city : data.city
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
							city : data.city
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
							city : data.city
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
							city : data.city
						};
						otherUsersDataArray.push(array);
					}
				}
				
			});
			console.log('Getting values');
			res.render('users', {
				title : 'Users',
				loginStatus: req.session.userID ? 'logged_in' : 'logged_out',
				id : id,
				otherUsersData : otherUsersDataArray,
				userData : userDataArray
			});
		}

	});
});

// router.get()
router.post('/like', (req, res) => {
	// username = req.body.user;
	console.log("hello");
	// console.log(req.query);
	// res.redirect('/users');
});

module.exports = router;
