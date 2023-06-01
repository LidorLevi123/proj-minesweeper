'use strict'

function revealAllMinesAtRange(topLeftCoord, bottomRightCoord) {
    var revealedCells = []

    for (var i = topLeftCoord.i; i < bottomRightCoord.i + 1; i++) {
        for (var j = topLeftCoord.j; j < bottomRightCoord.j + 1; j++) {
            if(gBoard[i][j].isShown) continue

            var currCell = gBoard[i][j]

            currCell.isShown = true
            currCell.isMegaHint = true
            revealedCells.push(currCell)
        }
    }
    renderBoard()

    setTimeout(() => {
        revealedCells.forEach(cell => {
            cell.isShown = false
            cell.isMegaHint = false
        })
        renderBoard()
    }, 3000)
}

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