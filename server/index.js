var express = require('express')
var app = express()
app.use(express.static('public'))
var http = require('http').Server(app)
var io = require('socket.io')(http)
var GamePiece = require('./GamePiece')
var Player = require('./Player')

var activePlayer = null
var player1 = null
var player2 = null
var connectedPlayers = []
var deployedPlayers = 0

clearPlayerGamePieces = function(player) {
    while(player.gamePieces.length > 0){
        player.gamePieces.pop()
    }    
}

// returns winner of the battle, takes 2 game pieces as arguments
battle = (attacker, defender) => {
    // check if spy attacks marshal
    if (attacker.rank === 1 && defender.rank === 10) {
        return 'attacker'
    // check if sapper attacks bomb
    } else if(attacker.rank === 3 && defender.rank === 11) 
    {
        return 'attacker'
    } else if (attacker.rank > defender.rank) {
        return 'attacker'
    } else if (attacker.rank === defender.rank) {
        return 'both'
    } else {
        return 'defender'
    }
}

app.get('/', function(req,res){
    res.sendfile(__dirname + '/views/index.html')
}); 



io.on('connection', (socket) => {
    var connPlayer = function(res) {
        // player has connected
        // io.emit('player joined', 'a player has joined the game!')
        console.log(`${res} joined the game`)
        connectedPlayers.push(socket)
        // if 2 players have joined startDeployment()
        console.log(connectedPlayers.length)
        if (connectedPlayers.length === 2) {
            console.log('2 players have joined the game! Get ready!')
            startDeployment()
        }
    }
    
    var startDeployment = function() {
        // emit to players game has started
        player1 = new Player("harrie",1)
        player2 = new Player("grakkol",2)
        player1.createArmy()
        player2.createArmy()
        io.to(connectedPlayers[0].id).emit('deployment starts', player1)
        io.to(connectedPlayers[1].id).emit('deployment starts', player2)
        console.log('Start die zooi ouwe!')
    }

    var startGame = function() {
        deployedPlayers = 0
        activePlayer = 1
        io.to(connectedPlayers[0].id).emit('game starts', {message: 'Game starts! Player 1 goes first!', opponentCount: player2.getGamePieceCount(), gamePieces: player2.gamePieces})
        io.to(connectedPlayers[1].id).emit('game starts', {message: 'Game starts! Player 1 goes first!', opponentCount: player1.getGamePieceCount(), gamePieces: player1.gamePieces})
    }

    var playerWins = function(player) {
        console.log(player)
        if(player === 1) {
            io.to(connectedPlayers[0].id).emit('player wins', {message: 'You have won the game!', opponentCount: player2.getGamePieceCount(), gamePieces: player2.gamePieces, playerGamePieces: player1.gamePieces})
            io.to(connectedPlayers[1].id).emit('player loses', {message: 'You have lost the game', opponentCount: player1.getGamePieceCount(), gamePieces: player1.gamePieces, playerGamePieces: player2.gamePieces})
            activePlayer = null
            deployedPlayers = 0
            console.log('Game ended, player 1 wins!')
        } else if (player === 2) {
            io.to(connectedPlayers[1].id).emit('player wins', {message: 'You have won the game!', opponentCount: player2.getGamePieceCount(), gamePieces: player2.gamePieces, playerGamePieces: player1.gamePieces})
            io.to(connectedPlayers[0].id).emit('player loses', {message: 'You have lost the game', opponentCount: player1.getGamePieceCount(), gamePieces: player1.gamePieces, playerGamePieces: player2.gamePieces})
            activePlayer = null
            deployedPlayers = 0
            console.log('Game ended, player 2 wins!')
        }
    }

    socket.on('new player', connPlayer)

    socket.on('disconnect', function(reason) {
        console.log('a player has disconnected')
        console.log(reason)
        // var index = connectedPlayers.indexOf(socket)
        // connectedPlayers.splice(index, 1)
        //console.log(connectedPlayers.length)
     })
    
    socket.on('deployment complete', function(res) {
        if(res.player === 1) {
            res.gamePieces.forEach((gamePiece) => {
                player1.gamePieces.push(gamePiece)
            })
            deployedPlayers++
            if(deployedPlayers < 2) {
                io.to(connectedPlayers[0].id).emit('wait for other player deployment', 'please stand by while your opponent deploys his/her army')
            } else {
                startGame()
            }
        } else {
            res.gamePieces.forEach((gamePiece) => {
                player2.gamePieces.push(gamePiece)
            })
            deployedPlayers++
            if(deployedPlayers < 2) {
                io.to(connectedPlayers[1].id).emit('wait for other player deployment', 'please stand by while your opponent deploys his/her army')
            } else {
                startGame()
            }
        }
    })
    socket.on('pass turn', function(res) {
        if (res.player === 1) {
            clearPlayerGamePieces(player1)
            res.gamePieces.forEach((gamePiece)=> {
                player1.gamePieces.push(gamePiece)
            })
            //check if two pieces are on same spot => battle
            for( var i = 0; i < player1.gamePieces.length; i++) {
                for (var c = 0; c < player2.gamePieces.length; c++) {
                    if (player1.gamePieces[i].position === player2.gamePieces[c].position){
                        if (player2.gamePieces[c].rank === 0) {
                            player2.gamePieces[c].position = 0
                            player1.gamePieces[i].hidden = false
                            playerWins(activePlayer)
                        } else {
                            winner = battle(player1.gamePieces[i], player2.gamePieces[c])
                            if (winner === 'attacker') {
                                player2.gamePieces[c].position = 0
                                player1.gamePieces[i].hidden = false
                                break
                            } else if (winner === 'defender') {
                                player1.gamePieces[i].position = 0
                                player2.gamePieces[c].hidden = false
                                break
                            } else if (winner === 'both') {
                                player1.gamePieces[i].position = 0
                                player2.gamePieces[c].position = 0
                                break
                            }
                        }
                    }
                }
            }
            if (activePlayer !== null) {
                activePlayer = 2
                io.to(connectedPlayers[1].id).emit('player turn', {message: 'It is your turn now!', opponentCount: player1.getGamePieceCount(), gamePieces: player1.gamePieces, playerGamePieces: player2.gamePieces})
                io.to(connectedPlayers[0].id).emit('opponent turn', {message: 'Please wait while your opponent makes their move', opponentCount: player2.getGamePieceCount(), gamePieces: player2.gamePieces, playerGamePieces: player1.gamePieces})
            }
        } else if (res.player === 2) {
            clearPlayerGamePieces(player2)
            res.gamePieces.forEach((gamePiece)=> {
                player2.gamePieces.push(gamePiece)
            })
            //check if two pieces are on same spot
            for( var i = 0; i < player2.gamePieces.length; i++) {
                for (var c = 0; c < player1.gamePieces.length; c++) {
                    if (player2.gamePieces[i].position === player1.gamePieces[c].position){
                        if (player1.gamePieces[c].rank === 0) {
                            player1.gamePieces[c].position = 0
                            player2.gamePieces[i].hidden = false
                            playerWins(activePlayer)
                        } else {
                            winner = battle(player2.gamePieces[i], player1.gamePieces[c])
                            if (winner === 'attacker') {
                                player1.gamePieces[c].position = 0
                                player2.gamePieces[i].hidden = false
                                break
                            } else if (winner === 'defender') {
                                player2.gamePieces[i].position = 0
                                player1.gamePieces[c].hidden = false
                                break
                            } else if (winner === 'both') {
                                player1.gamePieces[c].position = 0
                                player2.gamePieces[i].position = 0
                                break
                            }
                        }
                    }
                }
            }
            if(activePlayer !== null) {
                activePlayer = 1
                io.to(connectedPlayers[0].id).emit('player turn', {message: 'It is your turn now!', opponentCount: player2.getGamePieceCount(), gamePieces: player2.gamePieces, playerGamePieces: player1.gamePieces})
                io.to(connectedPlayers[1].id).emit('opponent turn', {message: 'Please wait while your opponent makes their move', opponentCount: player1.getGamePieceCount(), gamePieces: player1.gamePieces, playerGamePieces: player2.gamePieces})
  
            }
        }
    })
})

http.listen(3000, () => {
  console.log('Stratego server listening on PORT: 3000')
})
