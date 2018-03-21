var rnEventObservable = require("./index.js")

function x() {
}
x.prototype.events = function() {
  return ['test event'];
}
x.prototype.testEvent = function() {
  console.log('Hurray!!!');
}
rnEventObservable.subscribe(new x());
rnEventObservable.events.testEvent.fire();