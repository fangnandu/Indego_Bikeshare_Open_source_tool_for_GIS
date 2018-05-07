
var dataset = "https://raw.githubusercontent.com/kefanl/bikeshare_groupfinal/master/themeMapData/stationData.geojson";
var phillyBoundary = "https://gist.githubusercontent.com/anonymous/eb5a6386acba87e14f8f4262cb4d0488/raw/7d073e2bab2e0a2cb55e1b19e0b9439bc833c886/boundary.json";
var parsedData;
$.ajax(dataset).done(function(data){
  parsedData = JSON.parse(data);
});

$(document).ready(function() {
  // Philly boundary
  $.ajax(phillyBoundary).done(function(data) {
    boundary = JSON.parse(data);
    defaultBoundary();
    });
  });

  var map = L.map('map', {
    center: [39.96,-75.17],
    zoom: 14
  });

  var Stamen_TonerLite = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map);
// the default boundary

var defaultBoundary = function(event) {
  var boundaryStyle = {
    color:"white",
    opacity:0.4,
    weight:1,
    fillOpacity:0,
    dashArray: '5',
  };
  featureGroup = L.geoJson(boundary, {
    style: boundaryStyle,
  }).addTo(map);
};


$(document).ready(function() {
  // Philly boundary
  $.ajax(phillyBoundary).done(function(data) {
    boundary = JSON.parse(data);
    defaultBoundary();
    // First plot philly boundary then plot markers - crucial for layer order
    $.ajax(dataset).done(function(data) {
      parsedData = JSON.parse(data);
      defaultPage();
    });
  });
});


$('#route').click(function(e){
  reset()
  removeMarker()
  map.eachLayer(function (layer) {
      map.removeLayer(layer)
  });

  defaultPage()

});

$('#info').click(function(e){
  reset()
  removeMarker()
  map.eachLayer(function (layer) {
      map.removeLayer(layer)
  });

  defaultPage()

});
//default maps:
var defaultPage = function(event) {

  var Stamen_TonerLite = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by < a href=" ">Stamen Design</ a>, < a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</ a> &mdash; Map data &copy; < a href="https://www.openstreetmap.org/copyright">OpenStreetMap</ a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map);
  featureGroup = L.geoJson(parsedData, {
    style: {color: "#50EBEC",
            radius: 4,
            fillColor: "#50EBEC",
            weight: 4,
            opacity: 0.4,
            fillOpacity: 0.8},
    onEachFeature:onEachFeature,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    }
  }).addTo(map);
  map.setView([39.96,-75.17],14);
};


var removeMarker = function(){
  if (typeof featureGroup !== 'undefined') {
    map.removeLayer(featureGroup);
  }
};


$('#Animation').click(function(e){
  removeMarker();
});

var onEachFeature = function(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: clickEachFeature,
    });
};




// Default interacive feature
var highlightFeature = function(feature) {
    var layer = feature.target;
    layer.setStyle({radius: 12,
                    color: "white",
                    opacity: 0.5,
                    fillColor: "white",
                    fillOpacity: 0.8,
    });
    bindtext = "<dt>" + "Store ID: " + layer.feature.properties.cartodb_id + "</dt>" +
               "<dt>" + "Address: " + layer.feature.properties.end_count + "</dt>" ;
};

var resetHighlight = function(feature) {
    featureGroup.resetStyle(feature.target);
};

