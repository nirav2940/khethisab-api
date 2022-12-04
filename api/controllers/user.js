const con = require('../../config/database');

const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'khethisab90914@gmail.com',
		pass: 'dfmoagebdflvavgp'
	}
});

const user = {

	createUser: (req, res) => {
		console.log(req.body);

		con.connect(function (err) {

			con.query("SELECT * FROM user where mobile = '" + req.body.mobile + "'", function (err, result) {
				if (result.length > 0) {
					res.status(401).send({ 'status': 2 });//already exist
				} else {
					con.query("INSERT into user(name,mobile,password, fcm_token) values('" + req.body.name + "','" + req.body.mobile + "','" + req.body.password + "','" + req.body.fcmToken + "')", function (err, result) {
						if (err) {
							res.status(500).send({ 'status': 0 });//internal error
						} else {
							const token = jwt.sign({ userId: result.insertId, name: req.body.name, mobile: req.body.mobile }, 'MY_SECRET_KEY');
							res.status(200).send({ 'status': 1, 'id': result.insertId, 'name': req.body.name, 'token': token, isPrime: 0 });//success
						}
					});
				}
			});
		});
	},

	loginUser: (req, res) => {
		con.connect(function (err) {
			con.query("SELECT * FROM user where mobile = '" + req.body.mobile + "'", function (err, result) {
				if (err) {
					res.status(500).send();
				} else {
					if (result.length > 0) {
						if (req.body.password == result[0].password) {
							const token = jwt.sign({ userId: result[0].id, name: result[0].name, mobile: req.body.mobile }, 'MY_SECRET_KEY');
							if (req.body.fcmToken) {
								con.query("UPDATE user set fcm_token = '" + req.body.fcmToken + "' where mobile = '" + req.body.mobile + "'", function (err, result2) {
									res.status(200).send({ 'status': 1, 'id': result[0].id, 'name': result[0].name, 'token': token, isPrime: result[0].isPrime });//1 login success
								})
							} else {
								res.status(200).send({ 'status': 1, 'id': result[0].id, 'name': result[0].name, 'token': token, isPrime: result[0].isPrime });//1 login success
							}

						}
						else {
							res.status(200).send({ 'status': 2 });//2 wrong password
						}

					} else {
						res.status(200).send({ 'status': 0 });// 0 user not found
					}
				}
			});
		});
	},

	changePassword: (req, res) => {
		con.connect(function (err) {
			con.query("select password from user where id= '" + req.userId + "'", function (err, result) {
				if (err) {
					res.status(500).send();
				}
				if (result.length > 0) {
					console.log(result[0].password);
					if (result[0].password !== req.body.CurrentPassword) {
						res.status(200).send({ 'status': 0 });//2 wrong password
					} else {
						con.query("update user set password = '" + req.body.Password + "' where id = " + req.userId + "", function (err, result) {
							if (err) {
								res.status(500).send();
							} else {
								res.status(200).send({ 'status': 1 });

							}
						});

					}
				}
			})


		});
	},

	userAlreadyExist: (req, res) => {
		con.connect(function (err) {
			con.query("SELECT * FROM user where mobile = '" + req.body.mobile + "'", function (err, result) {
				if (err) {
					res.status(500).send();
				} else {
					if (result.length > 0) {
						res.status(200).send({ 'status': 0 });
					} else {
						res.status(200).send({ 'status': 1 });// 0 user not found
					}
				}
			});
		});


	},

	forgotPassword: (req, res) => {
		con.connect(function (err) {
			con.query("update user set password='" + req.body.password + "'  where mobile = '" + req.body.mobile + "'", function (err, result) {
				if (err) {
					res.status(200).send({ 'status': 0 });
				} else {
					res.status(200).send({ 'status': 1 });
				}
			});
		});
	},

	checkIsPrime: (req, res) => {
		con.connect(function (err) {
			con.query("SELECT isPrime FROM user where id = " + req.userId + "", function (err, result) {
				if (err) {
					res.status(200).send({ 'status': 0 });
				} else {
					console.log(result[0].isPrime);
					res.status(200).send({ 'status': 1, version: 6, isPrime: result[0].isPrime });
				}
			});
		});
	},

	sendSupportMail: (req, res) => {
		var mailOptions = {
			from: 'khethisab90914@gmail.com',
			to: 'khethisab90914@gmail.com',
			subject: req.name + '-' + req.phone + '-' + req.body.subject,
			text: req.body.texts
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				res.status(200).send({ 'status': 0 })
			} else {
				res.status(200).send({ 'status': 1 });
				console.log('Email sent: ' + info.response);
			}
		});
	}

}

module.exports = user;