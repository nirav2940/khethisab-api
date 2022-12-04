const con = require('../../config/database');

const vechan = {

	createVechan: (req, res) => {
		con.connect(function (err) {
			con.query("INSERT into vechan(crop_id,weight,weightUnit,rate,rateUnit,amount,vepari,date) values('" + req.body.cropId + "','" + req.body.Weight + "','" + req.body.WeightUnit + "','" + req.body.Rate + "','" + req.body.RateUnit + "','" + req.body.Amount + "','" + req.body.Vepari + "','" + req.body.Date + "')", function (err, result) {
				if (err) {
					res.status(500).send({ 'status': 0 });//internal error
				} else {
					con.query(`update crop set vechan = vechan+${req.body.Amount} where id=${req.body.cropId}`, function (err, result) {
						if (!err) {
							res.status(200).send({ 'status': 1 });//success
						} else {
							console.log(err);
							res.status(500).send({ 'status': 0 });//success
						}
					})
				}
			});
		});
	},

	editVechan: (req, res) => {
		con.connect(function (err) {
			con.query(`select amount, crop_id from vechan where id =${req.body.vechanId}`, function (err, result) {
				let amount = result[0].amount;
				let crop_id = result[0].crop_id;

				con.query("update vechan set weight='" + req.body.Weight + "', weightUnit='" + req.body.WeightUnit + "', rate='" + req.body.Rate + "',rateUnit='" + req.body.RateUnit + "',amount='" + req.body.Amount + "',vepari='" + req.body.Vepari + "',date='" + req.body.Date + "' where id='" + req.body.vechanId + "' ", function (err, result2) {
					if (err) {
						res.status(500).send({ 'status': 0 });//internal error
					} else {
						let amountforupdate = req.body.Amount - amount;
						con.query("update crop set vechan=vechan + '" + amountforupdate + "' where id='" + crop_id + "' ", function (err, result3) {
							res.status(200).send({ 'status': 1 });
						})
					}
				});
			})
		});
	},

	getVechan: (req, res) => {
		con.connect(function (err) {
			con.query("SELECT * FROM vechan where crop_id = '" + req.body.cropId + "' order by id desc", function (err, result) {
				if (err) {
					res.status(500).send();
				} else {
					if (result.length > 0) {
						var sql = 'SELECT SUM(amount) totalVechan from vechan where crop_id =  "' + req.body.cropId + '"';
						con.query(sql, function (err, totalVechanRes) {
							result[0].totalVechan = totalVechanRes[0].totalVechan;
							res.status(200).send({ 'status': 1, 'vechanList': result });//1 login success
						});
					} else {
						res.status(200).send({ 'status': 0 });// 0 user not found
					}
				}
			});
		});
	},


	deleteVechan: (req, res) => {
		con.connect(function (err) {
			con.query('select amount, crop_id from vechan where id = ' + req.body.vechanId + '', function (err, result1) {
				let amount = result1[0].amount;
				let crop_id = result1[0].crop_id;
				console.log(amount, crop_id)
				con.query('delete from vechan where id = ' + req.body.vechanId + '', function (err, result1) {
					if (err) {
						res.status(501).send({ 'status': 0 });
					} else {
						con.query('update crop set vechan=vechan-' + amount + ' where id = ' + crop_id + '', function (err, result2) {
							res.status(200).send({ 'status': 1 });
						})
					}
				})
			})
		})
	}
}

module.exports = vechan;