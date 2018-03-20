'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var requiresNotNull = function requiresNotNull(data, key) {
	if (data == null) throw Error(key + ' cannot be null');
};

var verifyDataType = function verifyDataType(data, type, key) {
	if (type === 'array') {
		if (Object.prototype.toString.call(data) !== '[object Array]') {
			throw Error('Invalid type for ' + key + '. Expecting ' + type + '.');
		}
	} else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== type) {
		throw Error('Invalid type for ' + key + '. Expecting ' + type + '.');
	}
};

var camelize = function camelize(str) {
	str = str.charAt(0).toLowerCase() + str.slice(1);
	return str.trim().replace(/[\s-][a-z]/g, function (match) {
		return match.slice(-1).toUpperCase();
	});
};

var events = {};
var classInstanceRef = [];

var Event = function () {
	function Event(event, eventDesc) {
		_classCallCheck(this, Event);

		this.handler = {};
		this.eventName = eventName;
		this.eventDesc = eventDesc;
	}

	_createClass(Event, [{
		key: 'fire',
		value: function fire() {
			preFire(this.eventDesc);
			for (var priority in this.handler) {
				preFirePerPriority(this.eventDesc, priority);
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = this.handler[priority][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var classInstance = _step.value;

						preFirePerClass(this.eventDesc, priority, classInstance);
						classInstance[this.eventName].apply(classInstance, arguments);
						postFirePerClass(this.eventDesc, priority, classInstance);
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				postFirePerPriority(this.eventDesc, priority);
			}
			postFire(this.eventDesc);
			return events;
		}
	}, {
		key: 'fireAsync',
		value: function fireAsync() {
			setTimeout.apply(undefined, [this.fire.bind(this), 0].concat(Array.prototype.slice.call(arguments)));
			return events;
		}
	}, {
		key: 'preFire',
		value: function preFire(event) {}
	}, {
		key: 'preFirePerPriority',
		value: function preFirePerPriority(eventDesc, priority) {}
	}, {
		key: 'preFirePerClass',
		value: function preFirePerClass(eventDesc, priority, classInstance) {}
	}, {
		key: 'postFirePerClass',
		value: function postFirePerClass(eventDesc, priority, classInstance) {}
	}, {
		key: 'postFirePerPriority',
		value: function postFirePerPriority(eventDesc, priority) {}
	}, {
		key: 'postFire',
		value: function postFire(event) {}
	}]);

	return Event;
}();

var setupPrePostConsumer = function setupPrePostConsumer(name, func) {
	verifyDataType(func, 'function', name);
	Event.prototype[name] = func;
};

var setupPreFire = function setupPreFire(func) {
	setupPrePostConsumer('preFire', func);
};
var setupPreFirePerPriority = function setupPreFirePerPriority(func) {
	setupPrePostConsumer('preFirePerPriority', func);
};
var setupPreFirePerClass = function setupPreFirePerClass(func) {
	setupPrePostConsumer('preFirePerClass', func);
};
var setupPostFirePerClass = function setupPostFirePerClass(func) {
	setupPrePostConsumer('postFirePerClass', func);
};
var setupPostFirePerPriority = function setupPostFirePerPriority(func) {
	setupPrePostConsumer('postFirePerPriority', func);
};
var setupPostFire = function setupPostFire(func) {
	setupPrePostConsumer('postFire', func);
};

var subscribeFor = function subscribeFor(eventDesc, classInstance) {
	var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'z';

	requiresNotNull(eventDesc, 'event');
	verifyDataType(eventDesc, 'string', 'event');
	var event = camelize(eventDesc);
	requiresNotNull(classInstance, 'classInstance');
	verifyDataType(classInstance, 'object', 'class instance');
	requiresNotNull(classInstance[event], 'classInstance.' + event);
	verifyDataType(classInstance[event], 'function', 'classInstance.' + event);
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
		'i': events[event].handler[priority].length - 1
	});
};

var subscribe = function subscribe(classInstance) {
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = classInstance.events()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var event = _step2.value;

			var _eventName = void 0,
			    priority = void 0;
			if (typeof event === 'string') {
				_eventName = event;
				priority = 'z';
			} else {
				_eventName = event.event;
				priority = event.priority;
			}
			subscribeFor(_eventName, classInstance, priority);
		}
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2.return) {
				_iterator2.return();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}
};

var unsubscribe = function unsubscribe(classInstance) {
	for (var i = 0; i < classInstanceRef.length; i++) {
		var compRef = classInstanceRef[i];
		if (compRef.classInstance === classInstance) {
			compRef.ref.splice(compRef.i, 1);
			classInstanceRef.splice(i, 1);
			i--;
		}
	}
};

var fire = function fire(event) {
	for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		args[_key - 1] = arguments[_key];
	}

	var eventName = camelize(event);
	if (events[eventName]) {
		events[eventName].fire.apply(events[eventName], args);
	}
};

var fireAsync = function fireAsync(event) {
	for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
		args[_key2 - 1] = arguments[_key2];
	}

	var eventName = camelize(event);
	if (events[eventName]) {
		events[eventName].fireAsync.apply(events[eventName], args);
	}
};

exports.subscribe = subscribe;
exports.subscribeForEvent = subscribeForEvent;
exports.events = events;
exports.fire = fire;
exports.fireAsync = fireAsync;
exports.unsubscribe = unsubscribe;
exports.setupPreFire = setupPreFire;
exports.setupPreFirePerPriority = setupPreFirePerPriority;
exports.setupPreFirePerClass = setupPreFirePerClass;
exports.setupPostFirePerClass = setupPostFirePerClass;
exports.setupPostFirePerPriority = setupPostFirePerPriority;
exports.setupPostFire = setupPostFire;
