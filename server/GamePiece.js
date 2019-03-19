class GamePiece {
    constructor(rank, name) {
        this.rank = rank
        this.name = name
        this.position = 0
    }
    // set position of piece, takes a number
    setPosition(position) {
        this.position = position
    }
    // returns an arary with all positions the piece can move to
    possibleMoves() {
        var possibleMoves = []
        // moves for scout
        if (this.rank === 2) {
            // move right
            for(i = this.position; i % 10 !== 0;i++) {
                // needs check to see if position is already taken by friendly piece
                possibleMoves.push(i)
            }
            // move left
            for(i = this.position; i % 10 !== 1;i--) {
                // needs check to see if position is already taken by friendly piece
                possibleMoves.push(i)
            }
            // move down
            for(i = this.position; i < 91;i = i + 10) {
                // needs check to see if position is already taken by friendly piece
                possibleMoves.push(i)
            }
            // move up
            for(i = this.position; i > 10;i = i - 10) {
                // needs check to see if position is already taken by friendly piece
                possibleMoves.push(i)
            }
        // moves for all other pieces (except bomb and flag)
        } else if (this.rank !== 0 && this.rank !== 11) {
            if (!this.position >= 1 && !this.position <= 10) {
                possibleMoves.push(this.position - 10)
            }
            if (!this.position >= 91 && !this.position <= 100) {
                possibleMoves.push(this.position + 10)
            }
            if (!this.position % 10 === 1) {
                possibleMoves.push(this.position - 1)
            }
            if (!this.position % 10 === 0) {
                possibleMoves.push(this.position + 1)
            }          
        }
        return possibleMoves
    }
}

module.exports = GamePiece
