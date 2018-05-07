

// Getting data from Github(exported from CartoDB)



var dataset = "https://raw.githubusercontent.com/kefanl/bikeshare_groupfinal/master/themeMapData/stationData.geojson";
var featureGroup;


titleLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
           maxZoom: 18,
           attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;<a href="https://carto.com/attribution">CARTO</a>'
      }).addTo(map);


      var nMap=function(){
                titleLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
                     maxZoom: 18,
                     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;<a href="https://carto.com/attribution">CARTO</a>'
                }).addTo(mymap).bringToFront();
            };
var removeMarker = function(){
  if (typeof featureGroup !== 'undefined') {
    map.removeLayer(featureGroup);
  }
};
var reset = function() {
  removeMarker();
  defaultPage();
};

var map1 = function(event) {
  var Stamen_TonerLite = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map);

  featureGroup = L.geoJson(parsedData, {
    style: defaultStyle1,
    onEachFeature: defaultFeature1,
    pointToLayer: function(feature, lnglat) {
      return L.circleMarker(lnglat).bindPopup(feature.properties.station_name);
    }
  })
  map.addLayer(featureGroup);

};



$('#mapsChoice1').click(function(e){
  reset()
  removeMarker()
  map.eachLayer(function (layer) {
      map.removeLayer(layer)
  });
  $("#legend1").fadeIn();
  $("#legend2").hide();
  $("#legend3").hide();
  $("#legend4").hide();
  map1();

});



  var defaultColor1 = function(d) {
      return d > 6400  ? '#ffffcc' :
             d > 5000  ? '#a1dab4' :
             d > 4000  ? '#68bfa1' :
             d > 3000  ? '#2a9c9c' :
             d > 2000  ? '#02778e' :
                        '#045275';
  };
  var defaultRadius1 = function(d) {
      return d > 6400  ? 24 :
             d > 5000  ? 20 :
             d > 4000  ? 16 :
             d > 3000  ? 12 :
             d > 2000  ? 8 :
                        6;
  };
  var defaultStyle1 = function(feature) {
      return {color: "white",
              weight: 0,
              radius: defaultRadius1(feature.properties.totalcount),
              fillColor: defaultColor1(feature.properties.totalcount),
              opacity: 0.5,
              fillOpacity: 0.8,
      };
  };

  //set popup for default page
  var showName1 = function(feature) {
      var layer1 = feature.target;
      layer1.setStyle({radius: defaultRadius1(feature.properties.totalcount) + 10,
                      color: "white",
                      opacity: 0.5,
                      fillColor: "white",
                      fillOpacity: 0.4,
      });
      bindtext = "<dt>" + "Staiton Name: " + feature.properties.station_name + "</dt>";
      layer.bindTooltip(bindtext,{opacity: 0.7, offset:[-10,0], direction:'left'}).openTooltip();
  };
  var hideName1 = function(feature) {
      featureGroup.resetStyle(feature.target);
  };

  //set basic interaction for each station on default page
  var defaultFeature1 = function(feature, layer) {
      layer.on({
          mouseover: showName1,
          mouseout: hideName1,
      });
  };
//console basic map showing the popylarity of each station based on its totalcount of trips





var map2 = function(event) {
  var Stamen_TonerLite = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map);

  var featureGroup = L.geoJson(parsedData, {
    style: defaultStyle2,
    onEachFeature: defaultFeature2,
    pointToLayer: function(feature, lnglat) {
      return L.circleMarker(lnglat).bindPopup(feature.properties.start_count);
    }
  })
  map.addLayer(featureGroup);

};

$('#mapsChoice2').click(function(e){

  removeMarker()
  map.eachLayer(function (layer) {
      map.removeLayer(layer)
  });
  $("#legend1").hide();
  $("#legend2").fadeIn();
  $("#legend3").hide();
  $("#legend4").hide();
  map2();
});
//departurelayer



var defaultRadius2 = function(d) {
    return d > 6400  ? 24 :
           d > 5000  ? 20 :
           d > 4000  ? 16 :
           d > 3000  ? 12 :
           d > 2000  ? 8 :
                      6;
};
var defaultStyle2 = function(feature) {
    return {color: "orange",
            weight: 0,
            radius: defaultRadius2(feature.properties.start_count),
            fillColor: "orange",
            opacity: 0.5,
            fillOpacity: 0.8,
    };
};

//set popup for default page
var showName2 = function(feature) {
    var layer = feature.target;
    layer.setStyle({radius: 24,
                    color: "orange",
                    opacity: 0.5,
                    fillColor: "orange",
                    fillOpacity: 0.4,
    });
    bindtext = "<dt>" + "Departuer Trips: " + feature.properties.start_count + "</dt>";
    layer.bindTooltip(bindtext,{opacity: 0.7, offset:[-10,0], direction:'left'}).openTooltip();
};
var hideName2 = function(feature) {
    featureGroup.resetStyle(feature.target);
};

