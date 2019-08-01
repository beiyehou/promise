function Cpromise(executor) {
    const self = this;
    self.status = 'pending';
    self.value = undefined;
    self.reason = undefined;
    function resolve(value){
        if (self.status === 'pending') {
            self.value = value;
            self.status = 'resolved';
        }
    }

    function reject(reason) {
        if (self.status === 'pending') {
            self.reason = reason;
            self.status = 'rejected';
        }
    }
    executor(resolve, reject);
}

Cpromise.prototype.then = function(onFullFilled, onRejected) {
    const self = this;
    if (self.status === 'resolved') {
        onFullFilled(self.value);
    }

    if (self.status === 'rejected') {
        onRejected(self.reason);
    }
}

export default Cpromise;