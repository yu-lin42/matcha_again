const mysql = require('./test');
var faker = require('faker');
var bcrypt = require('bcrypt');

let saltRounds = 10;
// let i = 0;
let genderArray = ["male", "female"];
let sexualOrientationArray = ["straight", "bisexual", "gay", "lesbian"];
let interestsArray = ["food", "books", "movies", "series", "anime", "music", "games", "sport", "gardening", "hiking", "camping", "cooking", "baking,", "dancing"];
// let highPriorityArray = ["food", "books", "movies", "series", "anime", "music", "games", "sport", "gardening", "hiking", "camping", "cooking", "baking,", "dancing"];
// let mediumPriorityArray = ["food", "books", "movies", "series", "anime", "music", "games", "sport", "gardening", "hiking", "camping", "cooking", "baking,", "dancing"];
// let lowPriorityArray = ["food", "books", "movies", "series", "anime", "music", "games", "sport", "gardening", "hiking", "camping", "cooking", "baking,", "dancing"];
let biographyArray = ['This is where you write things about yourself and I don\'t know else to write to fill this biography section'];
let agePrefArray = ["18-25", "25-30", "30-35", "35+"];
// let dataArray = [];

let generateUsers = () => {
	// while (i < 10) {
		let dataObject = {
			name : ``,
			surname : ``,
			email : ``,
			username : ``,
			notifications : 1,
			verified : 1,
			token : ``,
			password : ``,
			// resetToken : ``,
			age : ``,
			gender : ``,
			biography : ``,
			sexualOrientation : ``,
			agePreference : ``,
			interest1 : ``,
			interest2 : ``,
			interest3 : ``,
			interest4 : ``,
			// lowPriority : ``,
			// lowPriority2 : ``,
			city : ``,
			latitude : ``,
			longitude : ``,
			rating : ``,
			reported : ``,
			temporaryBan : ``,
			permanentBan : ``
		};
		dataObject.name = faker.fake("{{name.firstName}}");
		dataObject.surname = faker.fake("{{name.lastName}}");
		dataObject.email = faker.fake("{{internet.email}}");
		dataObject.username = faker.fake("{{internet.userName}}");
		let tokenHash = bcrypt.hashSync(dataObject.name, saltRounds);
		dataObject.token = tokenHash;
		let hash = bcrypt.hashSync(faker.fake("{{internet.password}}"), saltRounds);
		dataObject.password = hash
		dataObject.age = Math.floor(Math.random() * 52) + 18;
		dataObject.gender = genderArray[Math.floor(Math.random() * 3)];
		dataObject.biography = biographyArray;
		dataObject.agePreference = agePrefArray[Math.floor(Math.random() * 4)];
		dataObject.sexualOrientation = sexualOrientationArray[Math.floor(Math.random() * 4)];
		
		if (dataObject.gender === `male` && dataObject.sexualOrientation === `lesbian`) {
			while (dataObject.gender === `male` && dataObject.sexualOrientation === `lesbian`) {
				dataObject.sexualOrientation = sexualOrientationArray[Math.floor(Math.random() * 4)];
			}
		}
		if (dataObject.gender === `female` && dataObject.sexualOrientation === `gay`) {
			while (dataObject.gender === `female` && dataObject.sexualOrientation === `gay`) {
				dataObject.sexualOrientation = sexualOrientationArray[Math.floor(Math.random() * 4)];
			}
		}

		dataObject.interest1 = interestsArray[Math.floor(Math.random() * 14)];
		dataObject.interest2 = interestsArray[Math.floor(Math.random() * 14)];
		if (dataObject.interest2 === dataObject.interest1) {
			while (dataObject.interest2 === dataObject.interest1) {
				dataObject.interest2 = interestsArray[Math.floor(Math.random() * 14)];
			}
		}
		dataObject.interest3 = interestsArray[Math.floor(Math.random() * 14)];
		// dataObject.interest4 = interestsArray[Math.floor(Math.random() * 14)];
		if ((dataObject.interest3 === dataObject.interest2) || (dataObject.interest3 === dataObject.interest1)) {
			while ((dataObject.interest3 === dataObject.interest2) || (dataObject.interest3 === dataObject.interest1)) {
				dataObject.interest3 = interestsArray[Math.floor(Math.random() * 14)];
			}
		}
		dataObject.interest4 = interestsArray[Math.floor(Math.random() * 14)];
		// dataObject.interest4 = interestsArray[Math.floor(Math.random() * 14)];
		if ((dataObject.interest4 === dataObject.interest3) || (dataObject.interest4 === dataObject.interest2) || (dataObject.interest4 === dataObject.interest1)) {
			while ((dataObject.interest4 === dataObject.interest3) || (dataObject.interest4 === dataObject.interest2) || (dataObject.interest4 === dataObject.interest1)) {
				dataObject.interest4 = interestsArray[Math.floor(Math.random() * 14)];
			}
		}
		// dataObject.highPriority = highPriorityArray[Math.floor(Math.random() * 14)];
		// dataObject.highPriority2 = highPriorityArray[Math.floor(Math.random() * 14)];
		// if (dataObject.highPriority2 === dataObject.highPriority) {
		// 	while (dataObject.highPriority2 === dataObject.highPriority) {
		// 		dataObject.highPriority2 = highPriorityArray[Math.floor(Math.random() * 14)];
		// 	}
		// }
		// dataObject.mediumPriority = mediumPriorityArray[Math.floor(Math.random() * 14)];
		// if (dataObject.mediumPriority === dataObject.highPriority || dataObject.mediumPriority === dataObject.highPriority2) {
		// 	while (dataObject.mediumPriority === dataObject.highPriority || dataObject.mediumPriority === dataObject.highPriority2) {
		// 		dataObject.mediumPriority = mediumPriorityArray[Math.floor(Math.random() * 14)];
		// 	}
		// }
		// dataObject.mediumPriority2 = mediumPriorityArray[Math.floor(Math.random() * 14)];
		// if (dataObject.mediumPriority2 === dataObject.mediumPriority || dataObject.mediumPriority2 === dataObject.highPriority2 || dataObject.mediumPriority2 === dataObject.highPriority) {
		// 	while (dataObject.mediumPriority2 === dataObject.mediumPriority || dataObject.mediumPriority2 === dataObject.highPriority2 || dataObject.mediumPriority2 === dataObject.highPriority) {
		// 		dataObject.mediumPriority2 = mediumPriorityArray[Math.floor(Math.random() * 14)];
		// 	}
		// }
		// dataObject.lowPriority = lowPriorityArray[Math.floor(Math.random() * 14)];
		// if (dataObject.lowPriority === dataObject.mediumPriority2 || dataObject.lowPriority === dataObject.mediumPriority || dataObject.lowPriority === dataObject.highPriority2 || dataObject.lowPriority === dataObject.highPriority) {
		// 	while (dataObject.lowPriority === dataObject.mediumPriority2 || dataObject.lowPriority === dataObject.mediumPriority || dataObject.lowPriority === dataObject.highPriority2 || dataObject.lowPriority === dataObject.highPriority) {
		// 		dataObject.lowPriority = lowPriorityArray[Math.floor(Math.random() * 14)];
		// 	}
		// }
		// dataObject.lowPriority2 = lowPriorityArray[Math.floor(Math.random() * 14)];
		// if (dataObject.lowPriority2 === dataObject.lowPriority || dataObject.lowPriority2 === dataObject.mediumPriority2 || dataObject.lowPriority2 === dataObject.mediumPriority || dataObject.lowPriority2 === dataObject.highPriority2 || dataObject.lowPriority2 === dataObject.highPriority) {
		// 	while (dataObject.lowPriority2 === dataObject.lowPriority || dataObject.lowPriority2 === dataObject.mediumPriority2 || dataObject.lowPriority2 === dataObject.mediumPriority || dataObject.lowPriority2 === dataObject.highPriority2 || dataObject.lowPriority2 === dataObject.highPriority) {
		// 		dataObject.lowPriority2 = lowPriorityArray[Math.floor(Math.random() * 14)];
		// 	}
		// }
		dataObject.city = faker.fake("{{address.city}}");
		dataObject.latitude = faker.fake("{{address.latitude}}");
		dataObject.longitude = faker.fake("{{address.longitude}}");
		dataObject.rating = Math.floor(Math.random() * 4) + 1;
		dataObject.rating = Math.floor(Math.random() * 10) + 1;
		dataObject.reported = Math.floor(Math.random() * 100);
		if (dataObject.reported > 33) {
			dataObject.temporaryBan = 1;
			dataObject.permanentBan = 0;
		}
		else if (dataObject.reported > 66) {
			dataObject.temporaryBan = 0;
			dataObject.permanentBan = 1;
		}
		else if (dataObject.reported < 34) {
			dataObject.temporaryBan = 0;
			dataObject.permanentBan = 0;
		}
		// dataArray.push(dataObject);
		// console.log(dataArray[i]);
		return (dataObject);
		// i += 1;
	// }
};
let i = 0;
async function insertFuckers() {
	while (i < 100) {
		const connection = await mysql.connection();
		let dataObject = generateUsers();
		try {
			console.log(`oi`);
			await connection.query('START TRANSACTION');
			let existingUser = await connection.query('SELECT COUNT (*) FROM users WHERE username = ?', [dataObject.username]);
			if (existingUser[0]['COUNT (*)'] > 0) {
				let err = `Username ${username} taken`;
				console.log(err);
				await connection.release();
				insertFuckers();
			}
			else console.log(`Well that's interesting`);
			let stmtValues = `name, surname, email, username, notifications, verified, token, password, age, gender, biography, agePreference, sexualOrientation, interest1, interest2, interest3, interest4, city, latitude, longitude, rating, reported, temporaryBan, permanentBan`;
			let stmt = `INSERT INTO users(${stmtValues})`;
			let values = [
				dataObject.name,
				dataObject.surname,
				dataObject.email,
				dataObject.username,
				dataObject.notifications,
				dataObject.verified,
				dataObject.token,
				dataObject.password,
				// dataObject.resetToken,
				dataObject.age,
				dataObject.gender,
				dataObject.biography,
				dataObject.agePreference,
				dataObject.sexualOrientation,
				dataObject.interest1,
				dataObject.interest2,
				dataObject.interest3,
				dataObject.interest4,
				// dataObject.lowPriority,
				// dataObject.lowPriority2,
				dataObject.city,
				dataObject.latitude,
				dataObject.longitude,
				dataObject.rating,
				dataObject.reported,
				dataObject.temporaryBan,
				dataObject.permanentBan
			];
			await connection.query(stmt + `VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, values);
			await connection.query('COMMIT');
			console.log(dataObject);
		}
		catch (err) {
			await connection.query('ROLLBACK');
			console.log(`ROLLBACK at insertFuckers`, err);
			throw (err);
		}
		finally {
			connection.release();
			i += 1;
			// return(dataObject);
		}
	}
};
// let i = 0;
// while (i < 100) {
insertFuckers();
// 	i += 1;
// }