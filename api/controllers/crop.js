const con = require("../../config/database");
const async = require("async");

const crop = {
	createCrop: (req, res) => {
		console.log("khetar id " + req.body.Khetar);
		con.connect(function (err) {
			con.query(
				"INSERT into crop(crop,user_id,khetarId,area,verity,date) values('" +
				req.body.CropName +
				"','" +
				req.userId +
				"'," +
				req.body.Khetar +
				",'" +
				req.body.Area +
				"','" +
				req.body.Verity +
				"','" +
				req.body.Date +
				"')",
				function (err, result) {
					if (err) {
						console.log(err);
						res.status(500).send({ status: 0 }); //internal error
					} else {
						res.status(200).send({ status: 1 }); //success
					}
				}
			);
		});
	},

	editCrop: (req, res) => {
		con.connect(function (err) {
			con.query(
				"update crop set crop='" +
				req.body.CropName +
				"',verity='" +
				req.body.Verity +
				"',khetarId='" +
				req.body.Khetar +
				"',area='" +
				req.body.Area +
				"',date='" +
				req.body.Date +
				"' where id = " +
				req.body.cropId +
				"",
				function (err, result) {
					if (err) {
						res.status(500).send({ status: 0 }); //internal error
					} else {
						res.status(200).send({ status: 1 }); //success
					}
				}
			);
		});
	},

	getCrops: (req, res) => {
		con.connect(function (err) {
			let sy = (req.body.startYear || 2010) + '-01-01';
			let ey = (req.body.endYear || 2025) + '-12-31';

			let query;
			if (req.body.khetar == "all" || req.body.khetar == undefined) {
				query = "SELECT c.*, c.id as cropId, c.vechan as totalVechan,\
					c.kharch as totalKharcho, k.name FROM crop as c left\
					join khetar as k on c.khetarId = k.id where \
					c.user_id = " + req.userId + " AND c.isActive=1 \
					AND STR_TO_DATE(c.date, '%d/%m/%Y') BETWEEN '"+ sy + "' AND '" + ey + "' order by c.id desc;";
			} else {
				query = "SELECT c.*, c.id as cropId, c.vechan as totalVechan,\
				c.kharch as totalKharcho, k.name FROM crop as c left\
				join khetar as k on c.khetarId = k.id where \
				c.user_id = " + req.userId + " AND c.isActive=1 \
				AND c.khetarId = '" + req.body.khetar + "'\
				AND STR_TO_DATE(c.date, '%d/%m/%Y') BETWEEN '"+ sy + "' AND '" + ey + "'\
				order by c.id desc;";
			}
			con.query(query, function (err, result) {
				if (err) {
					console.log(err);
					res.status(500).send();
				} else {

					console.log(result.length);
					console.log(result);
					res.status(200).send({ status: 1, croplist: result });

				}
			});
		});
	},

	getInActiveCrops: (req, res) => {
		async.waterfall(
			[
				function callback(callback) {
					con.connect(function (err) {
						con.query(
							"SELECT * FROM crop where user_id = '" +
							req.body.userId +
							"' AND isActive=0 order by id desc",
							function (err, result) {
								if (err) {
									return callback("500");
								} else {
									if (result.length > 0) {
										callback(null, result);
									} else {
										return callback("401");
									}
								}
							}
						);
					});
				},

				function callback(cropList, callback) {
					var totalKarcho = [];
					var count = 0;
					cropList.forEach((val, index, array) => {
						con.connect(function (err) {
							con.query(
								"SELECT SUM(amount) totalKharcho FROM kharcho where crop_id = '" +
								val.id +
								"'",
								function (err, totalKarchoRes) {
									val.totalKharcho = totalKarchoRes[0].totalKharcho;
									count++;
									totalKarcho.push(val);
									if (count == array.length) {
										callback(null, totalKarcho);
									}
								}
							);
						});
					});
				},
				function callback(cropList, callback) {
					var totalKarcho = [];
					var count = 0;
					cropList.forEach((val, index, array) => {
						con.connect(function (err) {
							con.query(
								"SELECT SUM(amount) totalVechan FROM vechan where crop_id = '" +
								val.id +
								"'",
								function (err, totalVechanRes) {
									val.totalVechan = totalVechanRes[0].totalVechan;
									count++;
									totalKarcho.push(val);
									if (count == array.length) {
										callback(null, totalKarcho);
									}
								}
							);
						});
					});
				},
				function callback(cropList, callback) {
					var totalKarcho = [];
					var count = 0;
					cropList.forEach((val, index, array) => {
						con.connect(function (err) {
							con.query(
								"SELECT SUM(majuri) totalMajuri FROM majuri where crop_id = '" +
								val.id +
								"'",
								function (err, totalMajuriRes) {
									val.totalMajuri = totalMajuriRes[0].totalMajuri;
									count++;
									totalKarcho.push(val);
									if (count == array.length) {
										//ok
										callback(null, totalKarcho);
									}
								}
							);
						});
					});
				},
			],
			function (error, data) {
				if (error == "401") {
					res.status(401).send({ status: 0 }); // 0 user not found
				} else if (error == "500") {
					res.status(500).send();
				} else {
					res.status(200).send({ status: 1, croplist: data }); //1 login success
				}
			}
		);
	},

	deleteCrop: (req, res) => {
		con.connect(function (err) {
			con.query(
				"delete from crop where id = " + req.body.cropId + "",
				function (err, result) {
					if (err) {
						res.status(501).send({ status: 0 });
					}
					res.status(200).send({ status: 1 });
				}
			);
		});
	},

	editKhetar: (req, res) => {
		console.log('farm id is = ' + req.body.id);
		con.connect(function (err) {
			con.query(
				"UPDATE khetar set name = '" + req.body.khetar + "' where id = '" + req.body.id + "'",
				function (err, result) {
					if (err) {
						res.status(500).send();
					}
					res.send(200);
				}
			);
		});
	},

	inActiveCrop: (req, res) => {
		con.connect(function (err) {
			con.query(
				"update crop set isActive=0 where id = " + req.body.Id + "",
				function (err, result) {
					if (err) {
						res.status(501).send({ status: 0 });
					}
					res.status(200).send({ status: 1 });
				}
			);
		});
	},

	activeCrop: (req, res) => {
		con.connect(function (err) {
			con.query(
				"update crop set isActive=1 where id = " + req.body.Id + "",
				function (err, result) {
					if (err) {
						res.status(501).send({ status: 0 });
					}
					res.status(200).send({ status: 1 });
				}
			);
		});
	},

	getAdd: (req, res) => {
		const add = [
			{
				header: "કોરોના વાઇરસથી બચવા",
				subHeader: "ઘરમાં રહો અને",
				mobile: "વારંવાર હાથ ધોવા",
			},
			{
				header: "પપૈયાના રોપા",
				subHeader: "નિકુંજ પટેલ",
				mobile: "9409452525",
			},
		];
		res.status(200).send({ add: add });
	},

	createKhetar: (req, res) => {
		con.connect(function (err) {
			con.query(
				"INSERT into khetar(name,userId, sarveno,khatano) values('" +
				req.body.Khetar +
				"','" +
				req.userId +
				"','" +
				req.body.serveno +
				"','" +
				req.body.khatano +
				"')",
				function (err, result) {
					if (err) {
						res.status(500).send({ status: 0 }); //internal error
					} else {
						res.status(200).send({ status: 1 }); //success
					}
				}
			);
		});
	},
	getKhetars: (req, res) => {
		con.connect(function (err) {
			con.query(
				"SELECT * FROM khetar where userId = '" +
				req.userId +
				"' AND isActive = 1 order by id desc",
				function (err, result) {
					if (err) {
						res.status(500).send();
					} else {
						if (result.length > 0) {
							res.status(200).send({ status: 1, khetarList: result });
						} else {
							res.status(200).send({ status: 0 }); // 0 khetar not found
						}
					}
				}
			);
		});
	},

	deleteKhetar: (req, res) => {
		con.connect(function (err) {
			con.query(
				"UPDATE khetar set isActive = 0 where id = '" + req.body.id + "'",
				function (err, result) {
					if (err) {
						res.status(500).send();
					}
					res.send(200);
				}
			);
		});
	},



	getcropWithAll: (req, res) => {
		var cropPromis = new Promise((resolve, reject) => {
			console.log(req.body.cropId);
			con.connect(function (err) {
				con.query(
					"select c.*, k.name FROM crop as c join khetar as k on k.id = c.khetarId where c.id = '" + req.body.cropId + "'",
					function (err, result) {
						if (err) {
							res.status(500).send();
						}
						resolve(result);
					}
				);
			});
		});

		var kharchPromis = new Promise((resolve, reject) => {
			con.connect(function (err) {
				con.query(
					"select * FROM kharcho where crop_id = '" + req.body.cropId + "'",
					function (err, result) {
						if (err) {
							res.status(500).send();
						}
						resolve(result);
					}
				);
			});
		});

		var vechanPromis = new Promise((resolve, reject) => {
			con.connect(function (err) {
				con.query(
					"select * FROM vechan where crop_id = '" + req.body.cropId + "'",
					function (err, result) {
						if (err) {
							res.status(500).send();
						}
						resolve(result);
					}
				);
			});
		});

		cropPromis.then((crop) => {
			kharchPromis.then((kharch) => {
				vechanPromis.then((vechan) => {
					res.status(200).send({ crop, kharch, vechan });
				});
			});
		});
	},

	getAllKhetarDetails: (req, res) => {
		try {
			con.connect(function (err) {
				let sy = (req.query.startYear || 2010) + '-01-01';
				let ey = (req.query.endYear || 2025) + '-12-31';
				console.log(sy, ey);
				con.query(
					"select id,name from khetar WHERE isActive = 1 and userId = " + req.userId + " order by id desc;\
					select kharch,vechan,khetarId,date from crop\
					WHERE isActive = 1 AND user_id = " + req.userId + " \
					AND STR_TO_DATE(date, '%d/%m/%Y') BETWEEN '"+ sy + "' AND '" + ey + "'",
					function (err, result) {
						if (err) {
							res.status(500).send();
						}
						let khetar = result[0];
						let crop = result[1];
						console.log(crop);
						let data = [];
						let totalKarcho = 0;
						let totalVechan = 0;
						for (let row of khetar) {
							let obj = {}
							obj.khetar = row.name;
							obj.id = row.id;
							let tk = 0;
							let tv = 0;
							for (let row2 of crop) {
								if (row.id == row2.khetarId) {
									tk += parseInt(row2.kharch)
									tv += parseInt(row2.vechan)
									totalKarcho += parseInt(row2.kharch)
									totalVechan += parseInt(row2.vechan)
								}
								obj.kharch = tk;
								obj.vechan = tv;
							}
							(obj.kharch > 0 || obj.vechan > 0) && data.push(obj);

						}
						res.send({ 'data': data, 'totalVechan': totalVechan, 'totalKharch': totalKarcho });
					}
				);
			});
		} catch (e) {
			console.log(e);
		}
	},
};

module.exports = crop;
