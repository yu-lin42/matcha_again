var express = require('express');
const { connection } = require('../dbc');
var router = express.Router();

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

module.exports = router;