var clickEachFeature = function(feature) {

    var x = document.getElementById("route-page");
    if(x.style.display === "none"){
    // hide all other pages
    $('.intsidebar').fadeIn();
    $('#stationInfo').fadeIn();
    $('#maps-page').hide();
    $("#filter-page").hide()
    var layer = feature.target;
    fillInfo(layer);
  }else{
    if(x.style.display !== "none"){
      // hide all other pages
      $('.intsidebar').fadeIn();
      $('#stationInfo').hide();
      $('#maps-page').hide();
      $("#filter-page").hide()
      var layer = feature.target;
      fillInfo(layer);
      /* =====================
      Route
      ===================== */
      var state = {
        position: {
          marker: null,
          updated: null
        }
      };

      // Personized drop pin icon to mark current location
      var myIcon = L.icon({
        iconUrl: 'my-icon.png',
        iconSize: [35, 30],
        popupAnchor: [0, -20]
      });

      var myIcon2 = L.icon({
        iconUrl: 'my-icon-default.png',
        iconSize: [35, 30],
        popupAnchor: [0, -20]
      });

      var updatePosition = function(lat, lng, updated) {
        if (state.position.marker) { map.removeLayer(state.position.marker); }
        state.position.marker = L.marker([lat, lng],{icon: myIcon});
        state.position.updated = updated;
        locationMarker = state.position.marker;
        locationMarker.addTo(map).bindPopup('Your current location');
      };

      // Set the original location
      var origin = {"lat":0, "lng":0};

      // Only the first time user clicks the route page, we will ask if user allows for geolocating their position
      $('#route-page').one("click", function () {
        /* This 'if' check allows us to safely ask for the user's current position */
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(function(position) {
            updatePosition(position.coords.latitude, position.coords.longitude, position.timestamp);
            // Set current position as the origin
            origin.lat = position.coords.latitude;
            origin.lng = position.coords.longitude;
            console.log(origin);
          });
        } else {
          alert("Allow us to know your current position to try the 'Route' page!");
        }
      });

          var dest_lat = $('#lat').val();
          var dest_lng = $('#lng').val();


        // Check if the store ID is entered correctly
          /* If fail to get correct current location, se default start point*/
          if (origin.lng === 0 || origin.lat === 0) {
            origin.lat = 39.952562;
            origin.lng = -75.192620;
            alerttext = "<dt>" + "Defalut location marker" + "</dt>" +
                        "<dt>" + "(Shows if unable to get your location)" + "</dt>";
            L.marker([origin.lat, origin.lng],{icon: myIcon2}).addTo(map).bindPopup(alerttext);
          }
          /* Otherwise, use user's current location as the origin */
          var myToken = "pk.eyJ1Ijoibm9yYXlpbiIsImEiOiJjamZoYnVhajYzcWRjMnFvZnhkc2lkaDFnIn0.uwQxjsuwtL0epbau5U0M7Q";
          var route = "https://api.mapbox.com/directions/v5/mapbox/driving/" + origin.lng + "," + origin.lat + ";" + dest_lng + "," + dest_lat + "?access_token=" + myToken;
          $.ajax(route).done(function(data){
            var eachRoute = decode(data.routes[0].geometry);
            var latlngs = _.map(eachRoute, function(each) {return [each[1]*10, each[0]*10];});
            // Map the route using turf.js
            var line = turf.lineString(latlngs);
            var routeStyle = {
              "color": "pink",
              "weight": 3,
              "opacity": 0.7
            };
            generatedRoute = L.geoJson(line, {style: routeStyle}).addTo(map);
          });

          var removeLine = function(){
            if (typeof generatedRoute !== 'undefined') {
              map.removeLayer(generatedRoute);
            }
          };


          $("#clear").click(function(e) {
            $('#usr').val('');
            removeLine();


          });


    }else{}



  }


};

var fillInfo = function(layer) {
  $('#station_id').val("Station ID: " + layer.feature.properties.stationid);
  $('#station_name').val("Station Name: " + layer.feature.properties.station_name);
  $('#total_num_rides').val("Total Num Rides: " + layer.feature.properties.totalcount);
  $('#startcount').val("Departure Num Rides: " + layer.feature.properties.start_count);
  $('#end_count').val("Arrival Num Rides: " + layer.feature.properties.end_count);
  $('#onewaycount').val("Oneway Num Rides: " + layer.feature.properties.oneway_count);
  $('#roundwaycount').val("Rounndway Num Rides: " + layer.feature.properties.roundway_count);
  $('#inoutratio').val("in/out ratio: " + layer.feature.properties.inoutratio);
  $('#onewayroundwayratio').val("oneway ratio: " + layer.feature.properties.oneway_ratio);
  $('#lat').val(layer.feature.properties.lat);
  $('#lng').val(layer.feature.properties.lng);


};








