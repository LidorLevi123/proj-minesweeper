'use strict'

const BEGINNER = { size: 4, mines: 2 }
const MEDIUM = { size: 8, mines: 14 }
const EXPERT = { size: 12, mines: 14 }

const HEART = '💖'
const MINE = '💣'
const FLAG = '🚩'
const HINT = '💡'
const EMPTY = ''

const SMILEY_NORMAL = '😃'
const SMILEY_SAD = '😲'
const SMILEY_WIN = '😎'

var gBoard
var gLevel
var gGame

function onInit() {

    gLevel = EXPERT
    gBoard = buildBoard(gLevel.size)
    gGame = resetGame()

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
                isMarked: false,
                isClicked: false
            }
        }
    }

    return board
}

function renderBoard() {
    var strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gBoard.length; j++) {

            var currCell = gBoard[i][j]
            var className = 'cell'
            var data = currCell.minesAroundCount > 0 ? currCell.minesAroundCount : ''

            if (currCell.isShown) {
                className += ' clicked'
                if (currCell.isMine) {
                    data = MINE
                    className += ' mine'
                }
                if (currCell.isClicked) {
                    className += ' clicked'
                }

            } else if (currCell.isMarked) {
                data = FLAG
            } else {
                data = EMPTY
            }

            strHTML += `<td class="${className}" onmousedown="onCellClicked(this, ${i}, ${j}, event)">${data}</td>`

        }
        strHTML += '</tr>'
    }

    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    
    elBoard.addEventListener('contextmenu', (event) => {
        event.preventDefault()
    })
    
    var elLives = document.querySelector('.lives-container')
    var elHints = document.querySelector('.hints-container')
    updateLives(elLives)
    updateHints(elHints)
}

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
        cell.isClicked = true

        if (!cell.isMine) {
            gGame.shownEmptyCount++
            expandShown(i, j)
        }
        else handleMine(elCell, cell)
    }

    // checkGameOver()
    renderBoard()
}

function updateLives(elLives) {
    var spanHTML = '<span>'

    for (var i = 0; i < gGame.liveCount; i++) {
        spanHTML += HEART
    }
    spanHTML += '</span>'
    elLives.innerHTML = spanHTML
}

function updateHints(elHints) {
    var spanHTML = ''

    for (var i = 0; i < 3; i++) {
        spanHTML += `<span class="hint hint${i+1}" onclick="onHandleHint(this)">${HINT}</span>`
    }
    elHints.innerHTML = spanHTML
}

function updateSmiley(smiley) {
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = smiley

    setTimeout(() => {
        elSmiley.innerText = SMILEY_NORMAL
    }, 1500)
}

function onHandleHint(elHint) {
    if(elHint.classList.contains('used')) return

    elHint.classList.add('used')
    elHint.style.backgroundColor = 'yellow'
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

function checkGameOver() {
    if (gGame.liveCount <= 0) {
        gGame.isOn = false
        console.log('You lose! :(')
    } else if (gBoard.length ** 2) {

    }
}

function expandShown(rowIdx, colIdx) {

    for (var i = rowIdx - 1; i < rowIdx + 2; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j < colIdx + 2; j++) {
            if (j < 0 || j >= gBoard.length) continue

            if (!gBoard[i][j].isMine) gBoard[i][j].isShown = true
        }
    }


    // if (board[i][j].minesAroundCount !== 0) return
    // if (board[i][j].isShown) return
    // if (i < 0 || i >= board.length) return
    // if (j < 0 || j >= board.length) return

    // board[i][j].isShown = true

    // // Check upper row neighbors
    // expandShown(i-1, j-1)
    // expandShown(i-1, j)
    // expandShown(i-1, j+1)
    // // Check same row neighbors    
    // expandShown(i, j-1)
    // expandShown(i, j+1)
    // // Check lower row neighbors
    // expandShown(i+1, j-1)
    // expandShown(i+1, j)
    // expandShown(i+1, j+1)
}

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

function resetGame() {
    return {
        isOn: true,
        isClickedOnce: false,
        liveCount: 3,
        shownCount: 0,
        markedCount: 0,
        shownEmptyCount: 0,
        secsPassed: 0
    }
}