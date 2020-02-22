let pro = new Promise((resolve) => {
    let a = 1
    setTimeout(() => {
        resolve('reslved')
    })
    console.log(a)
})

// ======

// console.log('before promise')

// pro.then('resolve new').then(val => {
//     console.log('firset val ' , val)
//     return val
// }).then(val => {
//     console.log('seconde val ', val)
//     return val
// }).then(val => {
//     console.log('thrid val', val)
// })

// console.log('after promise')

// ======

// console.log('before promise')

// Promise.resolve('resolve static').then(val => {
//     console.log('firset val ' , val)
//     return val
// }).then(val => {
//     console.log('seconde val ', val)
//     return val
// }).then(val => {
//     console.log('third val' , val)
// })

// console.log('after promise')

pro.then((val) => {
    console.log('paralle then first' , val)
})
pro.then(val => {
    console.log('paralle then second' , val)
})

pro.then(val => {
    console.log('serirze then fist' , val)
    return val
}).then(val => {
    console.log('seirize then secode ', val)
})