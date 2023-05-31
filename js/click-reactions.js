'use strict'

function onCellClicked(elCell, i, j, event) {
    if (!gGame.isOn) return
    var cell = gBoard[i][j]

    if (event.button === 2) {
        onCellMarked(cell)
    } else {

        if (!gGame.isClickedOnce) {
            gGame.isClickedOnce = true
            setRandomMines()
            setMinesNegsCount()
        }

        if (cell.isShown || cell.isMarked) return

        if (gGame.isHintMode) {
            gGame.isHintMode = false
            revealNearbyCells(i, j)

        } else {

            if (!cell.isMine) expandShown(i, j)
            else handleMine(elCell, cell)
        }

    }

    checkGameOver()
    renderBoard()
}

function onHandleHint(elHint) {
    gGame.isHintMode = true

    elHint.style.backgroundColor = 'yellow'
    gGame.hintCount--
}

function onCellMarked(cell) {
    if (cell.isMarked) {
        cell.isMarked = false
        gGame.markedCount--
    } else {
        cell.isMarked = true
        gGame.markedCount++
    }
}

function onSafeClick() {

    const randI = getRandomInt(0, gBoard.length)
    const randj = getRandomInt(0, gBoard.length)
    const cell = gBoard[randI][randj]

    if(cell.isMine || cell.isShown) onSafeClick()
}