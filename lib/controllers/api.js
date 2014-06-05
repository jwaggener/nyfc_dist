'use strict';

var fs = require('fs');
var knox = require('knox');

function exportToS3(imageName){
	var client = knox.createClient({
	  key: 'AKIAJ6NPGEQXBNTUDZEQ',
		secret: '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',
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
			console.log('error');
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
