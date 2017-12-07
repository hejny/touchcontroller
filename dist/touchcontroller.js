(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const TouchController_1 = __webpack_require__(1);
	exports.TouchController = TouchController_1.default;
	const listeners_1 = __webpack_require__(6);
	exports.listeners = listeners_1.default;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const VectorTouch_1 = __webpack_require__(2);
	const Touch_1 = __webpack_require__(4);
	const AbstractClassWithSubscribe_1 = __webpack_require__(5);
	class TouchController extends AbstractClassWithSubscribe_1.default {
	    constructor(element) {
	        super();
	        this.element = element;
	        this.ongoingTouches = [];
	    }
	    //todo dispose
	    addListener(listener) {
	        listener.setListeners(this); //todo array of listeners
	    }
	    touchStart(id, type, event) {
	        const touch = new Touch_1.default(id, type, this._createVectorFromEvent(event));
	        this.ongoingTouches.push(touch);
	        this.callSubscribers('START', touch);
	    }
	    touchMove(id, end, event) {
	        const index = this._ongoingTouchIndexById(id);
	        if (index !== -1) {
	            const touch = this.ongoingTouches[index];
	            touch.move(this._createVectorFromEvent(event), end);
	            if (end) {
	                this.ongoingTouches.splice(index, 1);
	                this.callSubscribers('END', touch);
	            }
	            else {
	                this.callSubscribers('MOVE', touch);
	            }
	        }
	        else {
	            //console.warn(`Can't find touch with id "${id}".`);
	        }
	    }
	    _createVectorFromEvent(event) {
	        return new VectorTouch_1.default(this, event.clientX - this.element.offsetLeft, event.clientY - this.element.offsetTop, performance.now());
	    }
	    _ongoingTouchIndexById(idToFind) {
	        for (let i = 0; i < this.ongoingTouches.length; i++) {
	            const id = this.ongoingTouches[i].id;
	            if (id === idToFind) {
	                return i;
	            }
	        }
	        return -1;
	    }
	}
	exports.default = TouchController;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const Vector2_1 = __webpack_require__(3);
	class VectorTouch extends Vector2_1.default {
	    constructor(_touchController, x, y, t) {
	        super(x, y);
	        this._touchController = _touchController;
	        this.t = t;
	    }
	    to1() {
	        return new Vector2_1.default(this.x / this._touchController.element.clientWidth, this.y / this._touchController.element.clientHeight);
	    }
	}
	exports.default = VectorTouch;


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	class Vector2 {
	    constructor(x, y) {
	        this.x = x;
	        this.y = y;
	    }
	    static Zero() {
	        return new Vector2(0, 0);
	    }
	    add(vector3) {
	        return new Vector2(this.x + vector3.x, this.y + vector3.y);
	    }
	    subtract(vector3) {
	        return new Vector2(this.x - vector3.x, this.y - vector3.y);
	    }
	    scale(scale) {
	        return new Vector2(this.x * scale, this.y * scale);
	    }
	    length(vector2 = Vector2.Zero()) {
	        return Math.sqrt(Math.pow(this.x - vector2.x, 2) +
	            Math.pow(this.y - vector2.y, 2));
	    }
	    toArray() {
	        return [this.x, this.y];
	    }
	}
	exports.default = Vector2;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const AbstractClassWithSubscribe_1 = __webpack_require__(5);
	class Touche extends AbstractClassWithSubscribe_1.default {
	    constructor(id, type, firstPoint) {
	        super();
	        this.id = id;
	        this.type = type;
	        this._finished = false;
	        this.points = [firstPoint];
	    }
	    move(newPoint, end = false) {
	        this.points.push(newPoint);
	        if (!end) {
	            this.callSubscribers('MOVE', newPoint);
	        }
	        else {
	            this._finished = true;
	            this.callSubscribers('END', newPoint);
	        }
	    }
	    get firstPoint() {
	        return this.points[0];
	    }
	    get start() {
	        return this.firstPoint.t;
	    }
	    get finished() {
	        return this._finished;
	    }
	}
	exports.default = Touche;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	class AbstractClassWithSubscribe {
	    constructor() {
	        this._subscribers = [];
	    }
	    subscribe(event /*maybe multiple events TEvent[]*/, callback) {
	        this._subscribers.push({
	            event,
	            callback
	        });
	    }
	    //todo unsubscribe
	    callSubscribers(event, newValue) {
	        this._subscribers
	            .filter((subscriber) => subscriber.event === event)
	            .forEach((subscriber) => subscriber.callback(newValue));
	    }
	}
	exports.default = AbstractClassWithSubscribe;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const TouchListener_1 = __webpack_require__(7);
	const MouseListener_1 = __webpack_require__(8);
	exports.default = {
	    TouchListener: TouchListener_1.default,
	    MouseListener: MouseListener_1.default
	};


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	class TouchListener {
	    setListeners(touchController) {
	        this._touchController = touchController;
	        touchController.element.addEventListener("touchstart", (event) => this._handleTouchStart(event), false);
	        touchController.element.addEventListener("touchend", (event) => this._handleTouchEnd(true, event), false);
	        touchController.element.addEventListener("touchcancel", (event) => this._handleTouchEnd(false, event), false);
	        //todo element.addEventListener("touchleave", (event)=>this._handleTouchEnd(true,event), false);
	        touchController.element.addEventListener("touchmove", (event) => this._handleTouchMove(event), false);
	    }
	    unsetListeners() {
	        //todo
	    }
	    _handleTouchStart(event) {
	        event.preventDefault();
	        const touches = event.changedTouches;
	        for (let i = 0, l = touches.length; i < l; i++) {
	            this._touchController.touchStart('touch' + touches[i].identifier, 'TOUCH', touches[i]);
	        }
	    }
	    _handleTouchMove(event) {
	        event.preventDefault();
	        const touches = event.changedTouches;
	        for (let i = 0, l = touches.length; i < l; i++) {
	            this._touchController.touchMove('touch' + touches[i].identifier, false, touches[i]);
	        }
	    }
	    _handleTouchEnd(callSubscribers, event) {
	        event.preventDefault();
	        const touches = event.changedTouches;
	        for (let i = 0, l = touches.length; i < l; i++) {
	            this._touchController.touchMove('touch' + touches[i].identifier, callSubscribers, touches[i]);
	        }
	    }
	}
	exports.default = TouchListener;


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	class TouchListener {
	    constructor(_preventContextMenu = true) {
	        this._preventContextMenu = _preventContextMenu;
	    }
	    setListeners(touchController) {
	        this._touchController = touchController;
	        touchController.element.addEventListener("mousedown", (event) => this._handleMouseDown(event), false);
	        touchController.element.addEventListener("mousemove", (event) => this._handleMouseMove(event), false);
	        touchController.element.addEventListener("mouseup", (event) => this._handleMouseUp(true, event), false);
	        touchController.element.addEventListener("mouseleave", (event) => this._handleMouseUp(true, event), false);
	        if (this._preventContextMenu) {
	            touchController.element.addEventListener("contextmenu", (event) => {
	                event.preventDefault();
	                event.stopPropagation();
	            }, false);
	        }
	    }
	    unsetListeners() {
	        //todo
	    }
	    _handleMouseDown(event) {
	        event.preventDefault();
	        this._touchController.touchStart('mouse' + event.button, 'MOUSE', event);
	    }
	    _handleMouseMove(event) {
	        event.preventDefault();
	        this._touchController.touchMove('mouse' + event.button, false, event);
	    }
	    _handleMouseUp(callSubscribers, event) {
	        event.preventDefault();
	        this._touchController.touchMove('mouse' + event.button, callSubscribers, event);
	    }
	}
	exports.default = TouchListener;


/***/ }
/******/ ])));
//# sourceMappingURL=touchcontroller.js.map