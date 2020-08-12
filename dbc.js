var mysql = require('mysql');

let options = {
	// connectionLimit: 100,
	host: 'localhost', //might need to change to xammp url (192.168.64.2)
	// port: 3306,
	user: 'root',
	password: '!Sherry1'
	// socketPath: '/var/run/mysqld/mysqld.sock',
};

let connection = mysql.createConnection(options);

connection.connect((err) => {
	let on = `Success`;
	let off = `Fail`;
	let db = `matcha`;
	let dbQuery = `CREATE DATABASE IF NOT EXISTS ${db}`;
	let use = `USE ${db}`;
	let usersTable = `CREATE TABLE IF NOT EXISTS users`;
	let connectionsTable = `CREATE TABLE IF NOT EXISTS connections`;
	let dislikesTable = `CREATE TABLE IF NOT EXISTS dislikes`;
	let viewedByTable = `CREATE TABLE IF NOT EXISTS viewedby`;
	// let matchedTable = `CREATE TABLE IF NOT EXISTS matched`;
	if (err) {
		console.log(`Initial connection: ${off}`);
		throw err;
	}
	else {
		console.log(`Initial connection: ${on}`);
		connection.query(dbQuery, (err) => {
			if (err) {
				console.log(`Database connection: ${off}`);
				throw err;
			}
			else {
				console.log(`Database connection: ${on}`);
				connection.query(use, (err) => {
					if (err) {
						console.log(`Database selection: ${off}`);
						throw err;
					}
					else {
						console.log(`Database selection: ${on}`);
						connection.query(`${usersTable}(`
						+ `id INT NOT NULL AUTO_INCREMENT,`
						+ `PRIMARY KEY(id),`
						+ `name VARCHAR(100) NOT NULL,`
						+ `surname VARCHAR(100) NOT NULL,`
						+ `email VARCHAR(100) NOT NULL UNIQUE,`
						+ `username VARCHAR(100) NOT NULL UNIQUE,`
						+ `notifications INT(10) NOT NULL,`
						+ `verified INT(10) NOT NULL,`
						+ `token VARCHAR(200) NOT NULL,`
						+ `password VARCHAR(200) NOT NULL,`
						+ `resetToken VARCHAR(200),`
						+ `firstLogin INT(10),`
						+ `age INT(10),`
						+ `gender VARCHAR(200),`
						+ `biography VARCHAR(300),`
						+ `agePreference VARCHAR(10),`
						+ `sexualOrientation VARCHAR(200),`
						+ `interest1 VARCHAR(200),`
						+ `interest2 VARCHAR(200),`
						+ `interest3 VARCHAR(200),`
						+ `interest4 VARCHAR(200),`
						+ `mainImagePath VARCHAR(255),`
						+ `galleryImagePath VARCHAR(255),`
						+ `viewedBy VARCHAR(500),`
						// + `connectedWith VARCHAR (500),`
						+ `city VARCHAR(200),`
						+ `latitude VARCHAR(20),`
						+ `longitude VARCHAR(20),`
						// + `currentCityLog INT(20),`
						// + `differentCityLog INT(20),`
						+ `rating INT(10),`
						+ `reported INT(10),`
						+ `temporaryBan INT(10),`
						+ `permanentBan INT(10)`
						+ `)`, (err) => {
							if (err) {
								console.log(`Users table connection: ${off}`);
								throw err;
							}
							else {
								console.log(`Users table connection: ${on}`);
							}
						});
						connection.query(`${connectionsTable}(`
						+ `id INT NOT NULL AUTO_INCREMENT,`
						+ `PRIMARY KEY(id),`
						+ `username VARCHAR(100),`
						+ `usernameOfLiked VARCHAR(100),`
						+ `matched INT(10)`
						+ `)`, (err) => {
							if (err) {
								console.log(`Connections table connection: ${off}`);
								throw err;
							}
							else {
								console.log(`Connections table connection: ${on}`);
							}
						});
						connection.query(`${dislikesTable}(`
						+ `id INT NOT NULL AUTO_INCREMENT,`
						+ `PRIMARY KEY(id),`
						+ `username VARCHAR(100),`
						+ `usernameOfDisliked VARCHAR(100)`
						+ `)`, (err) => {
							if (err) {
								console.log(`Dislikes table connection: ${off}`);
								throw err;
							}
							else {
								console.log(`Dislikes table connection: ${on}`);
							}
						});
						connection.query(`${viewedByTable}(`
						+ `id INT NOT NULL AUTO_INCREMENT,`
						+ `PRIMARY KEY(id),`
						+ `username VARCHAR(100),`
						+ `viewedBy VARCHAR(100)`
						+ `)`, (err) => {
							if (err) {
								console.log(`ViewedBy table connection: ${off}`);
								throw err;
							}
							else {
								console.log(`ViewedBy table connection: ${on}`);
							}
						});
					}
				});
			}
		});
	}
});

module.exports = {
	mysql,
	connection
}

// pool.getConnection((err, connection) => {
// 	if (err) {
// 		throw err
// 	}
// 	else {
// 		console.log(`Finally`);
// 	}
// })