let requiresNotNull = (data, key) => {
  if (data == null)
    throw Error(`${key} cannot be null`);
}

let verifyDataType = (data, type, key) => {
  if (type === 'array') {
    if (Object.prototype.toString.call(data) !== '[object Array]') {
      throw Error(`Invalid type for ${key}. Expecting ${type}.`);
    }
  }
  else if (typeof data !== type) {
    throw Error(`Invalid type for ${key}. Expecting ${type}.`);
  }
}

let camelize = (str) => {
	str = str.charAt(0).toLowerCase() + str.slice(1);
	return str.trim().replace(/[\s-][a-z]/g, function(match) {
		return match.slice(-1).toUpperCase();
	});
}

const events = {};
let classInstanceRef = [];

class Event {
	constructor(event, eventDesc) {
		this.handler = {};
		this.eventName = eventName;
		this.eventDesc = eventDesc;
	}
	
	fire() {
		preFire(this.eventDesc);
		for (let priority in this.handler) {
			preFirePerPriority(this.eventDesc, priority);
			for (let classInstance of this.handler[priority]) {
				preFirePerClass(this.eventDesc, priority, classInstance);
				classInstance[this.eventName](...arguments);
				postFirePerClass(this.eventDesc, priority, classInstance);
			}
			postFirePerPriority(this.eventDesc, priority);
		}
		postFire(this.eventDesc);
		return events;
	}

	fireAsync() {
		setTimeout(this.fire.bind(this), 0, ...arguments);
		return events;
	}
	
	preFire(event) {
	}
	
	preFirePerPriority(eventDesc, priority) {
	}
	
	preFirePerClass(eventDesc, priority, classInstance) {
	}
	
	postFirePerClass(eventDesc, priority, classInstance) {
	}
	
	postFirePerPriority(eventDesc, priority) {
	}
	
	postFire(event) {
	}
}

const setupPrePostConsumer = (name, func) => {
	verifyDataType(func, 'function', name);
	Event.prototype[name] = func;
}

const setupPreFire = (func) => {
	setupPrePostConsumer('preFire', func);
};
const setupPreFirePerPriority = (func) => {
	setupPrePostConsumer('preFirePerPriority', func);
};
const setupPreFirePerClass = (func) => {
	setupPrePostConsumer('preFirePerClass', func);
};
const setupPostFirePerClass = (func) => {
	setupPrePostConsumer('postFirePerClass', func);
};
const setupPostFirePerPriority = (func) => {
	setupPrePostConsumer('postFirePerPriority', func);
};
const setupPostFire = (func) => {
	setupPrePostConsumer('postFire', func);
};

const subscribeForEvent = (eventDesc, classInstance, priority='z') => {
	requiresNotNull(eventDesc, 'event');
	verifyDataType(eventDesc, 'string', 'event');
	let event = camelize(eventDesc);
	requiresNotNull(classInstance, 'classInstance');
	verifyDataType(classInstance, 'object', 'class instance');
	requiresNotNull(classInstance[event], `classInstance.${event}`);
	verifyDataType(classInstance[event], 'function', `classInstance.${event}`);
	if (!events[event]) {
		events[event] = new Event(event, eventDesc);
	}
	if (!events[event].handler[priority]) {
		events[event].handler[priority] = [];
	}
	events[event].handler[priority].push(classInstance);
	classInstanceRef.push({
			'classInstance': classInstance, 
			'ref': events[event].handler[priority], 
			'i': events[event].handler[priority].length-1
		});
}

const subscribe = (classInstance) => {
	for (let event of classInstance.events()) {
		let eventName, priority;
		if (typeof event === 'string') {
			eventName = event;
			priority = 'z';
		}
		else {
			eventName = event.event;
			priority = event.priority;
		}
		subscribeForEvent(eventName, classInstance, priority);
	}
}

const unsubscribe = (classInstance) => {
	for (let i = 0; i < classInstanceRef.length; i++) {
		let compRef = classInstanceRef[i];
		if (compRef.classInstance === classInstance) {
			compRef.ref.splice(compRef.i, 1);
			classInstanceRef.splice(i, 1);
			i--;
		}
	}
}

const fire = (event, ...args) => {
	let eventName = camelize(event);
	if (events[eventName]) {
		events[eventName].fire.apply(events[eventName], args);
	}
}

const fireAsync = (event, ...args) => {
	let eventName = camelize(event);
	if (events[eventName]) {
		events[eventName].fireAsync.apply(events[eventName], args);
	}
}

export {
	subscribe,
	subscribeForEvent,
	events,
	fire,
	fireAsync,
	unsubscribe,
	setupPreFire,
	setupPreFirePerPriority,
	setupPreFirePerClass,
	setupPostFirePerClass,
	setupPostFirePerPriority,
	setupPostFire
}
