'use strict';

var fs = require('fs');
var knox = require('knox');

function exportToS3(imageName){
	var client = knox.createClient({
	  key: process.env.S3_KEY,
		secret: process.env.S3_SECRET,
		bucket: 'nyfc-images'
	});
	
	client.putFile(imageName, '/images/nyfc/' + imageName.split('/')[1], function(err, res){
		if(err){
			console.log('error');
			return;
		}
		
		if (200 == res.statusCode) {
			console.log('success');
		} else {
			console.log('res', res.statusCode);
			console.log('!200 status code error');
		}
	});
}

exports.imageFromBase64 = function(req, res) {
	
	var path = 'tmp/',
		imageData = req.param('imageData'),
		imageName = path + req.param('name') +'.png',
		data = imageData.replace(/^data:image\/\w+;base64,/, "");

	fs.writeFile(imageName, data, 'base64', function(err){
		exportToS3(imageName);
		res.send(imageName);
	});

};
