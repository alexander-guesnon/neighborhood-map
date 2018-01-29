// TODO: make map fixed
// TODO: implement wiki geo location
// TODO: hover over list
// TODO: make mobile freindly
/*  this.test = ko.computed(function() {
    var list = [1,2,3,4]; //th5s needs to wait for the api call to finish
    $.getJSON("https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=37.786971%7C-122.399677&format=json&callback=?", function(data) {
      for (var i = 0; i < data.query.geosearch.length; i++) {
        var marker = {
          title: data.query.geosearch[i].title,
          lat: data.query.geosearch[i].lat,
          lng: data.query.geosearch[i].lon
        };
          list.push(marker);
      }
    });
    return list;
  });

 console.log(this.test());*/

ko.onDemandObservable = function(callback, target) {
  var _value = ko.observable(); //private observable

  var result = ko.dependentObservable({
    read: function() {
      //if it has not been loaded, execute the supplied function
      if (!result.loaded()) {
        callback.call(target);
      }
      //always return the current value
      return _value();
    },
    write: function(newValue) {
      //indicate that the value is now loaded and set it
      result.loaded(true);
      _value(newValue);
    },
    deferEvaluation: true //do not evaluate immediately when created
  });

  //expose the current state, which can be bound against
  result.loaded = ko.observable();
  //load it again
  result.refresh = function() {
    result.loaded(false);
  };

  return result;
};




var ViewModle = function() {
  var self = this;
  //size of the location
  self.center = ko.observable({
    lat: 37.786971,
    lng: -122.399677
  });

  self.test = ko.observableArray([]);
  self.GetData = function() {
    $.getJSON("https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=37.786971%7C-122.399677&format=json&callback=?", function(data) {
        self.test.push(data.query.geosearch)
        console.log(data.query.geosearch)

      });
  };
  console.log(self.GetData());
  console.log(self.test())
};
ko.applyBindings(new ViewModle());



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
    var marker = new google.maps.Marker({
      position: {
        lat: data.query.geosearch[3].lat,
        lng: data.query.geosearch[3].lon
      },
      map: map,
      title: data.query.geosearch[3].title
    });

  });

}

$(document).ready(function() {



});
