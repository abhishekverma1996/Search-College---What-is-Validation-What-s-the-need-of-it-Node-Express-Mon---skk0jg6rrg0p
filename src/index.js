const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector');
app.get("/findColleges", async (req,res)=>{
	const name=(req.query.name)?req.query.name:"";
	const state=(req.query.state)?req.query.state:"";
	const city=(req.query.city)?req.query.city:"";
	let minPackage=(req.query.minPackage)?Number(req.query.minPackage):null;
	let maxFees=(req.query.maxFees)?Number(req.query.maxFees):null;
	const course=(req.query.course)?req.query.course:"";
	const exam=(req.query.exam)?req.query.exam:"";
	if(isNaN(minPackage) || minPackage<0) minPackage=null;
	if(isNaN(maxFees) || maxFees<0) maxFees=null;
//	console.log(name,state,city,course,exam,minPackage,maxFees);
	
	const list=await connection.find(
		{
			name: {
				$regex: name,
				$options: "i"
			},
			state: {
				$regex: state,
				$options: "i"			
			},
			city: {				
				$regex: city,
				$options: "i"
			},
			course: {
				$regex: course,
				$options: "i"
			},
			exam: {
				$regex: exam,
				$options: "i"
			}

		}
	);
	const updatedList=[];
	list.map((item,index)=>{
		let valid=true;
		if(minPackage!=null && item.minPackage<minPackage) {
			valid=false;
		}
		if(maxFees!=null && item.maxFees>maxFees) {
			valid=false;
		}
		if(valid) updatedList.push(item); 
	});
//	console.log(updatedList);
	res.json(updatedList);
	res.end();
});


app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;
