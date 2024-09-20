input = ['xc', 'dz', 'bbb', 'dz']
query = ['bbb', 'ac', 'dz']

function repeatQuery(input, query) {
    let output = []
    query.forEach(element => {
        let total = input.filter((el) => el === element).length
        output.push(total)
    });
    return output
}

console.log(repeatQuery(input, query));
