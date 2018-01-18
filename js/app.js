
var ViewModle = function(){
  this.list = ko.observableArray([1,2,3,4,5]);

}
ko.applyBindings(new ViewModle());


var map;

function initMap(){
map = new google.maps.Map(document.getElementById('map'),{
  center:{lat:40.7413549, lng:-73.9980244},
  zoom: 13
});
var location = {lat:40.719526, lng:-74.0089934};
var marker = new google.maps.Marker({
  position: location,
  map: map,
  title: 'first marker'
});
}
var script = document.createElement('script');

$(document).ready(function(){
  $.getJSON("https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=37.786971%7C-122.399677&format=json&callback=?", function(data) {
      console.log(data);
  });


});




//https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&keyword=cruise&key=AIzaSyCZHdlzT2y-Fj_hDLz7npwpF6KifyRjM1Q
