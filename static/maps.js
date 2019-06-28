coffee_shops_markers = []
coffee_info_window = []
var coffee_mug_icon
function marker_listener(info, mark) {
  mark.addListener('click', function() {
    close_all_info_windows()
    info.open(map, mark);
  })
}
function map_listener() {
  map.addListener('click', function() {
    close_all_info_windows()
  })
}
function close_all_info_windows() {
  for (var i = coffee_info_window.length - 1; i >= 0; i--) {
    coffee_info_window[i].close();
  }
}
window.coffeeshops_callback = function(results) {
  for (var i = 0; i < results.coffee_shops.length; i++) {
    var coords = results.coffee_shops[i].coordinates;
    var latLng = new google.maps.LatLng(coords[0],coords[1]);

    var full_circle = ""
    var hollow_circle = ""
    for (var j = results.coffee_shops[i].score - 1; j >= 0; j--) {
      full_circle += '<div class="full-circle"></div>'
    }
    for (var j = 3 - results.coffee_shops[i].score - 1; j >= 0; j--) {
      hollow_circle += '<div class="hollow-circle"></div>'
    }

    var content = '<h1>'+results.coffee_shops[i].name+'</h1>'+
      'Nota '+full_circle+hollow_circle+'<br><br>'+
      results.coffee_shops[i].description+'<br><br>'+
      '<a href="'+results.coffee_shops[i].maps_link+'" target="_blank">Veja no Google Maps</a>'

    var infowindow = new google.maps.InfoWindow({
      content: content
    });
    coffee_info_window.push(infowindow)

    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: results.coffee_shops[i].name,
      icon: coffee_mug_icon
    });
    coffee_shops_markers.push(marker)
    marker_listener(infowindow, marker)
    api_result = results
  }
}

var filter = document.getElementById("filter-select");
filter.addEventListener("change", function() {
    // hide markers
    setMapOnAll(null)
    if(filter.value == "no-filter") {
      setMapOnAll(map)
    } else {
      setMapOn(map, filter.value)
    }
});

function setMapOnAll(map) {
  for (var i = 0; i < coffee_shops_markers.length; i++) {
    coffee_shops_markers[i].setMap(map);
  }
}

function setMapOn(map, score) {
  for (var i = 0; i < coffee_shops_markers.length; i++) {
    if (api_result.coffee_shops[i].score == parseInt(score, 10)) {
      coffee_shops_markers[i].setMap(map);
    }
  }
}

function initZoomControl(map) {
  document.querySelector('.zoom-control-in').onclick = function() {
    map.setZoom(map.getZoom() + 1);
  };
  document.querySelector('.zoom-control-out').onclick = function() {
    map.setZoom(map.getZoom() - 1);
  };
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
      document.querySelector('.zoom-control'));
}

var map;
function initMap() {
  var styledMapType = new google.maps.StyledMapType(
    [
      {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{color: '#c9b2a6'}]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'geometry.stroke',
        stylers: [{color: '#dcd2be'}]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [{color: '#ae9e90'}]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#93817c'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [{color: '#a5b076'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#447530'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#f5f1e6'}]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{color: '#fdfcf8'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#f8c967'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#e9bc62'}]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry',
        stylers: [{color: '#e98d58'}]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry.stroke',
        stylers: [{color: '#db8555'}]
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [{color: '#806b63'}]
      },
      {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.fill',
        stylers: [{color: '#8f7d77'}]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#ebe3cd'}]
      },
      {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [{color: '#b9d3c2'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#92998d'}]
      }
    ],
    {name: 'Styled Map'});
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -22.936947, lng: -43.245670},
    zoom: 12,
    disableDefaultUI: true,
  });
  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');
  initZoomControl(map)
  map_listener()

  var script = document.createElement('script');
  script.src = '/static/coffee-shops.js';
  document.getElementsByTagName('head')[0].appendChild(script);
  coffee_mug_icon = "/static/mug.png"
}