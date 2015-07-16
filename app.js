var http = require('http'),
	express = require('express'),
	path = require('path');

var server = http.createServer(app).listen;

var app = express();

app.set('port', process.env.PORT || 9456);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '');

function handleRequest(request, response) {
	var url = request.url;
	var latitude = ""; 
	var longitude = "";
	var radius = "";

	if(url.indexOf('latitude=') >= 0 && url.indexOf('longitude=') >= 0 & url.indexOf('radius=') >= 0) {
		console.log(url);
		var temp = url.split('&');
		latitude = temp[0].split('=')[1];
		longitude = temp[1].split('=')[1];
		radius = temp[2].split('=')[1];
	}

	var ret = 'https://data.cityofchicago.org/resource/ijzp-q8t2.json?$limit=50000&$where=within_circle(location,'+ latitude + ',' + longitude + ',' + radius + ')';
	console.log(ret);

	var request = require('request');

	request.get(ret, function (error, res, body) {
		var count = (body.match(/case_number/g) || []).length;

		response.send(String(count)+"\n");
	});

	var Forecast = require('forecast');

	// Initialize 
	var forecast = new Forecast({
		service: 'forecast.io',
		key: '4edd94e0790dcf003f63440b3ab7f6dd',
		units: 'fahrenheit' // Only the first letter is parsed 
	});

	// Retrieve weather information, ignoring the cache 
	
	forecast.get([parseFloat(latitude), parseFloat(longitude)], true, function(err, weather) {
		if(err) return console.dir(err);
		
		response.send(String(weather.summary));
	});

}

app.get('/:info', function (req, res) {
	handleRequest(req, res);
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
