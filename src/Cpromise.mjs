const _isFun = Symbol('isFun');
const _isEmpty = Symbol('isEmpty');

/**
 * Tools 
 * */
function isPromise(suspicious) {
    return suspicious instanceof Cpromise;
}

function handlePromiseResult(x, deferred) {
    x.then((val) => {
        deferred.resolve(val);
    }, (res) => {
        deferred.reject(res);
    });
}

function handleonFullFilled(value, onFullFilled, deferred) {
    let x = onFullFilled(value);
    if (isPromise(x)) {
        handlePromiseResult(x, deferred);
    } else {
        deferred.resolve(x);
    }
}

function handleonRejected(reason, onRejected, deferred) {
    let r = onRejected(reason);
    if (isPromise(r)) {
        handlePromiseResult(r, deferred);
    } else {
        deferred.reject(r);
    }
}

/**
 * Main constructor function 
 */
function Cpromise(executor) {
    const self = this;
    self.status = 'pending';
    self.value = undefined;
    self.reason = undefined;
    self.resolveQuene = [];
    self.rejectQuene = [];
    function resolve(value){
        if (self.status === 'pending') {
            self.value = value;
            self.status = 'resolved';            
            if (!self[_isEmpty](self.resolveQuene)) {
                self.resolveQuene.forEach((itemFun) => {
                    itemFun(value);
                });
            }
        }
    }

    function reject(reason) {
        if (self.status === 'pending') {
            self.reason = reason;
            self.status = 'rejected';
            if (!self[_isEmpty](self.rejectQuene)) {
                self.rejectQuene.forEach((itemFun) => {
                    itemFun(reason);
                });
            }
        }
    }
    executor(resolve, reject);
}

function CpromiseDeferred() {
    let result = {};

    result.cpromise = new Cpromise((resolve, reject) => {
        result.resolve = resolve;
        result.reject = reject;
    }); 

    return result;
}

Cpromise.prototype.then = function(onFullFilled, onRejected) {
    const self = this;
    const deferred = new CpromiseDeferred();
    if (self.status === 'resolved' && self[_isFun](onFullFilled)) {
        handleonFullFilled(self.value, onFullFilled, deferred);
    }
    if (self.status === 'rejected' && self[_isFun](onRejected)) {
        handleonRejected(self.reason, onRejected, deferred);
    }
    if (self.status === 'pending') {
        if (self[_isFun](onFullFilled)) {
            self.resolveQuene.push((value) => {
                handleonFullFilled(value, onFullFilled, deferred);
            });
        }
        if (self[_isFun](onRejected)) {
            self.rejectQuene.push((reason) => {
                handleonRejected(reason, onRejected, deferred);
            });
        }  
    }  

    return deferred.cpromise;
}

Cpromise.prototype[_isEmpty] = function(arr) {
    return !arr || (arr.length == 0);
}

Cpromise.prototype[_isFun] = function(fun) {
    return typeof fun === 'function';
}

export default Cpromise;