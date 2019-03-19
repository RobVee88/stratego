var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var GamePiece = require('./GamePiece')
var Player = require('./Player')

var acitvePlayer = null
var player1 = null
var player2 = null
var connectedPlayers = []
var deployedPlayers = 0

// returns winner of the battle, takes 2 game pieces as arguments
battle = (attacker, defender) => {
    // check if spy attacks marshal
    if (attacker.rank === 1 && defender.rank === 10) {
        return attacker
    // check if sapper attacks bomb
    } else if(attacker.rank === 3 && defender.rank === 11) 
    {
        return attacker
    } else if (attacker.rank > defender.rank) {
        return attacker
    } else {
        return defender
    }
}

io.on('connection', (socket) => {
    var connPlayer = function() {
        // player has connected
        // io.emit('player joined', 'a player has joined the game!')
        console.log('player joined the game')
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
        io.to(connectedPlayers[0].id).emit('game starts', {message: 'Game starts! Player 1 goes first!', opponentCount: player2.getGamePieceCount()})
        io.to(connectedPlayers[1].id).emit('game starts', {message: 'Game starts! Player 1 goes first!', opponentCount: player1.getGamePieceCount()})
    }

    socket.on('new player', connPlayer)
    // socket.on('finish deployment', finishDeployment)
    // socket.on('player move', playerMove)

    socket.on('disconnect', function() {
        console.log('a player has disconnected')
        var index = connectedPlayers.indexOf(socket)
        connectedPlayers.splice(index, 1)
        console.log(connectedPlayers.length)
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
})
// listen for events
// socket.on()

http.listen(3000, () => {
  console.log('Stratego server listening on PORT: 3000')
})


// socket.emit('chat message', $('#m').val())

// socket.on('chat message', function(msg){
//     console.log('message: ' + msg)
// })

// client
// socket.on = receive something
// socket.emit = send something

// server 
// socket.on = receive something
// io.emit = send something