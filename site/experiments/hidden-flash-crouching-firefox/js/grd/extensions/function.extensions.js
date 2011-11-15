/**
 * Debounce function for javascript functions
 * using debounce in a constructor or initialization function to debounce 
 * focus events for a widget (onFocus is the original handler):
 *    this.debouncedOnFocus = this.onFocus.debounce(500, false);
 *    this.inputNode.addEventListener('focus', this.debouncedOnFocus, false);
 * 
 * 
 * to coordinate the debounce of a method for all objects of a certain class, do this:
 * MyClass.prototype.someMethod = function () {
 *    do something here, but only once 
 * }.debounce(100, true); // execute at start and use a 100 msec detection period
 * 
 * 
 * the dojo way to coordinate the debounce of a method for all objects of a certain class
 * (using the stand-alone version)
 *dojo.declare('MyClass', null, {
 * 
 *    // other members go here
 * 
 *    someMethod: debounce(function () {
 *    //do something here, but only once
 *    }, 100, true); execute at start and use a 100 msec detection period
 * 
 * });
 * 
 *  
 *  wait until the user is done moving the mouse, then execute
 * (using the stand-alone version)
 * document.onmousemove = debounce(function (e) {
 *    // do something here, but only once after mouse cursor stops
 * }, 250, false);
*
*
*
 * @param {int} delay in msec
 * @param {boolean} execute first right away or wait?
 */
Function.prototype.debounce = function (threshold, execAsap) {
    var func = this, // reference to original function
        timeout; // handle to setTimeout async task (detection period)
    // return the new debounced function which executes the original function only once
    // until the detection period expires
    return function debounced () {
        var obj = this, // reference to original context object
            args = arguments; // arguments at execution time
        // this is the detection function. it will be executed if/when the threshold expires
        function delayed () {
            // if we're executing at the end of the detection period
            if (!execAsap)
                func.apply(obj, args); // execute now
            // clear timeout handle
            timeout = null; 
        };
        // stop any current detection period
        if (timeout)
            clearTimeout(timeout);
        // otherwise, if we're not already waiting and we're executing at the beginning of the detection period
        else if (execAsap)
            func.apply(obj, args); // execute now
        // reset the detection period
        timeout = setTimeout(delayed, threshold || 100); 
    };
}


/**
 * Curry function for javascript functions
 */
Function.prototype.curry = function curry() {
    var fn = this,
        args = Array.prototype.slice.call(arguments);
    return function curryed() {
        return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)));
    };
};


/**
 * Ppartial function for javascript functions
 */
Function.prototype.partial = function () {
    var fn = this,
        args = Array.prototype.slice.call(arguments);
    return function () {
        var arg = 0;
        for (var i = 0; i < args.length && arg < arguments.length; i++)
        if (args[i] === undefined) args[i] = arguments[arg++];
        return fn.apply(this, args);
    };
};


/**
 * Throttle function for javascript functions
 * @param {int} delay how in msec
 */
Function.prototype.throttle = function throttle(delay) {
    var func = this,
        timeOfLastExec = 0,
        execWaiting = false;
    return function throttled() {
        var obj = this,
            args = arguments,
            timeSinceLastExec = new Date().getTime() - timeOfLastExec;
        if (timeSinceLastExec > delay) {
            func.apply(obj, args);
            execWaiting = false;
            timeOfLastExec = new Date().getTime();
        } else if (!execWaiting) {
            execWaiting = setTimeout(function () {
                func.apply(obj, args);
                execWaiting = false;
                timeOfLastExec = new Date().getTime();
            },
            delay - timeSinceLastExec);
        }
    };
};


/**
 * Cycle function for javascript functions
 * @param {int} threshold
 *@returns function
 */
Function.prototype.cycle = function cycle(threshold) {
    var func = this,
        timeout, curFunc = -1,
        funcs = [];
    for (var a = 1, al = arguments.length, arg; a < al; a++) {
        funcs.push((arg = arguments[a]) instanceof Array ? func.curry.apply(func, arg) : func.curry(arg));
    }
    var cycler = function cycler() {
        var obj = this;
        curFunc = (curFunc == funcs.length - 1 ? 0 : ++curFunc);
        funcs[curFunc].call(obj);
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(cycler, threshold);
        return cycler;
    };
    cycler.stop = function stop(funcIdx) {
        clearTimeout(timeout);
        var obj = this;
        funcs[curFunc = funcIdx || 0].call(obj);
    };
    cycler.start = function start(funcIdx) {
        curFunc = funcIdx || -1;
        return cycler();
    };
    return cycler();
};
 
/**
 * Creates an Array function that simulates indexOf is indexOf does not exist (IE)
 * @param {object|array} object/Array
 *@returns {array} array
 */
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function indexOf(elt) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) from += len;
        for (; from < len; from++) {
            if (from in this && this[from] === elt) return from;
        }
        return -1;
    };
}