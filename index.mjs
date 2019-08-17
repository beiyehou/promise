import Cpromise from './src/Cpromise.mjs';

const p = new Cpromise((resolve, reject) => {
    // resolve("constructor");
    reject('error');
});

p.then(res => {
    console.log('1st resolve:' + res);
}).catch(err => {
    console.log('1st reject:' + err);
    return  new Cpromise((resolve) => {
        resolve('1st 1st catch return');
    });
}).then(res => {
    console.log('1st 2nd then resolve:', res);
});

p.then(res => {
    console.log('2nd resolve:' + res);
}).catch(err => {
    console.log('2nd reject:', err);
    return '2nd 1st catch return';
}).then(res => {
    console.log('2nd 2nd then resolve:', res);
});

// p.catch(err => {
//     console.log('3rd reject:' + err);
// }); 

Cpromise.all([new Cpromise((resolve) => {
    resolve('promise all 1st one resolve');
}), new Cpromise((resolve) => {
    resolve('promise all 2nd one resolve');
})]).then(res => {
    console.log("promise all resolve: ", res);
}).catch(err => {
    console.log("promise all reject: ", err);
});

console.log('end');