var map;
var ViewModle = function(){
  this.list = ko.observableArray([1,2,3,4,5]);

}
ko.applyBindings(new ViewModle());

function initMap(){
map = new google.maps.Map(document.getElementById('map'),{
  center:{lat:40.7413549, lng:-73.9980244},
  zoom: 13
});
}
