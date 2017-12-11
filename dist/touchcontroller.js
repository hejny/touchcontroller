(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AbstractClassWithSubscribe = /** @class */ (function () {
    function AbstractClassWithSubscribe() {
        this._subscribers = [];
    }
    AbstractClassWithSubscribe.prototype.subscribe = function (event /*maybe multiple events TEvent[]*/, callback) {
        this._subscribers.push({
            event: event,
            callback: callback
        });
    };
    //todo unsubscribe
    AbstractClassWithSubscribe.prototype.callSubscribers = function (event, newValue) {
        this._subscribers
            .filter(function (subscriber) { return subscriber.event === event; })
            .forEach(function (subscriber) { return subscriber.callback(newValue); });
    };
    return AbstractClassWithSubscribe;
}());
exports.default = AbstractClassWithSubscribe;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector2.Zero = function () {
        return new Vector2(0, 0);
    };
    Vector2.prototype.clone = function () {
        return new Vector2(this.x, this.y);
    };
    Vector2.prototype.add = function (vector2) {
        return new Vector2(this.x + vector2.x, this.y + vector2.y);
    };
    Vector2.prototype.subtract = function (vector2) {
        return new Vector2(this.x - vector2.x, this.y - vector2.y);
    };
    Vector2.prototype.scale = function (scale) {
        return new Vector2(this.x * scale, this.y * scale);
    };
    Vector2.prototype.length = function (vector2) {
        if (vector2 === void 0) { vector2 = Vector2.Zero(); }
        return Math.sqrt(Math.pow(this.x - vector2.x, 2) +
            Math.pow(this.y - vector2.y, 2));
    };
    Vector2.prototype.toArray = function () {
        return [this.x, this.y];
    };
    return Vector2;
}());
exports.default = Vector2;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TouchController_1 = __webpack_require__(3);
exports.TouchController = TouchController_1.default;
var MultiTouchController_1 = __webpack_require__(6);
exports.MultiTouchController = MultiTouchController_1.default;
var listeners_1 = __webpack_require__(8);
exports.listeners = listeners_1.default;
var Vector2_1 = __webpack_require__(1);
exports.Vector2 = Vector2_1.default;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var VectorTouch_1 = __webpack_require__(4);
var Touch_1 = __webpack_require__(5);
var AbstractClassWithSubscribe_1 = __webpack_require__(0);
//todo maybe remove end and move listener
var TouchController = /** @class */ (function (_super) {
    __extends(TouchController, _super);
    function TouchController(element) {
        var _this = _super.call(this) || this;
        _this.element = element;
        _this.ongoingTouches = [];
        return _this;
    }
    //todo dispose
    TouchController.prototype.addListener = function (listener) {
        listener.setListeners(this); //todo array of listeners
    };
    TouchController.prototype.touchStart = function (id, type, event) {
        var touch = new Touch_1.default(id, type, this._createVectorFromEvent(event));
        this.ongoingTouches.push(touch);
        this.callSubscribers('START', touch);
    };
    TouchController.prototype.touchMove = function (id, end, event) {
        var index = this._ongoingTouchIndexById(id);
        if (index !== -1) {
            var touch = this.ongoingTouches[index];
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
    };
    TouchController.prototype._createVectorFromEvent = function (event) {
        return new VectorTouch_1.default(this, event.clientX - this.element.offsetLeft, event.clientY - this.element.offsetTop, performance.now());
    };
    TouchController.prototype._ongoingTouchIndexById = function (idToFind) {
        for (var i = 0; i < this.ongoingTouches.length; i++) {
            var id = this.ongoingTouches[i].id;
            if (id === idToFind) {
                return i;
            }
        }
        return -1;
    };
    return TouchController;
}(AbstractClassWithSubscribe_1.default));
exports.default = TouchController;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Vector2_1 = __webpack_require__(1);
var VectorTouch = /** @class */ (function (_super) {
    __extends(VectorTouch, _super);
    function VectorTouch(_touchController, x, y, t) {
        var _this = _super.call(this, x, y) || this;
        _this._touchController = _touchController;
        _this.t = t;
        return _this;
    }
    VectorTouch.prototype.to1 = function () {
        return new Vector2_1.default(this.x / this._touchController.element.clientWidth, this.y / this._touchController.element.clientHeight);
    };
    return VectorTouch;
}(Vector2_1.default));
exports.default = VectorTouch;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractClassWithSubscribe_1 = __webpack_require__(0);
var Touch = /** @class */ (function (_super) {
    __extends(Touch, _super);
    function Touch(id, type, firstPosition) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.type = type;
        _this._finished = false;
        _this.positions = [firstPosition];
        return _this;
    }
    Touch.prototype.move = function (newPoint, end) {
        if (end === void 0) { end = false; }
        this.positions.push(newPoint);
        if (!end) {
            this.callSubscribers('MOVE', newPoint);
        }
        else {
            this._finished = true;
            this.callSubscribers('END', newPoint);
        }
    };
    Object.defineProperty(Touch.prototype, "firstPosition", {
        get: function () {
            return this.positions[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Touch.prototype, "start", {
        get: function () {
            return this.firstPosition.t;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Touch.prototype, "finished", {
        get: function () {
            return this._finished;
        },
        enumerable: true,
        configurable: true
    });
    return Touch;
}(AbstractClassWithSubscribe_1.default));
exports.default = Touch;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractClassWithSubscribe_1 = __webpack_require__(0);
var MultiTouch_1 = __webpack_require__(7);
var MultiTouchController = /** @class */ (function (_super) {
    __extends(MultiTouchController, _super);
    function MultiTouchController(_touchController, _elementBinder) {
        var _this = _super.call(this) || this;
        _this._touchController = _touchController;
        _this._elementBinder = _elementBinder;
        _this._multiTouches = [];
        _this._touchController.subscribe('START', function (touch) {
            var element = _this._elementBinder(touch);
            //todo why can not be used find
            var multiTouch = _this._multiTouches.filter(function (multiTouch) { return multiTouch.element === element; })[0];
            if (typeof multiTouch === 'undefined') {
                multiTouch = { element: element, multiTouch: new MultiTouch_1.default() };
                _this._multiTouches.push(multiTouch);
            }
            multiTouch.multiTouch.addTouch(touch);
            _this.callSubscribers('START', multiTouch.multiTouch);
        });
        return _this;
    }
    return MultiTouchController;
}(AbstractClassWithSubscribe_1.default));
exports.default = MultiTouchController;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractClassWithSubscribe_1 = __webpack_require__(0);
var MultiTouch = /** @class */ (function (_super) {
    __extends(MultiTouch, _super);
    function MultiTouch() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.touches = [];
        return _this;
    }
    /*constructor() {
        super();
    }*/
    MultiTouch.prototype.addTouch = function (touch) {
        var _this = this;
        this.touches.push(touch);
        touch.subscribe('MOVE', function () {
            _this.callSubscribers('MOVE', touch);
        });
        touch.subscribe('END', function () {
            _this.callSubscribers('END', touch);
        });
        //todo END all
    };
    return MultiTouch;
}(AbstractClassWithSubscribe_1.default));
exports.default = MultiTouch;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TouchListener_1 = __webpack_require__(9);
var MouseListener_1 = __webpack_require__(10);
exports.default = {
    TouchListener: TouchListener_1.default,
    MouseListener: MouseListener_1.default
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TouchListener = /** @class */ (function () {
    function TouchListener() {
    }
    TouchListener.prototype.setListeners = function (touchController) {
        var _this = this;
        this._touchController = touchController;
        touchController.element.addEventListener("touchstart", function (event) { return _this._handleTouchStart(event); }, false);
        touchController.element.addEventListener("touchend", function (event) { return _this._handleTouchEnd(true, event); }, false);
        touchController.element.addEventListener("touchcancel", function (event) { return _this._handleTouchEnd(false, event); }, false);
        //todo element.addEventListener("touchleave", (event)=>this._handleTouchEnd(true,event), false);
        touchController.element.addEventListener("touchmove", function (event) { return _this._handleTouchMove(event); }, false);
    };
    TouchListener.prototype.unsetListeners = function () {
        //todo
    };
    TouchListener.prototype._handleTouchStart = function (event) {
        event.preventDefault();
        var touches = event.changedTouches;
        for (var i = 0, l = touches.length; i < l; i++) {
            this._touchController.touchStart('touch' + touches[i].identifier, 'TOUCH', touches[i]);
        }
    };
    TouchListener.prototype._handleTouchMove = function (event) {
        event.preventDefault();
        var touches = event.changedTouches;
        for (var i = 0, l = touches.length; i < l; i++) {
            this._touchController.touchMove('touch' + touches[i].identifier, false, touches[i]);
        }
    };
    TouchListener.prototype._handleTouchEnd = function (callSubscribers, event) {
        event.preventDefault();
        var touches = event.changedTouches;
        for (var i = 0, l = touches.length; i < l; i++) {
            this._touchController.touchMove('touch' + touches[i].identifier, callSubscribers, touches[i]);
        }
    };
    return TouchListener;
}());
exports.default = TouchListener;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TouchListener = /** @class */ (function () {
    function TouchListener(_preventContextMenu) {
        if (_preventContextMenu === void 0) { _preventContextMenu = true; }
        this._preventContextMenu = _preventContextMenu;
    }
    TouchListener.prototype.setListeners = function (touchController) {
        var _this = this;
        this._touchController = touchController;
        touchController.element.addEventListener("mousedown", function (event) { return _this._handleMouseDown(event); }, false);
        touchController.element.addEventListener("mousemove", function (event) { return _this._handleMouseMove(event); }, false);
        touchController.element.addEventListener("mouseup", function (event) { return _this._handleMouseUp(true, event); }, false);
        touchController.element.addEventListener("mouseleave", function (event) { return _this._handleMouseUp(true, event); }, false);
        if (this._preventContextMenu) {
            touchController.element.addEventListener("contextmenu", function (event) {
                event.preventDefault();
                event.stopPropagation();
            }, false);
        }
    };
    TouchListener.prototype.unsetListeners = function () {
        //todo
    };
    TouchListener.prototype._handleMouseDown = function (event) {
        event.preventDefault();
        this._touchController.touchStart('mouse' + event.button, 'MOUSE', event);
    };
    TouchListener.prototype._handleMouseMove = function (event) {
        event.preventDefault();
        this._touchController.touchMove('mouse' + event.button, false, event);
    };
    TouchListener.prototype._handleMouseUp = function (callSubscribers, event) {
        event.preventDefault();
        this._touchController.touchMove('mouse' + event.button, callSubscribers, event);
    };
    return TouchListener;
}());
exports.default = TouchListener;


/***/ })
/******/ ])));
//# sourceMappingURL=touchcontroller.js.map