"use strict";
exports.__esModule = true;
exports.QueueDebounce = exports.Delays = void 0;
exports.Delays = {
    Immediately: -2,
    GetFirst: -1
};
var QueueDebounce = /** @class */ (function () {
    function QueueDebounce(delay, replace) {
        if (delay === void 0) { delay = 1000; }
        if (replace === void 0) { replace = false; }
        this.defaultDelay = 1000;
        this.defaultReplace = true;
        this.timerHandle = undefined;
        this.queue = [];
        this.defaultDelay = delay;
        this.defaultReplace = replace;
    }
    QueueDebounce.prototype.cancelTimeout = function () {
        clearTimeout(this.timerHandle);
        this.timerHandle = undefined;
    };
    // replace option let you postpone the request which has repeated recently
    // delay option add a delay after running it
    QueueDebounce.prototype.add = function (key, callback, delay, replace) {
        var _this = this;
        if (delay === void 0) { delay = 0; }
        var _a = this, queue = _a.queue, defaultReplace = _a.defaultReplace, defaultDelay = _a.defaultDelay;
        var ind = queue.findIndex(function (item) { return item.key === key; });
        replace = typeof replace !== 'undefined' ? replace : defaultReplace;
        delay = (delay > 0) ? delay : defaultDelay;
        var newItem = { key: key, callback: callback, delay: delay };
        if (ind < 0) {
            queue.push(newItem);
        }
        else if (replace) {
            queue.splice(ind, 1);
            queue.push(newItem);
            if (!ind) {
                this.cancelTimeout();
            }
        }
        if (queue.length === 1 && this.timerHandle) {
            this.cancelTimeout();
        }
        if (delay === exports.Delays.GetFirst || delay === exports.Delays.Immediately) {
            queue.pop();
            queue.unshift(newItem);
            this.timerHandle = setTimeout(function () { _this.next(); }, 1000);
        }
        else if (delay === exports.Delays.Immediately) {
            this.next();
        }
        else if (!this.timerHandle) {
            this.timerHandle = setTimeout(function () {
                _this.next();
            }, defaultDelay);
        }
    };
    QueueDebounce.prototype.next = function () {
        var _this = this;
        var _a = this.queue.shift(), delay = _a.delay, callback = _a.callback;
        this.timerHandle = setTimeout(function () {
            if (_this.queue.length) {
                _this.next();
            }
            else {
                _this.cancelTimeout();
            }
        }, delay || 0);
        return callback && callback();
    };
    return QueueDebounce;
}());
exports.QueueDebounce = QueueDebounce;
