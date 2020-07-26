var faker = require('faker');
var bcrypt = require('bcrypt');
var connection = require('./dbc').connection;

let saltRounds = 10;
let i = 0;
let genderArray = ["male", "female"];
let sexualOrientationArray = ["straight", "bisexual", "gay", "lesbian"];
let	interestsArray = ["food", "books", "movies", "series", "anime", "music", "games", "sport", "gardening", "hiking", "camping", "cooking", "baking,", "dancing"];
let dataArray = [];

let generateUsers = () => {
	while (i < 50) {
		let dataObject = {
			name : ``,
			surname : ``,
			email : ``,
			username : ``,
			notifications : 1,
			verified : 1,
			token : ``,
			password : ``,
			age : ``,
			gender : ``,
			sexualOrientation : ``,
			interest1:``,
			interest2:``,
			interest3:``,
			interest4:``,
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
		dataObject.gender = genderArray[Math.floor(Math.random() * 2)];
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
		if (dataObject.interest3 === dataObject.interest1 || dataObject.interest3 === dataObject.interest2) {
			while (dataObject.interest3 === dataObject.interest1 || dataObject.interest3 === dataObject.interest2) {
				dataObject.interest3 = interestsArray[Math.floor(Math.random() * 14)];
			}
		}
		dataObject.interest4 = interestsArray[Math.floor(Math.random() * 14)];
		if (dataObject.interest4 === dataObject.interest3 || dataObject.interest4 === dataObject.interest2 || dataObject.interest4 === dataObject.interest1) {
			while (dataObject.interest4 === dataObject.interest3 || dataObject.interest4 === dataObject.interest2 || dataObject.interest4 === dataObject.interest1) {
				dataObject.interest4 = interestsArray[Math.floor(Math.random() * 14)];
			}
		}
		dataObject.city = faker.fake("{{address.city}}");
		dataObject.latitude = faker.fake("{{address.latitude}}");
		dataObject.longitude = faker.fake("{{address.longitude}}");
		dataObject.rating = Math.floor(Math.random() * 4) + 1;
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
		dataArray.push(dataObject);
		console.log(dataArray[i]);
		
		i += 1;
	}
};

generateUsers();
// generateUsers();
// console.log(dataArray);

let insert = () => {
	let iterate = 0;
	let num = 1;
	while (iterate < 50) {
		let stmtValues = `name, surname, email, username, notifications, verified, token, password, age, gender, sexualOrientation, interest1, interest2, interest3, interest4, city, latitude, longitude, rating, reported, temporaryBan, permanentBan`;
		let stmt = `INSERT INTO users(${stmtValues})`;
		let values = [
			dataArray[iterate].name,
			dataArray[iterate].surname,
			dataArray[iterate].email,
			dataArray[iterate].username,
			dataArray[iterate].notifications,
			dataArray[iterate].verified,
			dataArray[iterate].token,
			dataArray[iterate].password,
			dataArray[iterate].age,
			dataArray[iterate].gender,
			dataArray[iterate].sexualOrientation,
			dataArray[iterate].interest1,
			dataArray[iterate].interest2,
			dataArray[iterate].interest3,
			dataArray[iterate].interest4,
			dataArray[iterate].city,
			dataArray[iterate].latitude,
			dataArray[iterate].longitude,
			dataArray[iterate].rating,
			dataArray[iterate].reported,
			dataArray[iterate].temporaryBan,
			dataArray[iterate].permanentBan
		];
		connection.query(stmt + `VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, values, (err) => {
			if (err) {
				throw err;
			}
			else {
				if (num === 1) {
					console.log(`${num} query inserted`);
					num += 1;
				}
				else {
					console.log(`${num} queries inserted`)
					num += 1;
				}
			}
		});
		iterate += 1;
	}
};

insert();