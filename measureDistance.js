let lat1 = -26.698866;
let lon1 = 27.84233;
let lat2 = -26.205178;
let lon2 = 28.042372;

function measureDistance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		// if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

let distance = measureDistance(lat1, lon1, lat2, lon2, "K");
console.log(Math.round(distance) + "KM away");