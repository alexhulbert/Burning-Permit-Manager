var bounds = new google.maps.LatLngBounds();
var markers = new Array();
var mmap;
var normalBounds = null;
var defaultBounds;
var zooming = false;
var waiting = false;

function setMap(map) {
	mmap = map;
}

function getMap() {
	return mmap;
}

function smoothZoom(map, level, cnt, isFinal, mode) {
	if (typeof mode === 'undefined' && cnt == level) {
		zooming = (isFinal ? false : zooming);
		return;
	} 
	
	if((typeof mode === 'undefined') ? level > cnt : mode) {
		if (cnt > level) {
			zooming = (isFinal ? false : zooming);
		} else {
			var z = google.maps.event.addListener(map, 'zoom_changed', function(event){
				google.maps.event.removeListener(z);
				smoothZoom(map, level, cnt + 1, isFinal, true);
			});
			setTimeout(function(){map.setZoom(cnt)}, 75);
		}
	} else {
		if (cnt < level) {
			zooming = (isFinal ? false : zooming);
		} else {
			var z = google.maps.event.addListener(map, 'zoom_changed', function(event) {
				google.maps.event.removeListener(z);
				smoothZoom(map, level, cnt - 1, isFinal, false);
			});
			setTimeout(function(){map.setZoom(cnt)}, 75);
		}
	}
}

function zoom(index) {
	if (zooming) {
		waiting = true;
		if (!waiting) {
			setTimeout(function() {
				zoom(index);
			}, 100);
		}
		return;
	}
	waiting = false;
	zooming = true;
	if (previousFocus == -1) {
		normalBounds = [mmap.getZoom(), mmap.getCenter()];
	}
	
	var panAndZoomIn = function() {
		setTimeout(mmap.panTo(markers[index].position), 10);
		google.maps.event.clearListeners(mmap, 'idle');
		var z = google.maps.event.addListener(mmap, 'idle', function() {
			smoothZoom(mmap, rules.focusLevel, mmap.getZoom(), true);
			google.maps.event.removeListener(z);
		});
	};
	
	if (mmap.getZoom() == normalBounds[0]) {
		//There's no need to zoom out. Its already zoomed out.
		panAndZoomIn();
	} else {
		google.maps.event.addListener(mmap, 'idle', panAndZoomIn);
		smoothZoom(mmap, normalBounds[0], mmap.getZoom(), false);
	}
}

function resetZoom() {
	normalBounds = defaultBounds;
	mmap.setZoom(mmap.getZoom() - 1);
	unZoom();
}

function unZoom() {
	if (zooming) {
		setTimeout(unZoom, 100);
		return;
	}
	zooming = true;
	var z = google.maps.event.addListener(mmap, 'idle', function() {
		mmap.panTo(normalBounds[1]);
		google.maps.event.removeListener(z);
	});
	smoothZoom(mmap, normalBounds[0], mmap.getZoom(), true);
}

function geolocate(places, callback) {
	//Making sure the APIKey for mapquest isn't URL-encoded
	try {
		var apikey = decodeURIComponent(rules.APIKeys.mapquest);
	} catch (e) {
		var apikey = rules.APIKeys.mapquest;
	}
	
	$.ajax({
		url: "http://www.mapquestapi.com/geocoding/v1/batch",
		method: "GET",
		dataType: "json",
		data: {
			key: apikey,
			inFormat: "json",
			maxResults: 1,
			json: JSON.stringify({
				locations: places,
				options: {
					thumbMaps: false
				}
			})
		},
		success: function(points) {
			for (var i = 0; i < points.results.length; i++) {
				loc = points.results[i].locations[0].latLng;
				callback(i, coords(loc.lat, loc.lng));
			}
		}
	});
}

function geolocate_gmaps(places, callback) {
	for (i in places) {
		!function(i) {
			var loc = places[i];
			loc = loc.replace(/ /g, '+');
			url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + loc + "&sensor=false";
			jQuery.getJSON(url).done(function(json) {
				var latitude = json["results"][0]["geometry"]["location"]["lat"];
				var longitude = json["results"][0]["geometry"]["location"]["lng"];
				callback(i, coords(latitude, longitude));
			});
		}(i)
	}
}

function coords(latitude, longitude) {
	return new google.maps.LatLng(latitude, longitude);
}

function get(url) {
	var result = "";
	$.ajax({
		type: 'get',
		async: false,
		url:  url,
		suppressErrors: true,
		success: function(data) {
			result = data;
		}
	});
	return result;
}

function plot(map) {
	if (markers.length > 1) {
		map.fitBounds(bounds);
		normalBounds = [map.getZoom(), map.getCenter()];
		defaultBounds = normalBounds;
	} else {
		map.setCenter(markers[0].getPosition());
	}
}

function addMarker(map, pos, image, text) {
	bounds.extend(pos);
	var timestamp = "m" + (new Date()).valueOf();
	$('#dummy').append('<p class="labels ' + timestamp + '">' + text + '</p>');
	var w = parseInt($('.' + timestamp).width()) + 8;
	var classes = timestamp;
	if (text != "") {
		classes += " labels";
	}
	
	$('#dummy *').remove();
	
	markers.push(new MarkerWithLabel({
		position: pos, 
		map: map,
		icon: image,
		labelContent: text,
		labelAnchor: new google.maps.Point(w/2, 0),
		labelClass: classes,
		labelStyle: {opacity: 0.75}
	}));
	
	$('#markers').append('<style>.' + timestamp + '{width: ' + w + 'px !important;}</style>');
}

function clearMap() {
	for(var i in markers) {
		markers[i].setMap(null);
	}
	bounds = new google.maps.LatLngBounds();
	normalBounds = null;
	$('#markers *').remove();
}

function drawMap(canvasID, zoom, center) {
	var markers = new Array();
	var mapOptions = {
		zoom: zoom,
		center: center,
		styles: getStyle(),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	return new google.maps.Map(document.getElementById(canvasID), mapOptions);
}

function findAvg(lats, longs) {
	var latitude = 0;
	var longitude = 0;
	for (var i in lats) {
		latitude += lats[i];
	}
	for (var i in longs) {
		longitude += longs[i];
	} 
	longitude /= longs.length;
	latitude /= lats.length;
	return new google.maps.LatLng(latitude, longitude);
}
