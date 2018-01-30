// TODO: make map fixed
// TODO: implement wiki geo location
// TODO: hover over list text
// TODO: make mobile freindly
// TODO: errorhandle apis
// TODO: comment code
// TODO: filter list
// TODO: make wiki search into varable so it is based on browser locaiton and also can change circle
// TODO: filter jquery using mvc and figure out how to delet items out of an array tempararylt or add a atrablute visable and figuer it out through html

var marker = [];
var map;
function initMap() {
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
      marker.push(tempmarker);
    }
  });

}

var ViewModle = function() {
  var self = this;
  self.center = ko.observable({lat: 37.786971, lng: -122.399677});
  self.activeLocation = ko.observableArray([]);
  self.filter = function(){
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
};

var vm = new ViewModle;
vm.GetData()
ko.applyBindings(vm);
