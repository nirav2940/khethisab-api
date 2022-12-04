const con = require('../../config/database');
const async = require('async');

const crop = {
	createCrop: (req, res) => {
		con.connect(function (err) {
			con.query("INSERT into crop(crop,user_id,khetar,area,verity,date) values('" + req.body.CropName + "','" + req.userId + "','" + req.body.Khetar + "','" + req.body.Area + "','" + req.body.Verity + "','" + req.body.Date + "')", function (err, result) {
				if (err) {
					res.status(500).send({ 'status': 0 });//internal error
				} else {
					res.status(200).send({ 'status': 1 });//success
				}
			});
		});
	},

	editCrop: (req, res) => {
		con.connect(function (err) {
			con.query("update crop set crop='" + req.body.CropName + "',verity='" + req.body.Verity + "',khetar='" + req.body.Khetar + "',area='" + req.body.Area + "',date='" + req.body.Date + "' where id = " + req.body.cropId + "", function (err, result) {
				if (err) {
					res.status(500).send({ 'status': 0 });//internal error
				} else {
					res.status(200).send({ 'status': 1 });//success
				}
			});
		});
	},

	getCrops: (req, res) => {
		async.waterfall([
			function callback(callback) {
				con.connect(function (err) {
					con.query("SELECT * FROM crop where user_id = '" + req.userId + "' AND isActive=1 order by id desc", function (err, result) {
						if (err) {
							return callback("500")
						} else {
							if (result.length > 0) {
								callback(null, result)
							} else {
								return callback('401')
							}
						}
					});
				});
			},

			function callback(cropList, callback) {
				var totalKarcho = [];
				var count = 0;
				cropList.forEach((val, index, array) => {
					con.connect(function (err) {
						con.query("SELECT SUM(amount) totalKharcho FROM kharcho where crop_id = '" + val.id + "'", function (err, totalKarchoRes) {

							val.totalKharcho = totalKarchoRes[0].totalKharcho;
							count++;
							totalKarcho.push(val);
							if (count == array.length) {

								callback(null, totalKarcho);

							}
						});

					});

				})
			},
			function callback(cropList, callback) {
				var totalKarcho = [];
				var count = 0;
				cropList.forEach((val, index, array) => {
					con.connect(function (err) {
						con.query("SELECT SUM(amount) totalVechan FROM vechan where crop_id = '" + val.id + "'", function (err, totalVechanRes) {

							val.totalVechan = totalVechanRes[0].totalVechan;
							count++;
							totalKarcho.push(val);
							if (count == array.length) {

								callback(null, totalKarcho);

							}
						});

					});

				})
			},
			function callback(cropList, callback) {
				var totalKarcho = [];
				var count = 0;
				cropList.forEach((val, index, array) => {

					con.connect(function (err) {
						con.query("SELECT SUM(majuri) totalMajuri FROM majuri where crop_id = '" + val.id + "'", function (err, totalMajuriRes) {

							val.totalMajuri = totalMajuriRes[0].totalMajuri;
							count++;
							totalKarcho.push(val);
							if (count == array.length) {
								//ok
								callback(null, totalKarcho);

							}
						});

					});

				})
			},


		], function (error, data) {
			if (error == "401") {
				res.status(200).send({ 'status': 0 });// 0 user not found
			} else if (error == "500") {
				res.status(500).send();
			} else {
				res.status(200).send({ 'status': 1, 'croplist': data });//1 login success	
			}

		});

	},

	getInActiveCrops: (req, res) => {
		async.waterfall([
			function callback(callback) {
				con.connect(function (err) {
					con.query("SELECT * FROM crop where user_id = '" + req.body.userId + "' AND isActive=0 order by id desc", function (err, result) {
						if (err) {
							return callback("500")
						} else {
							if (result.length > 0) {
								callback(null, result)
							} else {
								return callback('401')
							}
						}
					});
				});
			},

			function callback(cropList, callback) {
				var totalKarcho = [];
				var count = 0;
				cropList.forEach((val, index, array) => {
					con.connect(function (err) {
						con.query("SELECT SUM(amount) totalKharcho FROM kharcho where crop_id = '" + val.id + "'", function (err, totalKarchoRes) {

							val.totalKharcho = totalKarchoRes[0].totalKharcho;
							count++;
							totalKarcho.push(val);
							if (count == array.length) {

								callback(null, totalKarcho);

							}
						});

					});

				})
			},
			function callback(cropList, callback) {
				var totalKarcho = [];
				var count = 0;
				cropList.forEach((val, index, array) => {
					con.connect(function (err) {
						con.query("SELECT SUM(amount) totalVechan FROM vechan where crop_id = '" + val.id + "'", function (err, totalVechanRes) {

							val.totalVechan = totalVechanRes[0].totalVechan;
							count++;
							totalKarcho.push(val);
							if (count == array.length) {

								callback(null, totalKarcho);

							}
						});

					});

				})
			},
			function callback(cropList, callback) {
				var totalKarcho = [];
				var count = 0;
				cropList.forEach((val, index, array) => {

					con.connect(function (err) {
						con.query("SELECT SUM(majuri) totalMajuri FROM majuri where crop_id = '" + val.id + "'", function (err, totalMajuriRes) {

							val.totalMajuri = totalMajuriRes[0].totalMajuri;
							count++;
							totalKarcho.push(val);
							if (count == array.length) {
								//ok
								callback(null, totalKarcho);

							}
						});

					});

				})
			},


		], function (error, data) {
			if (error == "401") {
				res.status(401).send({ 'status': 0 });// 0 user not found
			} else if (error == "500") {
				res.status(500).send();
			} else {
				res.status(200).send({ 'status': 1, 'croplist': data });//1 login success	
			}

		});

	},


	deleteCrop: (req, res) => {
		con.connect(function (err) {
			con.query('delete from crop where id = ' + req.body.cropId + '', function (err, result) {
				if (err) {
					res.status(501).send({ 'status': 0 });
				}
				res.status(200).send({ 'status': 1 });
			})
		})
	},

	inActiveCrop: (req, res) => {
		con.connect(function (err) {
			con.query('update crop set isActive=0 where id = ' + req.body.Id + '', function (err, result) {
				if (err) {
					res.status(501).send({ 'status': 0 });
				}
				res.status(200).send({ 'status': 1 });
			})
		})
	},

	activeCrop: (req, res) => {
		con.connect(function (err) {
			con.query('update crop set isActive=1 where id = ' + req.body.Id + '', function (err, result) {
				if (err) {
					res.status(501).send({ 'status': 0 });
				}
				res.status(200).send({ 'status': 1 });
			})
		})
	},

	getAdd: (req, res) => {


		const add = [{ header: "કોરોના વાઇરસથી બચવા", subHeader: "ઘરમાં રહો અને", mobile: "વારંવાર હાથ ધોવા" }, { header: "પપૈયાના રોપા", subHeader: "નિકુંજ પટેલ", mobile: "9409452525" }]
		res.status(200).send({ 'add': add });
	},

	createKhetar: (req, res) => {
		con.connect(function (err) {
			con.query("INSERT into khetar(name,userId) values('" + req.body.Khetar + "','" + req.userId + "')", function (err, result) {
				if (err) {
					res.status(500).send({ 'status': 0 });//internal error
				} else {
					res.status(200).send({ 'status': 1 });//success
				}
			});
		});
	},
	getKhetars: (req, res) => {
		con.connect(function (err) {
			con.query("SELECT * FROM khetar where userId = '" + req.userId + "'  order by id desc", function (err, result) {
				if (err) {
					res.status(500).send();
				} else {
					if (result.length > 0) {
						res.status(200).send({ 'status': 1, khetarList:result });
					} else {
						res.status(200).send({ 'status': 0 });// 0 khetar not found
					}
				}
			});
		})
	},

	deleteKhetar:(req,res)=>{
		con.connect(function (err) {
			con.query("DELETE FROM khetar where id = '" + req.body.id + "'", function (err, result) {
				if (err) {
					res.status(500).send();
				} 
				res.send(200);
			});
		})
	},

	getcropWithAll:(req,res)=>{
	
		var cropPromis= new Promise((resolve,reject)=>{
			console.log(req.body.cropId);
			con.connect(function (err) {
				con.query("select * FROM crop where id = '" + req.body.cropId + "'", function (err, result) {
					if (err) {
						res.status(500).send();
					} 
					resolve(result);
				});
			})

			
		});

		var kharchPromis= new Promise((resolve,reject)=>{
			con.connect(function (err) {
				con.query("select * FROM kharcho where crop_id = '" + req.body.cropId + "'", function (err, result) {
					if (err) {
						res.status(500).send();
					} 
					resolve(result);
				});
			})
		});

		var vechanPromis= new Promise((resolve,reject)=>{
			con.connect(function (err) {
				con.query("select * FROM vechan where crop_id = '" + req.body.cropId + "'", function (err, result) {
					if (err) {
						res.status(500).send();
					} 
					resolve(result);
				});
			})
		});

		cropPromis.then(crop=>{
			kharchPromis.then(kharch=>{
				vechanPromis.then(vechan=>{
					res.status(200).send({crop, kharch, vechan});
				})
			})
		})
		

	}
}

module.exports = crop;