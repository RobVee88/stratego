// pawn is created with a color (player that owns the pawn) and a square (location on the board)
class Pawn {
    constructor(color, position) {
        this.color = color
        this.position = position
    }

    moveForwardOptions() {
        var letter = this.position.charAt(0)
        var number = this.position.charAt(1)
        var options = []
        if(this.color === 'white') {
            if (chessBoard.getSquareState(`${letter}${number++}`) === 'empty') {
                options.push(`${letter}${number++}`)
            }
        } else {
            if (chessBoard.getSquareState(`${letter}${number--}`) === 'empty') {
                options.push(`${letter}${number--}`)
            }
        }
        return options
    }
    attackDiagonallyOptions() {


    }

    enpassantOptions() {

    }
} 

class ChessBoard {

    constructor() {
        this.letters = ['a','b','c','d','e','f','g','h']
        this.numbers = ['8','7','6','5','4','3','2','1']
        this.board = [[],[],[],[],[],[],[],[]]
        for (var l = 0; l < this.letters.length; l++) {
            for(var i = 0; i < 8; i++) {
                this.board[i].push([`${this.letters[l]}${this.numbers[i]}`])
            }
        }
        //console.log(this.board[7][0].push({white: 'pawn'}))
    }
    getChessBoard() {
        return this.board
    }
    // takes a position as a string i.e. 'a1 and returns an instance of a piece or 'empty'
    getSquareState(position) {
        var numberOfLetters = {'a': 7, 'b': 6, 'c': 5, 'd': 4, 'e': 3, 'f': 2, 'g': 1, 'h': 0}
        var letter = position.charAt(0)
        var number = position.charAt(1)
        var state = this.board[numberOfLetters[`${letter}`]][number - 1][1]
        if (state !== undefined) {
            return state
        } else {
            return 'empty'
        }
    }
}





var chessBoard = new ChessBoard
var pawn1 = new Pawn('white','a2')
var pawn2 = new Pawn('white','b2')
var pawn3 = new Pawn('white','c2')
var pawn4 = new Pawn('white','d2')
var pawn5 = new Pawn('white','e2')
var pawn6 = new Pawn('white','f2')
var pawn7 = new Pawn('white','g2')
var pawn8 = new Pawn('white','h2')
var pawn9 = new Pawn('black','a7')
var pawn10 = new Pawn('black','b7')
var pawn11 = new Pawn('black','c7')
var pawn12 = new Pawn('black','d7')
var pawn13 = new Pawn('black','e7')
var pawn14 = new Pawn('black','f7')
var pawn15 = new Pawn('black','g7')
var pawn16 = new Pawn('black','h7')
chessBoard.board[6][0].push(pawn1)
chessBoard.board[6][1].push(pawn2)
chessBoard.board[6][2].push(pawn3)
chessBoard.board[6][3].push(pawn4)
chessBoard.board[6][4].push(pawn5)
chessBoard.board[6][5].push(pawn6)
chessBoard.board[6][6].push(pawn7)
chessBoard.board[6][7].push(pawn8)
chessBoard.board[1][0].push(pawn9)
chessBoard.board[1][1].push(pawn10)
chessBoard.board[1][2].push(pawn11)
chessBoard.board[1][3].push(pawn12)
chessBoard.board[1][4].push(pawn13)
chessBoard.board[1][5].push(pawn14)
chessBoard.board[1][6].push(pawn15)
chessBoard.board[1][7].push(pawn16)

console.log(chessBoard.getSquareState('a1'))
console.log(chessBoard.getSquareState('a2'))
console.log(chessBoard.getChessBoard())
console.log(pawn1.moveForwardOptions())



class King {
    constructor(color, position) {
        this.color = color
        this.position = position
    }
    moveOptions() {

    }
}

