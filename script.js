$(function() {
	$("input").val("");
	var $city = $("#city");
	var $country = $("#country");
	var $temp = $("#temperature");
	var $tempUnit = $("#temperatureUnit");
	var $weatherDesc = $("#weatherDescription");
	var $weatherAnimation = $("#weatherAnimation");
	// var lat, long; // to get your location when page loads(now removed)
	var temp;
	var timeHour;

	// Switch between Celsius and Fahrenheit
	$tempUnit.on("click", function() {
		if ($tempUnit.text() === "C") {
			temp = temp * 1.8 + 32;
			$temp.html(temp.toFixed(0) + "<sup>o</sup>");
			$tempUnit.text("F");
		} else {
			temp = (temp - 32)/1.8;
			$temp.html(temp.toFixed(0) + "<sup>o</sup>");
			$tempUnit.text("C");
		}
	});

	$("#input").keypress(function(event) {
		if (event.which === 13) {
			var arr = [];
			var str = $("input").val();
			arr = str.split(", ");
			city = arr[0];
			$("input").val("");
			$.getJSON("https://api.openweathermap.org/data/2.5/weather?q=" + arr +"&APPID=5b02ec69db10c31710ca4545e36de646")			
				.done(function(data) {
					var rawJson = JSON.stringify(data);
					var json = JSON.parse(rawJson);
					var weather = json.weather[0].description;
					$weatherDesc.text(weather.toUpperCase());
					$("#humidity").text("Humidity " + json.main.humidity + "%");
					$country.text(", " + json.sys.country);
					$city.text(city.charAt(0).toUpperCase() + city.substr(1));
					temp = json.main.temp - 273.15;
					$temp.html(temp.toFixed(0) + "<sup>o</sup>");
					$tempUnit.text("C");

					var iconID = json.weather[0].icon;
					weatherAnimate(iconID);

					getTime(json.coord.lat, json.coord.lon);
					})
				.fail(function(jqXHR, textStatus, errorThrown) {
					alert("Enter a valid city name!");
				});
		}
	});

	// $.getJSON("link").done(f(){}).fail(f(){});

	function getTime(lat, long) {
		$.getJSON('http://api.geonames.org/timezoneJSON?lat=' + lat + '&lng=' + long + '&username=smokahontas', function(timezone) {
      var rawTimeZone = JSON.stringify(timezone);
      var parsedTimeZone = JSON.parse(rawTimeZone);
      var dateTime = parsedTimeZone.time;
      timeFull = dateTime.substr(11);
      $("#time").html(timeFull); //Update local time
      timeHour = dateTime.substr(-5, 2);
		});	
	}

	function weatherAnimate(iconID) {
		var skycons = new Skycons({"color": "white"});
		if (iconID === "01d") {
      skycons.set("animated-icon", "clear-day");
    } else if (iconID === "01n") {
      skycons.set("animated-icon", "clear-night");
    } else if (iconID === "02d") {
      skycons.set("animated-icon", "partly-cloudy-day");
    } else if (iconID === "02n") {
      skycons.set("animated-icon", "partly-cloudy-night");
    } else if (iconID === "03d" || iconID === "03n" || iconID === "04d" || iconID === "04n") {
      skycons.set("animated-icon", "cloudy");
    } else if (iconID === "09d" || iconID === "09n") {
      skycons.set("animated-icon", "rain");
    } else if (iconID === "10d" || iconID === "10n" || iconID === "11d" || iconID === "11n") {
      skycons.set("animated-icon", "sleet");
    } else if (iconID === "13d" || iconID === "13n") {
      skycons.set("animated-icon", "snow");
    } else {
      skycons.set("animated-icon", "fog");
    };
    skycons.play();
	}
	


	// Get location's coordinates
	// function getLocation() {
	// 	if(navigator.geolocation) {
	// 		navigator.geolocation.getCurrentPosition(getPosition, showError);
	// 	} else {
	// 		locationDisplay.innerHTML = "Geolocation is not supported by this browser.";
	// 	}
	// }

	// Convert coordinates to city,country through an API with ajax
	// function getPosition(position) {
	// 	lat = position.coords.latitude;
	// 	long = position.coords.longitude;
	// 	//AJAX
	// 	$.getJSON("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long +"&APPID=5b02ec69db10c31710ca4545e36de646", function(data) {
	// 		var rawJson = JSON.stringify(data);
	// 		var json = JSON.parse(rawJson);
	// 		$city.text(json.name);
	// 		$country.text(json.sys.country);
	// 		temp = json.main.temp - 273.15;
	// 		$temp.text(temp.toFixed(2));
	// 		$tempUnit.text("C");
	// 	});
	// }


	// // Error function if location not shown
	// function showError(error) {
	// 	switch(error.code) {
	// 		case error.PERMISSION_DENIED:
	// 			locationDisplay.innerHTML = "User denied the request.";
	// 			break;
	// 		case error.POSITION_UNAVAILABLE:
	// 			locationDisplay.innerHTML = "Location information is unavailable.";
	// 			break;
	// 		case error.TIMEOUT:
	// 			locationDisplay.innerHTML = "The request to get user location timed out.";
	// 			break;
	// 		case error.UNKNOWN_ERROR:
	// 			locationDisplay.innerHTML = "An unknown error occurred.";
	// 			break;
	// 	}
	// }



	// getLocation();

});