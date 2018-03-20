# rn-event-observable
JavaScript utility to subscribe and fire events for JavaScript classes.

# APIs
- subscribe(classInstance) : all events returned by 'events()' method of the class instance will be subscribed. 
-	subscribeForEvent(eventName, classInstance[, priority]) : Given event for the class will be subscribed. Optionally priority can be defined.
-	events : object holding all events registered. Each event has methods - fire and fireAsync (see usage below)
-	fire(event, ...args) : fire given event
-	fireAsync(event, ...args) : fire given event asynchronously
-	unsubscribe(classInstance) : The class instance will be unsubscribed from all events.
-	setupPreFire(func) : Optionally setup a function to be called before event fire.
-	setupPreFirePerPriority(func) : Optionally setup a function to be called before event fire for each priority.
-	setupPreFirePerClass(func) : Optionally setup a function to be called before event fire for each class instance.
-	setupPostFirePerClass(func) : Optionally setup a function to be called after event fire for each class instance.
-	setupPostFirePerPriority(func) : Optionally setup a function to be called after event fire for each priority.
-	setupPostFire(func) : Optionally setup a function to be called after event fire.

# Usage
```
//BootstrapAlert.js
import React from 'react'
import { subscribe, unsubscribe } from 'rn-event-observable'

class BootstrapAlert extends React.Component {
  constructor() {
  	super();
  	this.state = {type: '', message: ''};
  }
  componentDidMount() {
  	subscribe(this);
  }
  componentWillUnmount() {
  	unsubscribe(this);
  }
  events() {
  	return['alert-success', 'alert-fail'];
  }
  alertSuccess(data) {
  	this.setState({type: 'success', message: data});
  }
  alertFail(data) {
  	this.setState({type: 'danger', message: data});
  }
  render() {
    return <div className={`alert alert-${this.state.type} alert-dismissible`}>
		<a className="close" aria-label="close">&times;</a>{this.state.message}
	</div>;
  }
}

//App.js
import { events } from 'rn-event-observable'

if (loaded) {
  events.alertSuccess.fire('Successfully loaded');
} else {
  events.alertFail.fire('Failed to load.');
}
```
