
/// CLIENT SIDE FUNCTIONS

// clear possible moves
clearPossibleMoves = () => {
    while(possibleMoves.length > 0){
        possibleMoves.pop()
    }
}

clearOpponentGamePieces = () => {
    while(opponentGamePieces.length > 0){
        opponentGamePieces.pop()
    }
}

clearGamePieces = () => {
    while(user.gamePieces.length > 0){
        user.gamePieces.pop()
    }
}

showPossibleMoves = () => {
    possibleMoves.forEach((move) => {
        var square = document.querySelector(`[data-position='${move}']`)
        square.classList.add('possible-move')
    })
}
hidePossibleMoves = () => {
    possibleMoves.forEach((move) => {
        var square = document.querySelector(`[data-position='${move}']`)
        square.classList.remove('possible-move')
    })    
}

showDeploymentZone = () => {
    var squares = document.querySelectorAll('.board-square')
    squares.forEach((square) => {
        if(user.player === 1 && square.dataset.position > 60) {
            square.classList.add('deployment-option')
        } else if (user.player === 2 && square.dataset.position <= 40) {
            square.classList.add('deployment-option')
        }
    })
}

hideDeploymentZone = () => {
    var squares = document.querySelectorAll('.board-square')
    squares.forEach((square) => {
        square.classList.remove('deployment-option')
    })
}


isOpponentOccupied = (position) => {
    var square = opponentGamePieces.find((gamePiece) => gamePiece.position === position)
    if (square !== undefined) {
        return true
    } else { 
        return false
    }
}

isWater = (position) => {
    if (position === 43 || position === 44 || position === 53 || position === 54 || position === 47 || position === 48 || position === 57 || position === 58) {
        return true
    } else {
        return false
    }
}
// returns an arary with all positions the piece can move to
getPossibleMoves = (gamePiece) => {
    // moves for scout
    if (gamePiece.rank === 2) {
        // move right
        for(var i = gamePiece.position; i % 10 !== 0;i++) {
            // needs check to see if position is already taken by friendly piece
            if((user.isPlayerOccupied(i) && i !== gamePiece.position) || isWater(i)) {
                break
            }
            if(i !== gamePiece.position) {
                possibleMoves.push(i)
            }
            if(isOpponentOccupied(i)) {
                break
            }
        }
        // move left
        for(var i = gamePiece.position; i % 10 !== 1;i--) {
            // needs check to see if position is already taken by friendly piece
            if((user.isPlayerOccupied(i) && i !== gamePiece.position) || isWater(i)) {
                break
            }
            if(i !== gamePiece.position) {
                possibleMoves.push(i)
            }
            if(isOpponentOccupied(i)) {
                break
            }
        }
        // move down
        for(var i = gamePiece.position; i < 91;i = i + 10) {
            debugger
            // needs check to see if position is already taken by friendly piece
            if((user.isPlayerOccupied(i) && i !== gamePiece.position) || isWater(i)) {
                break
            }
            if(i !== gamePiece.position) {
                possibleMoves.push(i)
            }
            if(isOpponentOccupied(i)) {
                break
            }
        }
        // move up
        for(var i = gamePiece.position; i > 10;i = i - 10) {
            // needs check to see if position is already taken by friendly piece
            if((user.isPlayerOccupied(i) && i !== gamePiece.position) || isWater(i)) {
                break
            }
            if(i !== gamePiece.position) {
                possibleMoves.push(i)
            }
            if(isOpponentOccupied(i)) {
                break
            }
        }
    // moves for all other pieces (except bomb and flag)
    } else if (gamePiece.rank !== 0 && gamePiece.rank !== 11) {
        if (!(gamePiece.position >= 1 && gamePiece.position <= 10)) {
            if(!user.isPlayerOccupied(gamePiece.position - 10) && !isWater(gamePiece.position - 10)) {
                possibleMoves.push(gamePiece.position - 10)
            }
        }
        if (!(gamePiece.position >= 91 && gamePiece.position <= 100)) {
            if(!user.isPlayerOccupied(gamePiece.position + 10) && !isWater(gamePiece.position + 10)) {
                possibleMoves.push(gamePiece.position + 10)
            }
        }
        if (gamePiece.position % 10 !== 1) {
            if(!user.isPlayerOccupied(gamePiece.position - 1) && !isWater(gamePiece.position - 1)) {
                possibleMoves.push(gamePiece.position - 1)
            }
        }
        if (gamePiece.position % 10 !== 0) {
            if(!user.isPlayerOccupied(gamePiece.position + 1) && !isWater(gamePiece.position + 1)) {
                possibleMoves.push(gamePiece.position + 1)
            }
        }          
    }
}

