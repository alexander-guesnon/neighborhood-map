// TODO: errorhandle apis
// TODO: comment code
// TODO: README


var markers = [];
var map;
var previousWindow;
var previousitem;

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
  var bounds = new google.maps.LatLngBounds();
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 37.786971,
      lng: -122.399677
    },
    zoom: 13
  });
  $.getJSON("https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=37.786971%7C-122.399677&format=json&callback=?", function(data) {
    for (var i = 0; i < data.query.geosearch.length; i++) {
      tempmarker = new google.maps.Marker({
        position: {
          lat: data.query.geosearch[i].lat,
          lng: data.query.geosearch[i].lon
        },
        map: map,
        title: data.query.geosearch[i].title
      });
      markers.push(tempmarker);
      tempmarker.addListener('click', function() {
        populateInfoWindow(this, previousWindow);
      });
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
  });
}

var ViewModle = function() {
  var self = this;
  self.center = ko.observable({
    lat: 37.786971,
    lng: -122.399677
  });
  self.activeLocation = ko.observableArray([]);
  self.filter = function() {
    var input = $("#textbox").val();
    for (var i = 0; i < self.activeLocation().length; i++) {
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
  }
  self.GetData = function() {
    $.getJSON("https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=37.786971%7C-122.399677&format=json&callback=?", function(data) {
      for (var i = 0; i < data.query.geosearch.length; i++) {
        var tempData = {
          title: data.query.geosearch[i].title,
          visable: true,
          hightlight: false
        };
        self.activeLocation.push(tempData)
      }
    });
  };
  self.style = function(item) {
    if (item == true) return 'hightlightList';
    if (item == false) return 'normal';
  }
  var previousitem;
  self.select = function() {
    //close last window
    if (previousWindow != null) {
      previousWindow.close();
    }
    if (previousitem != null) {

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
    previousWindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].title === this.title) {
        populateInfoWindow(markers[i], previousWindow);
        break;
      }

    }
  };
};

var vm = new ViewModle;
vm.GetData()
ko.applyBindings(vm);
