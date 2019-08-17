import Cpromise from './src/Cpromise.mjs';

let p = new Cpromise((resolve, reject) => {
    setTimeout(() => {
        resolve('async timeout');
    });
});

p.then(res => {
    console.log('1st:' + res);
    return res;
}).then(res => {
    console.log('1st 2nd then:', res);
});

p.then(res => {
    console.log('2nd:' + res);
});

console.log('end');