// handle clicks on the board
clickSquareHandler = (event) => {
    if(deploymentPhase && selectedUndeployedGamePiece !== null) {
        if(!user.isPlayerOccupied(Number(event.target.dataset.position)) && (user.player === 1 && Number(event.target.dataset.position) > 60 || user.player === 2 && Number(event.target.dataset.position) < 41)) {
            selectedUndeployedGamePiece.position = Number(event.target.dataset.position)
            user.deployGamePiece(selectedUndeployedGamePiece)
            selectedUndeployedGamePiece = null
            // update dom
            updateDom()
        }
    } else if (deploymentPhase && selectedUndeployedGamePiece === null){
        if(user.isPlayerOccupied(Number(event.target.dataset.position)) !== false) {
            user.removeDeployedGamePiece(Number(event.target.dataset.position))
            //update dom
            updateDom()
        }
    } else if (playerTurn && selectedGamePiece === null) {
        //game time
        var selected = user.getGamePieceP(Number(event.target.dataset.position))
        if (selected !== undefined) {
            selectedGamePiece = selected
            clearPossibleMoves()
            getPossibleMoves(selected)
            showPossibleMoves()
            if(possibleMoves.length === 0) {
                selectedGamePiece = null
            }
            //update dom
            updateDom()
        }
    } else if (playerTurn && selectedGamePiece !== null) {
        if (possibleMoves.find((move) => move === Number(event.target.dataset.position)) !== undefined) {
            selectedGamePiece.position = Number(event.target.dataset.position)
            //update dom
            updateDom()
            hidePossibleMoves()
            clearPossibleMoves()
            selectedGamePiece = null
            playerTurn = false
            socket.emit('pass turn', {player: user.player, gamePieces: user.gamePieces})
        }
    }
}

// set up the game board (10 x 10 grid), each square is numbered 1-100
createGameBoard = () => {
    var gameBoard = document.querySelector('.game-board')
    for(i = 1; i <= 100; i++) {
        var boardSquare = document.createElement('div')
        boardSquare.className = `board-square`
        boardSquare.dataset.position = i
        boardSquare.addEventListener('click', clickSquareHandler)
        if (isWater(i)) {
            boardSquare.classList.add('water')
        } else {
            boardSquare.classList.add('land')
        }
        gameBoard.appendChild(boardSquare)
    }
}

// handle clicks for aside (deplotment phase)
clickPieceHandler = (event) => {
    if (selectedUndeployedGamePiece === null && deploymentPhase === true) {
        var rank = Number(event.target.dataset.spot)
        selectedUndeployedGamePiece = user.getUndeployedGamePiece(rank)
        user.removeUndeployedGamePiece(rank)
        // updatedom
        updateDom()
    }
}

// setup the aside for deployment phase
setupDeploymentAside = () => {
    h1Your.style.visibility = 'visible'
    var playerPieces = document.querySelector('.player-pieces')
    for(i = 0; i < 12; i++) {
        var playerPiece = document.createElement('div')
        playerPiece.style.backgroundImage = `url('IMG/${i}.svg')`
        playerPiece.className = `player-piece`
        playerPiece.dataset.spot = i
        playerPiece.addEventListener('click', clickPieceHandler)
        var pieceCounter = document.createElement('span')
        pieceCounter.className = `player-piece-count`
        pieceCounter.dataset.spot = i
        pieceCounter.textContent = user.getUndeployedGamePieceCount(i)

        playerPieces.appendChild(playerPiece)
        playerPieces.appendChild(pieceCounter)
    }
    showDeploymentZone()
}

// set up the aside for game play
setupGameplayAside = () => {
    //update opponent pieces left
    h1Enemy.style.visibility = 'visible'
    var opponentPieces = document.querySelector('.opponent-pieces')
    for(i = 0; i < 12; i++) {
        var OpponentPiece = document.createElement('div')
        OpponentPiece.style.backgroundImage = `url('IMG/${i}.svg')`
        OpponentPiece.className = `opponent-piece`
        OpponentPiece.dataset.spot = i
        var pieceCounter = document.createElement('span')
        pieceCounter.className = `opponent-piece-count`
        pieceCounter.dataset.spot = i
        pieceCounter.textContent = opponentGamePieceCount[i]

        opponentPieces.appendChild(OpponentPiece)
        opponentPieces.appendChild(pieceCounter)
    }
    // update player pieces left
    var playerPieceCounts = document.querySelectorAll('.player-piece-count')
    var numberOfPieces = user.getGamePieceCount()
    playerPieceCounts.forEach((span) => {
        span.textContent = numberOfPieces[Number(span.dataset.spot)]
    })
}


