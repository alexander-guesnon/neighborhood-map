// TODO: README


var markers = []; // google maps marker list
var map;
var previousWindow;
var previousitem;
var bounds;

function errorHander() {
  alert("The google maps api is currently having an issue.");
}
function addMarker(a, info) {
    var tempmarker;
  tempmarker = new google.maps.Marker({
    position: {
      lat: info.query.geosearch[a].lat,
      lng: info.query.geosearch[a].lon
    },
    map: map,
    title: info.query.geosearch[a].title,
    animation: google.maps.Animation.DROP
  });
  markers.push(tempmarker);
  bounds.extend(markers[a].position);
  tempmarker.addListener('click', function() {
    populateInfoWindow(this, previousWindow);
  });
}


function populateInfoWindow(marker, infowindow) {

  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>' + '<a href=\"' + "https://www.google.com/maps/search/?api=1&query=" + marker.position.lat() + ", " + marker.position.lng() + "" + '\">' + "View on Google Maps" + '</a>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.setMarker = null;
    });

  }

}


function initMap() {
  previousWindow = new google.maps.InfoWindow();
  bounds = new google.maps.LatLngBounds();


  map = new google.maps.Map(document.getElementById('map'), {
    //san franciso
    center: {
      lat: 37.786971,
      lng: -122.399677
    },
    zoom: 13
  });
  //wikipida api json call
  $.getJSON("https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=37.786971%7C-122.399677&format=json&callback=?", function(data) {

      for (var i = 0; i < data.query.geosearch.length; i++) {
        addMarker(i, data);
    }


    map.fitBounds(bounds);
  }).fail(function() { // if the json fails
    alert("ERROR: wikipida API did not load the geo data for the map");
  });
}

var ViewModle = function() {
  var self = this;
  self.textBox = ko.observable();
  self.center = ko.observable({ //san franciso
    lat: 37.786971,
    lng: -122.399677
  });
  // wiki api location storage
  self.activeLocation = ko.observableArray([]);

  //filter is what is used to filter the list trhought user input
  //this function is activated on a click of a button
  self.filter = function() {
    var input = self.textBox(); // get data from textbox
    for (var i = 0; i < self.activeLocation().length; i++) {
      //if it is not equal to the sub string make set visable to false
      if (self.activeLocation()[i].title.indexOf(input) !== -1) {
        self.activeLocation.replace(self.activeLocation()[i], {
          title: self.activeLocation()[i].title,
          visable: true,
          hightlight: false
        });
        markers[i].setMap(map);
      } else {
        self.activeLocation.replace(self.activeLocation()[i], {
          title: self.activeLocation()[i].title,
          visable: false,
          hightlight: false
        });
        markers[i].setMap(null);
      }
    }
  };
  //load data from wiki geo api into the activeLocations array
  self.GetData = function() {
    $.getJSON("https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=37.786971%7C-122.399677&format=json&callback=?", function(data) {
      for (var i = 0; i < data.query.geosearch.length; i++) {
        var tempData = {
          title: data.query.geosearch[i].title,
          visable: true,
          hightlight: false
        };
        self.activeLocation.push(tempData);
      }
    }).fail(function() {
      alert("ERROR: wikipida API did not load the geo data for the list");
    });
  };
  // this is a hightlight style fro when a user clicks on the list
  self.style = function(item) {
    if (item === true) return 'hightlightList';
    if (item === false) return 'normal';
  };
  var previousitem = null;
  // if an item in teh list is clicked then make it red
  self.select = function() {
    console.log(previousitem);
    //close last window
    if (previousWindow !== null) {
      previousWindow.close();
    }
    // close the previuse list item so they dont all highlight
    if (previousitem !== null) {
      for (var i = 0; i < self.activeLocation().length; i++) {
        if (self.activeLocation()[i].title == previousitem.title) {
          self.activeLocation.replace(self.activeLocation()[i], {
            title: self.activeLocation()[i].title,
            visable: self.activeLocation()[i].visable,
            hightlight: false
          });
          break;
        }

      }
    }
    previousitem = this;
    self.activeLocation.replace(previousitem, {
      title: this.title,
      visable: this.visable,
      hightlight: true
    });
    // pop up the window on teh mapp
    previousWindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    for (var j = 0; j < markers.length; j++) {
      if (markers[j].title === this.title) {
        populateInfoWindow(markers[j], previousWindow);
        break;
      }

    }
  };
};

// apply bindings
var vm = new ViewModle();
vm.GetData();
ko.applyBindings(vm);
