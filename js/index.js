'use strict'

const BEGINNER = { size: 4, mines: 2 }
const MEDIUM = { size: 8, mines: 14 }
const EXPERT = { size: 12, mines: 32 }

const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ''

var gBoard
var gLevel
var gGame

function onInit() {

    gLevel = BEGINNER
    gBoard = buildBoard(gLevel.size)
    gGame = resetGame()

    // setRandomMines()
    setMinesNegsCount()
    renderBoard()
}

function buildBoard(size) {
    var board = []

    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    board[0][0].isMine = true
    board[3][3].isMine = true

    console.log(board);

    return board
}

function renderBoard() {
    var strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gBoard.length; j++) {

            var currCell = gBoard[i][j]
            var className = 'cell'
            var data = currCell.minesAroundCount

            if (currCell.isShown) {
                if (currCell.isMine) {
                    className += ' mine'
                    data = MINE
                }
                if (currCell.isMarked) {
                    className += ' marked'
                    data = FLAG
                }
            } else {
                data = EMPTY
            }

            strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})">${data}</td>`

        }
        strHTML += '</tr>'
    }

    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML

}

function onCellClicked(elCell, i, j) {
    var cell = gBoard[i][j]

    if (cell.isShown) return
    if (!cell.isMine) cell.isShown = true
    renderBoard()

}

function onCellMarked(elCell) {
    console.log('Marked');
}

function checkGameOver() {
    console.log('Game Over');
}

function expandShown(board, elCell, i, j) {
    console.log('Revealing Cells');
}

function revealAllMines() {
    console.log('Game over! Revealing all mines...')
}

function setRandomMines() {
    for (var i = 0; i < gLevel.mines; i++) {
        
        var randI = getRandomInt(0, gBoard.length)
        var randJ = getRandomInt(0, gBoard.length)

        var currCell = gBoard[randI][randJ]

        if (!currCell.isMine) gBoard[randI][randJ].isMine = true
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

function resetGame() {
    return {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
}