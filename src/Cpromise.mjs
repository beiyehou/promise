const _isFun = Symbol('isFun');
const _isEmpty = Symbol('isEmpty');

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
        let x = onFullFilled(self.value);
        deferred.resolve(x);
    }
    if (self.status === 'rejected' && self[_isFun](onRejected)) {
        let r = onRejected(self.reason);
        deferred.reject(r);
    }
    if (self.status === 'pending') {
        if (self[_isFun](onFullFilled)) {
            self.resolveQuene.push((value) => {
                let x = onFullFilled(value);
                deferred.resolve(x);
            });
        }
        if (self[_isFun](onRejected)) {
            self.rejectQuene.push((reason) => {
                let r = onRejected(reason);
                deferred.reject(r);
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