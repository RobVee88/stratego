var GamePiece = require('./GamePiece')
class Player {
    constructor(name, player) {
        this.name = name
        this.player = player // 1 or 2
        this.undeployedGamePieces = []
        this.gamePieces = []
    }
    // add gamePiece to undeployedGamepieces array
    addUndeployedGamePiece(gamePiece) {
        this.undeployedGamePieces.push(gamePiece)
    }
    // add gamePiece to deployedGamePieces array
    deployGamePiece(gamePiece){
        this.gamePieces.push(gamePiece)
    }
    // remove from undeployedGamePieces array
    removeUndeployedGamePiece(rank) {
        var index = this.undeployedGamePieces.findIndex((gamePiece) => gamePiece.rank === rank)
        this.undeployedGamePieces = this.undeployedGamePieces.filter((gamePiece, i) => index !== i)
    }
    // return the amount of a certain piece that has yet to be deployed
    getUndeployedGamePieceCount(rank) {
        return this.undeployedGamePieces.filter((gamePiece) => gamePiece.rank === rank).length
    }
    // get a count of all game pieces left for a player
    getGamePieceCount () {
        var returnGamePieces = {
            0: 0, 
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0
        }
        this.gamePieces.forEach((gamePiece) => {
            returnGamePieces[gamePiece.rank] += 1
        })
        console.log(returnGamePieces)
        return returnGamePieces
    }
    removeDeployedGamePiece(position) {
        // look for game piece in gamePieces array and delete it, then push it in the undeployed array
        var index = this.gamePieces.findIndex((gamePiece) => gamePiece.position === position)
        this.gamePieces[index].position = 0
        this.undeployedGamePieces.push(this.gamePieces[index])
        this.gamePieces = this.gamePieces.filter((gamePiece, i) => index !== i)
    }
    // return a gamePiece object
    getUndeployedGamePiece(rank) {
        return this.undeployedGamePieces.find((gamePiece) => gamePiece.rank === rank)
    }
    // return a gamePiece object
    getGamePiece(rank) {
        return this.gamePieces.find((gamePiece) => gamePiece.rank === rank)
    }
    // check if player has square occupied, is so return the gamePiece otherwise return false
    isPlayerOccupied(position) {
        var isOccupied = false
        this.gamePieces.forEach((gamePiece) => {
            if(gamePiece.position === position) {
                isOccupied =  gamePiece
            }
        })
        return isOccupied
    }

    // create army for a player
    createArmy() {
        var flag = new GamePiece(0,"Flag")
        this.addUndeployedGamePiece(flag)
        var spy = new GamePiece(1,"Spy")
        this.addUndeployedGamePiece(spy)
        for(var i = 0; i < 8; i++) {
            var scout = new GamePiece(2,"Scout")
            this.addUndeployedGamePiece(scout)
        }
        for(var i = 0; i < 5; i++) {
            var sapper = new GamePiece(3,"Sapper")
            this.addUndeployedGamePiece(sapper)
        }
        for(var i = 0; i < 4; i++){
            var sergeant = new GamePiece(4,"Sergeant")
            this.addUndeployedGamePiece(sergeant)
        }
        for(var i = 0; i < 4; i++){
            var lieutenant = new GamePiece(5,"Lieutenant")
            this.addUndeployedGamePiece(lieutenant)
        }
        for(var i = 0; i < 4; i++){
            var captain = new GamePiece(6,"Captain")
            this.addUndeployedGamePiece(captain)
        }
        for(var i = 0; i < 3; i++){
            var major = new GamePiece(7,"Major")
            this.addUndeployedGamePiece(major)
        }
        for(var i = 0; i < 2; i++){
            var colonel = new GamePiece(8,"Colonel")
            this.addUndeployedGamePiece(colonel)
        }
        var general = new GamePiece(9,"General")
        this.addUndeployedGamePiece(general)
        var marshal = new GamePiece(10,"Marshal")
        this.addUndeployedGamePiece(marshal)
        for(var i = 0; i < 6; i++){
            var bomb = new GamePiece(11,"Bomb")
            this.addUndeployedGamePiece(bomb)
        }
    }
}
module.exports = Player