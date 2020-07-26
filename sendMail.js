var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service : 'gmail',
	auth : {
		user : 'matcha.test.mail@gmail.com',
		pass : '12FuckYou'
	}
});

var mailOptions = {
	from :'matcha.test.mail@gmail.com',
	to : '',
	subject : '',
	text : ''
};

// transporter.sendMail(mailOptions, (err, info) => {
// 	if (err) {
// 		throw err;
// 	}
// 	else {
// 		console.log(`Up, up, and away!`);
// 	}
// });

module.exports = {
	nodemailer,
	transporter,
	mailOptions
};