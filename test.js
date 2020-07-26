const mysql = require('mysql');

const dbSettings = {
	connectionLimit: 100,
	host : 'localhost',
	user : 'root',
	password : '!Sherry1',
	database : 'matcha'
};

const pool = mysql.createPool(dbSettings);

const connection = () => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) {
				reject (err);
			}
			else {
				console.log(`Pool connected, threadId: ${connection.threadId}`);
				const query = (sql, binding) => {
					return new Promise((resolve, reject) => {
						connection.query(sql, binding, (err, result) => {
							if (err) {
								reject (err);
							}
							else {
								resolve (result);
							}
						})
					});
				};
				const release = () => {
					return new Promise((resolve, reject) => {
						if (err) {
							reject (err);
						}
						else {
							console.log(`Pool released, threadId: ${connection.threadId}`);
							resolve (connection.release);
						}
					});
				};
				resolve ({ query, release });
			}
		});
	});
};

const query = (sql, binding) => {
	return new Promise((resolve, reject) => {
		connection.query(sql, binding, (err, result) => {
			if (err) {
				reject (err);
			}
			else {
				resolve (result);
			}
		})
	});
};

module.exports = {
	mysql,
	connection,
	query
};