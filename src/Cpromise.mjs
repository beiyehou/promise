/**
 * Tools 
 * */
function isPromise(suspicious) {
    return suspicious instanceof Cpromise;
}

function isEmpty(arr) {
    return !arr || (arr.length == 0);
}

function isFun(fun) {
    return typeof fun === 'function';
}

function handlePromiseResult(x, deferred) {
    x.then((val) => {
        deferred.resolve(val);
    }, (res) => {
        deferred.reject(res);
    });
}

function handleonFullFilled(value, onFullFilled, deferred) {
    let x = isFun(onFullFilled) ? onFullFilled(value) : value;
    if (isPromise(x)) {
        handlePromiseResult(x, deferred);
    } else {
        deferred.resolve(x);
    }
}

function handleonRejected(reason, onRejected, deferred) {
    let r = isFun(onRejected) ? onRejected(reason) : reason;
    if (isPromise(r)) {
        handlePromiseResult(r, deferred);
    } else {
        if (isFun(onRejected)) {
            deferred.resolve(r);
        } else {
            deferred.reject(r);
        }
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
            if (!isEmpty(self.resolveQuene)) {
                setTimeout(() => {
                    self.resolveQuene.forEach((itemFun) => {
                        itemFun(value);
                    });
                });
            }
        }
    }

    function reject(reason) {
        if (self.status === 'pending') {
            self.reason = reason;
            self.status = 'rejected';
            if (!isEmpty(self.rejectQuene)) {
                setTimeout(() => {
                    self.rejectQuene.forEach((itemFun) => {
                        itemFun(reason);
                    });
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
    if (self.status === 'resolved') {
        setTimeout(() => {
            handleonFullFilled(self.value, onFullFilled, deferred);
        });
    }
    if (self.status === 'rejected') {
        setTimeout(() => {
            handleonRejected(self.reason, onRejected, deferred);
        });
    }
    if (self.status === 'pending') {
        self.resolveQuene.push((value) => {
            handleonFullFilled(value, onFullFilled, deferred);
        });        
        self.rejectQuene.push((reason) => {
            handleonRejected(reason, onRejected, deferred);
        });         
    }  

    return deferred.cpromise;
}

Cpromise.prototype.catch = function(onRejected) {
    return this.then(undefined, onRejected);
}

Cpromise.all = function(cpromises) {
    let deferred = new CpromiseDeferred();
    let results = [];
    if (cpromises.length === 0) {
        deferred.resolve(results);
    } else {
        const { length } = cpromises;
        for (let i = 0; i < length; i++) {
            cpromises[i].then(res => {
                results.push(res);
                if (results.length === length) {
                    deferred.resolve(results);
                }
            }, (reason) => {
                deferred.reject(reason);
            });
        }
    }
    return deferred.cpromise;
}

export default Cpromise;