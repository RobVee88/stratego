
/// CLIENT SIDE FUNCTIONS

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
    } else {
        //game time
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
}

// set up the aside for game play
setupGameplayAside = () => {
    var opponentPieces = document.querySelector('.opponent-pieces')
    for(i = 0; i < 12; i++) {
        var OpponentPiece = document.createElement('div')
        OpponentPiece.style.backgroundImage = `url('IMG/${i}.svg')`
        OpponentPiece.className = `opponent-piece`
        OpponentPiece.dataset.spot = i
        var pieceCounter = document.createElement('span')
        pieceCounter.className = `opponent-piece-count`
        pieceCounter.dataset.spot = i
        console.log(opponentGamePieceCount)
        pieceCounter.textContent = opponentGamePieceCount[i]

        opponentPieces.appendChild(OpponentPiece)
        opponentPieces.appendChild(pieceCounter)
    }
}


updateDom = () => {
    if(deploymentPhase) {
        playerPieceCounts = document.querySelectorAll('.player-piece-count')
        playerPieceCounts.forEach((span) => {
            span.textContent = user.getUndeployedGamePieceCount(Number(span.dataset.spot))
        })
    } else {
        // show pieces with position 0
    }
    // set all images to blank
    document.querySelectorAll('.board-square').forEach(square => square.style.backgroundImage = '')
    // show opponents pieces (hidden)
    user.gamePieces.forEach((gamePiece) => {
        if (gamePiece.position !== 0) {
            var square = document.querySelector(`[data-position='${gamePiece.position}']`)
            console.log(square)
            square.style.backgroundImage = `url('IMG/${gamePiece.rank}.svg')`
        }
    })
}

submitDeployment = () => {
    // if (user.undeployedGamePieces.length === 0) {
        btnSubmitDeployment.style.visibility = 'hidden'
        socket.emit('deployment complete', {gamePieces: user.gamePieces, player: user.player})
    // }
}

// replace user gamepieces with the gamepieces sent by the server

var btnSubmitDeployment = document.querySelector('.submit-deployment')
var pServerMsg = document.querySelector('.server-messages')
btnSubmitDeployment.addEventListener('click', submitDeployment)

var selectedUndeployedGamePiece = null
var selectedGamePiece = null
var deploymentPhase = true
var user = null
var opponentGamePieceCount = null
socket.emit('new player','harrie')

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
})
socket.on('player turn', () => {

})

// user.player (1 or 2)
// user deploygamePiece
// user get undeployedgamepiece
// user remove undeployed gamepiece
// user get undeployedgamepiece count

createGameBoard()






