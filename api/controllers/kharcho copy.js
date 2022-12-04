const con =require('../../config/database');

const kharcho = {

    createKharcho: (req, res) => {
    	con.connect(function(err) {
			 con.query("INSERT into kharcho(crop_id,kharcho,details,amount,date) values('"+req.body.cropId+"','"+req.body.KharchType+"','"+req.body.Detail+"','"+req.body.Kharch+"','"+req.body.Date+"')", function (err, result) {
                if (err) {
                    res.status(500).send({'status':0});//internal error
                }else{
                	res.status(200).send({'status':1 });//success
                }
            });
		});
	},
	
	editKharcho: (req, res) => {
    	con.connect(function(err) {
			 con.query("update kharcho set kharcho='"+req.body.KharchType+"', details='"+req.body.Detail+"', amount ='"+req.body.Kharch+"', date='"+req.body.Date+"' where id='"+req.body.kharchId+"'" , function (err, result) {
                if (err) {
                    res.status(500).send({'status':0});//internal error
                }else{
                	res.status(200).send({'status':1 });//success
                }
            });
		});
	},

	getKharcho:(req, res) =>{
		con.connect(function(err) {
			con.query("SELECT * FROM kharcho where crop_id = '"+ req.body.cropId+"' order by id desc", function (err, result) {
				if (err) {
				   res.status(500).send();
			   }else{
					if(result.length>0){
						var sql = 'SELECT SUM(amount) totalKharcho from kharcho where crop_id =  "'+ req.body.cropId+'"';
						con.query( sql, function(err,totalKharchoRes){
							
							result[0].totalKharcho = totalKharchoRes[0].totalKharcho;
							
							res.status(200).send({'status':1,'kharchoList':result});
						})
						
					}else {
						res.status(200).send({'status':0});
					}
				}
			 });
	   });
	},

	deleteKharcho:(req, res)=>{
		console.log(req.body);
		con.connect(function(err){
			con.query('delete from kharcho where id = '+req.body.kharchId+'',function(err,result){
				if(err){
					res.status(501).send({'status':0 });
				}
				res.status(200).send({'status':1});
			})
		})
	}

}

module.exports = kharcho;