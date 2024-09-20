Matrix = [[1, 2, 0], [4, 5, 6], [7, 8, 9]]

function MatrixAdditonSubtraction(Matrix) {
    let firstDiagonal = 0
    let secondDiagonal = 0
    Matrix.forEach((element, i) => {
        firstDiagonal += element[i]
        secondDiagonal += element[element.length - 1 - i]
    });

    return firstDiagonal-secondDiagonal
}

console.log(MatrixAdditonSubtraction(Matrix));
