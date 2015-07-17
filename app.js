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
		//console.log(url);
		var temp = url.split('&');
		latitude = temp[0].split('=')[1];
		longitude = temp[1].split('=')[1];
		radius = temp[2].split('=')[1];
	}

	var ret = 'https://data.cityofchicago.org/resource/ijzp-q8t2.json?$limit=1000&$where=within_circle(location,'+ latitude + ',' + longitude + ',' + radius + ')';

	var request = require('request');
	var gbl = "abc" 

	var call_hell2 = function(c,b,d) {
		var temp = parseFloat(c)/1000.0;
		var temp2 = parseFloat(d);
		var ret = ((0.75*temp + 0.25*temp2)*100).toFixed(2);
		var val = "";
		if(ret >= 75)
			val = "Danger";
		else if(ret >= 25)
			val = "Warning";
		else
			val = "Safe";
		response.send(c +"<br>" + b + "<br>" + ret + "<br>" + val);
	};

	var call_hell = function(c,lat,long) {
		var Forecast = require('forecast');
		var lat_temp = lat;
		var long_temp = long;
		// Initialize 
		var forecast = new Forecast({
			service: 'forecast.io',
			key: '4edd94e0790dcf003f63440b3ab7f6dd',
			units: 'fahrenheit' // Only the first letter is parsed
		});

		forecast.get([lat_temp, long_temp], true, function(err, weather) {
			var temp = String(c);
			if(err) return console.dir(err);
			var temp2 = String(JSON.stringify(weather));
			var num = temp2.indexOf('summary');
			var temp3 = String(temp2.substr(num).split('\"')[2]).toLowerCase();
			var dict = {
				"clear": 0.001,
				"no precipitation": 0.001,
				"mixed precipitation": 0.094,
				"possible light precipitation": 0.0023,
				"light precipitation": 0.037,
				"precipitation": 0.087,
				"heavy precipitation": 0.107,
				"possible drizzle": 0.0045,
				"drizzle": 0.016,
				"possible light rain": 0.008,
				"light rain": 0.021,
				"rain": 0.059,
				"heavy rain": 0.065,
				"possible light sleet": 0.008,
				"light sleet": 0.096,
				"sleet": 0.119,
				"heavy sleet": 0.147,
				"possible flurries": 0.0028,
				"flurries": 0.093,
				"possible light snow": 0.042,
				"light snow": 0.084,
				"snow": 0.137,
				"heavy snow": 0.158,
				"breezy": 0.023,
				"windy": 0.020,
				"dangerously windy": 0.041,
				"dry": 0.002,
				"humid": 0.005,
				"foggy": 0.008,
				"partly cloudy": 0.001,
				"mostly cloudy": 0.001,
				"overcast": 0.005,
				"this morning": null,
				"later this morning": null,
				"this afternoon": null,
				"later this afternoon": null,
				"this evening": null,
				"later this evening": null,
				"tonight": null,
				"later tonight": null,
				"tomorrow morning": null,
				"tomorrow afternoon": null,
				"tomorrow evening": null,
				"tomorrow night": null,
				"in the morning": null,
				"in the afternoon": null,
				"in the evening": null,
				"overnight": null,
				"today": null,
				"tomorrow": null,
				"on Sunday": null,
				"on Monday": null,
				"on Tuesday": null,
				"on Wednesday": null,
				"on Thursday": null,
				"on Friday": null,
				"on Saturday": null,
				"$1 min.": null,
				"$1\u00B0F": null,
				"$1\u00B0C": null,
				"$1 in.": null,
				"$1 cm.": null,
			}
			
			var ret = (dict[temp3]/.147)*.8;
			call_hell2(temp, temp3, ret);
		});
	};

	request.get(ret, function (error, res, body) {
		var temp = ret.substring(ret.indexOf('location'));
		var temp2 =temp.split(',');
		var lat = parseFloat(temp2[1]);
		var long = parseFloat(temp2[2]);
		var count = (body.match(/case_number/g) || []).length;
		call_hell(count,lat,long);
	});
}

app.get('/:info', function (req, res) {
	handleRequest(req, res);
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
