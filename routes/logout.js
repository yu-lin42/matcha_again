var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			res.status(500);
		}
		else {
			res.redirect('/');
		}
	});
});

module.exports = router;
