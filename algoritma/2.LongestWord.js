const input = "Saya sangat senang mengerjakan soal algoritma"

function longestWord(input){
    let longestWord = 0
    const words = input.split(' ')
    words.forEach(word => {
        if (word.length > longestWord) {
            longestWord = word.length
        }
    });
    return `${longestWord} character`
}

console.log(longestWord(input));
