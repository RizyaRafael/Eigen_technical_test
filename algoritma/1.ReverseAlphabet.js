input = 'NEGIE1'
function reverse (input) {
    let number = input.slice(-1)   
    let word = input.slice(0, -1)
    word = word.split('').reverse().join('')
 return word + number
}

console.log(reverse(input));
