var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
	res.render('admin', {
		title: 'Admin',
		loginStatus : req.session.userID ? 'logged_in' : 'logged_out',
	});
});

module.exports = router;