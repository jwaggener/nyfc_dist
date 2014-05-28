'use strict';

var fs = require('fs');

exports.imageFromBase64 = function(req, res) {
	
	var path = 'app/images/colors/',
		imageData = req.param('imageData'),
		imageName = path + req.param('name') +'.png',
		data = imageData.replace(/^data:image\/\w+;base64,/, "");

	fs.writeFile( imageName, data, 'base64', function(err){console.log(err);});
	res.send(imageName);
};
