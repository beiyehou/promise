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
    return new Cpromise((resolve) => {
        resolve('2nd 1st then return promise.');
    });
}).then(res => {
    console.log('2nd 2nd then res:', res);
});

console.log('end');