//animation part
// Include this CSS so that torque knows what to do
var CARTOCSS = [
  'Map {',
    '-torque-frame-count: 256;',
    '-torque-animation-duration: 30;',
    '-torque-time-attribute: "start_time";',
    '-torque-aggregation-function: "count(1)";',
    '-torque-resolution: 4;',
    '-torque-data-aggregation: linear;',
  '}',
  '#layer {',
    'marker-width: 7;',
    'marker-fill: #7fb7d7;',
    'marker-fill-opacity: 0.9;',
    'marker-line-width: 1;',
    'marker-line-color: #FFFFFF;',
    'marker-line-opacity: 1;',
    'comp-op: lighter;',
  '}',
  '#layer[frame-offset=1] {',
    'marker-width: 9;',
    'marker-fill-opacity: 0.45;',
  '}',
  '#layer[frame-offset=2] {',
    'marker-width: 11;',
    'marker-fill-opacity: 0.225;',
  '}'
].join('\n');

// Create the actual layer to be used
var torqueLayer = new L.TorqueLayer({
  user: 'fangnandu',
  cartocss: CARTOCSS,
});

$('#Animation').click(function(e){
  featureGroup = torqueLayer.addTo(map);
  torqueLayer.setSQL("SELECT * FROM dataanimation_1 ");
  torqueLayer.play()
});

// On timechange, update the HTML which hovers over the upper right of the map
torqueLayer.on('change:time', function(d) {
  var time = $('<h3>').text('Time - ' + moment(d.time).format('HH:mm'));
  $('div#time-window div').empty();
  $('#time-window div').append(time);
});
$('#time-window')
  .append($('<h1>').text('Date - 2017-12-1' ))
  .append($('<div>'));

/* =====================
Basic Change of Slides
===================== */
function changeSildes() {
  var x = document.getElementById("slide1");
  if (x.style.display !== "none") {
    x.style.display = "none";
  } else {
  }
  var y = document.getElementById("slide2");
  if (y.style.display === "none") {
    y.style.display = "block";
  } else {
  }
}
function backtoHome() {
  var x = document.getElementById("slide2");
  if (x.style.display !== "none") {
    x.style.display = "none";
  } else {
  }
  var y = document.getElementById("slide1");
  if (y.style.display === "none") {
    y.style.display = "block";
  } else {
  }
}
function reShowIntro() {
  analytical1.style.display = "block";
}
function seeVideo() {
  var x = document.getElementById("analytical1");
  x.style.display = "none";
}
//navigation
$('.intsidebar').hide();
$('#maps-page').hide();
$('#stationInfo').fadeIn();
$("#time-window").hide();
$("#route-page").hide();


$('#maps').click(function(e){
  $('.intsidebar').fadeIn();
  $('#maps-page').fadeIn();
  $('#stationInfo').hide();
  $("#route-page").hide();
  $("#time-window").hide();
});

$('#Animation').click(function(e){
  $('.intsidebar').hide();
  $('#maps-page').hide();
  $('#stationInfo').hide();
  $("#route-page").hide();
  $("#time-window").fadeIn();
});

$('#info').click(function(e){
  $('.intsidebar').fadeIn();
  $('#stationInfo').fadeIn();
  $('#maps-page').hide();
  $("#route-page").hide();
  $("#time-window").hide();
});


$('#route').click(function(e){
  $('.intsidebar').fadeIn();
  $('#stationInfo').hide();
  $('#maps-page').hide();
  $("#route-page").fadeIn();
  $("#time-window").hide();
});

/* =====================
Change Slides
===================== */
