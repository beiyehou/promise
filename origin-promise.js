const p = new Promise((resolve, reject) => {
    // resolve("constructor");
    reject('error');
});

p.then(res => {
    console.log('1st resolve:' + res);
}).catch(err => {
    console.log('1st reject:' + err);
    return '1st 2nd catch return';
}).then(res => {
    console.log('1st 2nd then resolve:', res);
});

// p.then(res => {
//     console.log('2nd resolve:' + res);
// });

p.catch(err => {
    console.log('3rd reject:' + err);
}); 

console.log('end');