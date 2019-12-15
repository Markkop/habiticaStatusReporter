console.log('Hello World!')

const nestedArray = ['ES10', ['is', 'working!']]
const flattedArray = nestedArray.flat() // ES10 Array.prototype.flat() function
console.log(flattedArray.join(' '))

// Now, if you try to 'nodemon index.js', you'll get 'TypeError: nestedArray.flat is not a function'
// But if 'nodemon --exec babel-node index.js', the code will be transpiled with EcmaScript2019