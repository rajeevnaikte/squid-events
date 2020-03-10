var rnEventObservable = require("./index.js")

function x() {
}
x.prototype.events = function() {
  return ['test event'];
}
x.prototype.testEvent = function() {
  console.log('Hurray!!!');
}
x.prototype.testEvent2 = function() {
  console.log('Hurray2!!!');
}
rnEventObservable.subscribe(new x());
rnEventObservable.waitInQueueForEvent('test event2', new x());
rnEventObservable.events.testEvent.fire();
rnEventObservable.events.testEvent2.fire();
rnEventObservable.events.testEvent2.fire();
