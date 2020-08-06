
	if ('geolocation' in navigator) {
	console.log('geolocation available');
	navigator.geolocation.getCurrentPosition(position => {
		// console.log(position);
		const lat = position.coords.latitude;
		const lon = position.coords.longitude;

		var query = "latitude=" + lat + "&longitude=" + lon + "&localityLanguage=en";
		const httpRequest = new XMLHttpRequest();
		
		var bigdatacloud_api =
		  "https://api.bigdatacloud.net/data/reverse-geocode-client?";
	
		bigdatacloud_api += query;
	
		httpRequest.open("GET", bigdatacloud_api);
		httpRequest.send();
		httpRequest.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
			  var myObj = JSON.parse(this.responseText);
			//   console.log(myObj);
			  const cityname = myObj.city;
			//   console.log(cityname)
			  const location = { lat, lon, cityname };
			//   console.log(location);
			  const options = {
				  method: 'POST',
				  headers: {
					  'Content-Type': 'application/json'
					},
				  body: JSON.stringify(location)
			  };
			  fetch('/users/location', options);
			}
		  };
	});
} else {
	console.log('geolocation not available');
}