//set basic interaction for each station on default page
var defaultFeature2 = function(feature, layer) {
    layer.on({
        mouseover: showName2,
        mouseout: hideName2,
    });
};


var map3 = function(event) {
  var Stamen_TonerLite = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map);

  var featureGroup = L.geoJson(parsedData, {
    style: defaultStyle3,
    onEachFeature: defaultFeature3,
    pointToLayer: function(feature, lnglat) {
      return L.circleMarker(lnglat).bindPopup(feature.properties.end_count);
    }
  })
  map.addLayer(featureGroup);

};

$('#mapsChoice3').click(function(e){

  removeMarker()
  map.eachLayer(function (layer) {
      map.removeLayer(layer)
  });
  $("#legend1").hide();
  $("#legend2").hide();
  $("#legend3").fadeIn();
  $("#legend4").hide();
  map3();

});


var defaultRadius3 = function(d) {
    return d > 5000  ? 24 :
           d > 4000  ? 20 :
           d > 3000  ? 16 :
           d > 2000  ? 12 :
           d > 1000  ? 8 :
                      6;
};
var defaultStyle3 = function(feature) {
    return {color: "lightblue",
            weight: 0,
            radius: defaultRadius3(feature.properties.end_count),
            fillColor: "lightblue",
            opacity: 0.5,
            fillOpacity: 0.8,
    };
};

//set popup for default page
var showName3 = function(feature) {
    var layer = feature.target;
    layer.setStyle({radius: 24,
                    color: "lightblue",
                    opacity: 0.5,
                    fillColor: "lightblue",
                    fillOpacity: 0.4,
    });
    bindtext = "<dt>" + "Arrival Count: " + layer.feature.properties.end_count + "</dt>";
    layer.bindTooltip(bindtext,{opacity: 0.7, offset:[-10,0], direction:'left'}).openTooltip();
};
var hideName3 = function(feature) {
    featureGroup.resetStyle(feature.target);
};

//set basic interaction for each station on default page
var defaultFeature3 = function(feature, layer) {
    layer.on({
        mouseover: showName3,
        mouseout: hideName3,
    });
};


var map4 = function(event) {
  map.setView([39.96,-75.17],14);

  var featureGroup = L.geoJson(parsedData, {
    style: defaultStyle4,
    onEachFeature: defaultFeature4,
    pointToLayer: function(feature, lnglat) {
      return L.circleMarker(lnglat).bindPopup(feature.properties.oneway_ratio);
    }
  })
  map.addLayer(featureGroup);

};

var map4 = function(event) {



  var Stamen_TonerLite = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map);

  var featureGroup = L.geoJson(parsedData, {
    style: defaultStyle4,
    onEachFeature: defaultFeature4,
    pointToLayer: function(feature, lnglat) {
      return L.circleMarker(lnglat).bindPopup(feature.properties.oneway_ratio);
    }
  })
  map.addLayer(featureGroup);

};



$('#mapsChoice4').click(function(e){

  removeMarker()
  map.eachLayer(function (layer) {
      map.removeLayer(layer)
  });
  $("#legend1").hide();
  $("#legend2").hide();
  $("#legend3").hide();
  $("#legend4").fadeIn();
  map4()
});



var defaultColor4 = function(d) {
    return d > 0.95  ? '#ffffcc' :
           d > 0.90  ? '#a1dab4' :
           d > 0.85  ? '#68bfa1' :
           d > 0.80  ? '#2a9c9c' :
           d > 0.70  ? '#02778e' :
                      '#045275';
};
var defaultRadius4 = function(d) {
    return d > 0.95  ? 24 :
           d > 0.90  ? 20 :
           d > 0.85  ? 16 :
           d > 0.80  ? 12 :
           d > 0.70  ? 8 :
                      6;
};
var defaultStyle4 = function(feature) {
    return {color: "white",
            weight: 0,
            radius: defaultRadius4(feature.properties.oneway_ratio),
            fillColor: defaultColor4(feature.properties.oneway_ratio),
            opacity: 0.5,
            fillOpacity: 0.8,
    };
};

//set popup for default page
var showName4 = function(feature) {
    var layer = feature.target;
    layer.setStyle({radius: 24,
                    color: "white",
                    opacity: 0.5,
                    fillColor: "white",
                    fillOpacity: 0.4,
    });
    bindtext = "<dt>" + "Oneway Trip Ratio: " + layer.feature.properties.station_name + "</dt>";
    layer.bindTooltip(bindtext,{opacity: 0.7, offset:[-10,0], direction:'left'}).openTooltip();
};
var hideName4 = function(feature) {
    featureGroup.resetStyle(feature.target);
};

//set basic interaction for each station on default page
var defaultFeature4 = function(feature, layer) {
    layer.on({
        mouseover: showName4,
        mouseout: hideName4,
    });
};
