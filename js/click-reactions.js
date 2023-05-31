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

function onChangeLevel(diff) {

    switch(diff) {
        case 1: gLevel = BEGINNER; break
        case 2: gLevel = MEDIUM; break
        case 3: gLevel = EXPERT; break
    }

    onInit()
}

function onSafeClick() {

    if(gGame.safeCount <= 0) return
    if(onSafeClick.callCount >= 10) return

    onSafeClick.callCount = (onSafeClick.callCount || 0) + 1

    const randI = getRandomInt(0, gBoard.length)
    const randJ = getRandomInt(0, gBoard.length)
    const cell = gBoard[randI][randJ]
    
    if(cell.isMine || cell.isShown) onSafeClick()
    else {
        const selector = getSelector({i: randI, j: randJ})
        const elCell = document.querySelector(selector)
    
        gGame.safeCount--
    
        elCell.style.backgroundColor = 'white'
        setTimeout(() => {
            elCell.style.backgroundColor = 'rgb(105, 105, 105)'
        }, 3000)
    }
}

function onManualMode(elBtn) {
    var elSlider = document.querySelector('#slider')
    var elValue = document.querySelector('.value')

    elBtn.style.display = 'none'
    elSlider.style.display = 'inline-block'
    elValue.style.display = 'inline-block'
}

function onChangeSliderValue(elSlider) {

    var elSelectedValue = document.querySelector('.value')
    var value = elSlider.value

    elSelectedValue.innerText = value
}