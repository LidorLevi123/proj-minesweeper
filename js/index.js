'use strict'

const BEGINNER = { size: 4, mines: 2 }
const MEDIUM = { size: 8, mines: 14 }
const EXPERT = { size: 12, mines: 32 }

const HEART = '💖'
const MINE = '💣'
const FLAG = '🚩'
const HINT = '💡'
const EMPTY = ''

const SMILEY_NORMAL = '😃'
const SMILEY_WIN = '😎'
const SMILEY_HURT = '😲'
const SMILEY_DEAD = '💀'


var gBoard
var gGame
var gLevel = EXPERT

function onInit() {
    gBoard = buildBoard()
    gGame = resetGame()

    
    renderBoard()
}

function buildBoard() {
    var board = []

    for (var i = 0; i < gLevel.size; i++) {
        board.push([])
        for (var j = 0; j < gLevel.size; j++) {
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

            if (data === 1) className += ' blue'
            else if (data === 2) className += ' green'
            else if (data === 3) className += ' red'
            else if (data === 4) className += ' darkblue'
            else if (data === 5) className += ' darkred'

            if (currCell.isShown) {
                className += ' clicked'
                if (currCell.isMine) {
                    data = MINE
                    className += ' mine'
                }
            } else if (currCell.isMarked) {
                data = FLAG
            } else {
                data = EMPTY
            }

            strHTML += `<td 
            class="${className} cell-${i}-${j}" 
            onmousedown="onCellClicked(this, ${i}, ${j}, event)">
            ${data}
            </td>`

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

function checkGameOver() {
    if (gGame.liveCount <= 0) {
        gGame.isOn = false
        updateSmiley(SMILEY_DEAD)
    } else if (checkVictory()) {
        gGame.isOn = false
        updateSmiley(SMILEY_WIN)
    }
}

function checkVictory() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if(!currCell.isShown && !currCell.isMarked) return false
        }
    }
    if(gGame.minesToPlace) return gGame.markedCount === gGame.minesToPlace
    return gGame.markedCount === gLevel.mines
}

function revealNearbyCells(rowIdx, colIdx) {

    var revealedCells = []

    for (var i = rowIdx - 1; i < rowIdx + 2; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j < colIdx + 2; j++) {
            if (j < 0 || j >= gBoard.length) continue
            if(gBoard[i][j].isShown) continue

            var currCell = gBoard[i][j]

            currCell.isShown = true
            revealedCells.push(currCell)
        }
    }

    setTimeout(() => {
        revealedCells.forEach(cell => {
            cell.isShown = false
        })
        renderBoard()
    }, 1000)
}

function expandShown(i, j) {
    
    if (i < 0 || i >= gBoard.length) return
    if (j < 0 || j >= gBoard.length) return
    if (gBoard[i][j].isShown) return
    
    gGame.cellStack.push({ element: null, cell: gBoard[i][j], i, j })
    gBoard[i][j].isShown = true
    gGame.shownCount++
    
    if (gBoard[i][j].minesAroundCount > 0) return

    // Check upper row neighbors
    expandShown(i - 1, j - 1)
    expandShown(i - 1, j)
    expandShown(i - 1, j + 1)
    // Check same row neighbors    
    expandShown(i, j - 1)
    expandShown(i, j + 1)
    // Check lower row neighbors
    expandShown(i + 1, j - 1)
    expandShown(i + 1, j)
    expandShown(i + 1, j + 1)
}

function resetGame() {
    updateSmiley(SMILEY_NORMAL)
    return {
        isOn: true,
        isClickedOnce: false,
        isDarkMode: false,
        isHintMode: false,
        isManualMode: false,
        isMinesPlaced: false,
        minesToPlace: 0,
        minesPlaced: 0,
        liveCount: 3,
        hintCount: 3,
        safeCount: 3,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        cellStack: []
    }
}