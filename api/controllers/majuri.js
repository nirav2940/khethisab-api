const con =require('../../config/database');

const majuri = {

    createMajuri: (req, res) => {
    	con.connect(function(err) {
			 con.query("INSERT into majuri(crop_id,worker,majuri,vigat,date) values('"+req.body.cropId+"','"+req.body.worker+"','"+req.body.majuri+"','"+req.body.vigat+"','"+req.body.date+"')", function (err, result) {
                if (err) {
                    res.status(500).send({'status':0});//internal error
                }else{
                	res.status(200).send({'status':1 });//success
                }
            });
		});
	},
	
	getMajuri:(req, res) =>{
		con.connect(function(err) {
			con.query("SELECT * FROM majuri where crop_id = '"+ req.body.cropId+"' order by id desc", function (err, result) {
				if (err) {
				   res.status(500).send();
			   }else{
					if(result.length>0){
						var sql = 'SELECT SUM(majuri) totalMajuri from majuri where crop_id =  "'+ req.body.cropId+'"';
						con.query( sql, function(err,totalMajuriRes){
							
							result[0].totalMajuri = totalMajuriRes[0].totalMajuri;
							res.status(200).send({'status':1,'majuriList':result});//1 login success
						});
					}else {
						res.status(401).send({'status':0});// 0 user not found
					}
				}
			 });
	   });
	},

	deleteMajuri:(req, res)=>{
		console.log(req.body);
		
		con.connect(function(err){
			con.query('delete from majuri where id = '+req.body.Id+'',function(err,result){
				if(err){
					res.status(501).send({'status':0 });
				}
				res.status(200).send({'status':1});
			})
		})
	}

}

module.exports = majuri;