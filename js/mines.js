'use strict'

function placeMine(elCell, i, j) {
    gGame.isManualUsed = true
    gBoard[i][j].isMine = true
    gGame.minesPlaced++
    elCell.innerText = MINE
    if(gGame.minesToPlace === gGame.minesPlaced) {
        setMinesNegsCount()
        renderBoard()
        onSwitchToSlider(false)
        gGame.isManualMode = false
    }
}

function handleMine(elCell, cell) {
    elCell.style.backgroundColor = 'red'
    cell.isShown = true
    gGame.liveCount--
    gGame.shownCount++
    gGame.markedCount++
    updateSmiley(SMILEY_HURT)
}

function setRandomMines() {

    for (var i = 0; i < gLevel.mines; i++) {

        var randI = getRandomInt(0, gBoard.length)
        var randJ = getRandomInt(0, gBoard.length)

        var currCell = gBoard[randI][randJ]

        if (!currCell.isMine && !currCell.isShown) gBoard[randI][randJ].isMine = true
        else i--
    }
}

function setMinesNegsCount() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            gBoard[i][j].minesAroundCount = getNearbyMinesCount(i, j)
        }
    }
}

function getNearbyMinesCount(rowIdx, colIdx) {
    var count = 0

    for (var i = rowIdx - 1; i < rowIdx + 2; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j < colIdx + 2; j++) {
            if (j < 0 || j >= gBoard.length) continue
            if (i === rowIdx && j === colIdx) continue

            if (gBoard[i][j].isMine) count++
        }
    }
    return count
}

function getAllMinesLocations() {
    
    var mines = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {

            var currCell = gBoard[i][j]
            if(currCell.isMine) mines.push(currCell)
        }
    }
    return mines
}