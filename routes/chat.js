var express = require('express');
const { connection } = require('../dbc');
var router = express.Router();
const mysql = require('../test');

router.get('/', (req, res, next) => {
	let usrId = req.session.userID;
	let getUsername = `SELECT username FROM users WHERE id = ?`;
	connection.query(getUsername, usrId, (err, results) => {
		if (err) {
			throw err;
		}
		else {
			// console.log(results);
			let connectedQuery = `SELECT usernameOfLiked FROM connections WHERE (username = ? AND matched = ?)`;
			let connectedValues = [results[0].username, 1];
			connection.query(connectedQuery, connectedValues, (error, results) => {
				if (error) {
					throw error;
				}
				else {
					// console.log(results);
					let i = 0;
					let connectionArray = [];
					while (i < results.length) {
						connectionArray.push(results[i].usernameOfLiked);
						i++;
					}
					console.log(connectionArray);
					res.render('chat', {
						title: 'Chat',
						loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
						connectedUser : connectionArray
					});
				}
			});
		}
	});
});

router.post('/blocked', (req, res) => {
	console.log(req.query.user);
	// console.log(req.body.user);
	async function blockYeBastard() {
		const connection = await mysql.connection();
		try {
			await connection.query('START TRANSACTION');
			let currentReportedValue = await connection.query('SELECT reported FROM users WHERE username = ?', [req.query.user]);
			let newReportedValue;
			if (currentReportedValue[0].reported === null) {
				newReportedValue = 1;
			}
			else {
				newReportedValue = currentReportedValue[0].reported + 1;
			}
			// console.log(currentReportedValue);
			console.log(newReportedValue);
			await connection.query(`UPDATE users SET reported = ? WHERE username = ?`, [newReportedValue, req.query.user]);
			let currUser = await connection.query(`SELECT username FROM users WHERE id = ?`, [req.session.userID]);
			await connection.query(`DELETE FROM connections WHERE username = ? AND usernameOfLiked = ?`, [currUser[0].username, req.query.user]);
			await connection.query(`DELETE FROM connections WHERE username = ? AND usernameOfLiked = ?`, [req.query.user, currUser[0].username]);
			console.log(`${req.query.user} reported and blocked by ${req.session.userID}`);
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
	blockYeBastard()
	.then(() => {
		res.redirect('/chat');
	})
	.catch((err) => {
		console.log(err);
	});
	console.log('Username has been blocked');
});

module.exports = router;