updateDom = () => {
    if(deploymentPhase) {
        // show undeployed pieces
        var playerPieceCounts = document.querySelectorAll('.player-piece-count')
        playerPieceCounts.forEach((span) => {
            span.textContent = user.getUndeployedGamePieceCount(Number(span.dataset.spot))
        })
    } else {
        // show pieces with position !== 0
        var playerPieceCounts = document.querySelectorAll('.player-piece-count')
        var numberOfPieces = user.getGamePieceCount()
        playerPieceCounts.forEach((span) => {
            span.textContent = numberOfPieces[Number(span.dataset.spot)]
        })
        // show opponent pieces left
        var opponentGamePieceCounters = document.querySelectorAll('.opponent-piece-count')
        opponentGamePieceCounters.forEach((span) => {
            span.textContent = opponentGamePieceCount[Number(span.dataset.spot)]
        })
    }
    // set all images to blank
    document.querySelectorAll('.board-square').forEach((square) => {
        square.style.backgroundImage = ''
        square.classList.remove('player1')
        square.classList.remove('player2')
    })
    // show opponents pieces (hidden)
    opponentGamePieces.forEach((gamePiece) => {
        if (gamePiece.position !== 0) {
            var square = document.querySelector(`[data-position='${gamePiece.position}']`)
            if(gamePiece.hidden === false) {
                square.style.backgroundImage = `url('IMG/${gamePiece.rank}.svg')`
            } else {
                square.style.backgroundImage = `url('IMG/hidden.svg')`
            }
            if (user.player === 1) {
                square.classList.add('player2')
            } else {
                square.classList.add('player1')
            }
        }
    })
    // show player pieces
    user.gamePieces.forEach((gamePiece) => {
        if (gamePiece.position !== 0) {
            var square = document.querySelector(`[data-position='${gamePiece.position}']`)
            square.style.backgroundImage = `url('IMG/${gamePiece.rank}.svg')`
            if (user.player === 1) {
                square.classList.add('player1')
            } else {
                square.classList.add('player2')
            }
        }
    })
}

submitDeployment = () => {
    // if (user.undeployedGamePieces.length === 0) {
        btnSubmitDeployment.style.visibility = 'hidden'
        hideDeploymentZone()
        socket.emit('deployment complete', {gamePieces: user.gamePieces, player: user.player})
    // }
}

connectToServer = () => {
    btnConnect.style.visibility = 'hidden'
    inputPlayerName.style.visibility = 'hidden'
    socket.emit('new player', inputPlayerName.value)
}

// replace user gamepieces with the gamepieces sent by the server
var h1Enemy = document.querySelector('.h1-enemy-army')
h1Enemy.style.visibility = 'hidden'
var h1Your = document.querySelector('.h1-your-army')
h1Your.style.visibility = 'hidden'

var inputPlayerName = document.querySelector('.player-name')
var btnConnect = document.querySelector('.connect')
btnConnect.addEventListener('click', connectToServer)

var btnSubmitDeployment = document.querySelector('.submit-deployment')
var pServerMsg = document.querySelector('.server-messages')
btnSubmitDeployment.addEventListener('click', submitDeployment)

var selectedUndeployedGamePiece = null
var selectedGamePiece = null
var deploymentPhase = true
var user = null
var opponentGamePieceCount = null
var playerTurn = false
var possibleMoves = []
var opponentGamePieces = []

// wait for server responses
socket.on('deployment starts', (res) => {
    user = new Player(res.name, Number(res.player))
    user.undeployedGamePieces = [...res.undeployedGamePieces]
    setupDeploymentAside()
})
socket.on('wait for other player deployment', (res) => {
    pServerMsg.textContent = res
})
socket.on('game starts', (res) => {
    pServerMsg.textContent = res.message
    opponentGamePieceCount = res.opponentCount
    deploymentPhase = false
    selectedUndeployedGamePiece = null
    setupGameplayAside()
    if (user.player === 1) {
        playerTurn = true
    }
    clearOpponentGamePieces()
    res.gamePieces.forEach((gamePiece) => {
        opponentGamePieces.push(gamePiece)
    })
    //updateDom
    updateDom()
})
socket.on('player turn', (res) => {
    playerTurn = true
    pServerMsg.textContent = res.message
    opponentGamePieceCount = res.opponentCount
    clearOpponentGamePieces()
    res.gamePieces.forEach((gamePiece) => {
        opponentGamePieces.push(gamePiece)
    })
    clearGamePieces()
    res.playerGamePieces.forEach((gamePiece) => {
        user.gamePieces.push(gamePiece)
    })
    //updateDom
    updateDom()
})
socket.on('opponent turn', (res) => {
    pServerMsg.textContent = res.message
    opponentGamePieceCount = res.opponentCount
    clearOpponentGamePieces()
    res.gamePieces.forEach((gamePiece) => {
        opponentGamePieces.push(gamePiece)
    })
    clearGamePieces()
    res.playerGamePieces.forEach((gamePiece) => {
        user.gamePieces.push(gamePiece)
    })
    //updateDom
    updateDom()
})

socket.on('player wins', (res) => {

})

socket.on('player loses', (res) => {
    
})

// user.player (1 or 2)
// user deploygamePiece
// user get undeployedgamepiece
// user remove undeployed gamepiece
// user get undeployedgamepiece count

createGameBoard()






