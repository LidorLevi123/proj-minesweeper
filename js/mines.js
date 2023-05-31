'use strict'

function revealAllMines() {
    console.log('Game over! Revealing all mines...')
}

function handleMine(elCell, cell) {
    elCell.style.backgroundColor = 'red'
    cell.isShown = true
    gGame.liveCount--
    updateSmiley(SMILEY_SAD)
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