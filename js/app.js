// TODO: make map fixed
// TODO: make mobile freindly
// TODO: errorhandle apis
// TODO: comment code
// TODO: make wiki search into varable so it is based on browser locaiton and also can change circle
// TODO: clicking on a marker makes it show info


var markers = [];
var map;
function initMap() {
  var largeInfowindow = new google.maps.InfoWindow();
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
        populateInfoWindow(this, largeInfowindow);
      });
    }
  });
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
      });
    }
}
}

var ViewModle = function() {
  var self = this;
  self.center = ko.observable({lat: 37.786971, lng: -122.399677});
  self.activeLocation = ko.observableArray([]);
  self.filter = function(){
    //TODO: map markers need to be thined down
    var input = $("#textbox").val()
    for (var i = 0; i < self.activeLocation().length; i++) {
      if(self.activeLocation()[i].title.indexOf(input) !== -1){
          self.activeLocation.replace(self.activeLocation()[i],{title:self.activeLocation()[i].title, visable: true})
      }else{
          self.activeLocation.replace(self.activeLocation()[i],{title:self.activeLocation()[i].title, visable: false})
      }
    }
  }
  self.GetData = function() {
    $.getJSON("https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=37.786971%7C-122.399677&format=json&callback=?", function(data) {
      for (var i = 0; i < data.query.geosearch.length; i++) {
        var tempData = {title:data.query.geosearch[i].title,
        visable: true};
        self.activeLocation.push(tempData)
      }
    });
  };
  self.select = function(){
    //TODO: hover animation or color change
    //TODO: display the map marker info
    console.log(this);
  };
};

var vm = new ViewModle;
vm.GetData()
ko.applyBindings(vm);
