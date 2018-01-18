//somthing
var ViewModle = function(){
  //modle
  this.list = ko.observableArray([1,2,3,4,5]);

  //control
  this.printedList = ko.computed(function() {
    var output ="";
    for(var i =0 ; i< this.list().length; i++){
      output+= "<li>"+ this.list()[i] +"</li>"
    }
    return output;
  }, this);
}
console.log()
ko.applyBindings(new ViewModle());
