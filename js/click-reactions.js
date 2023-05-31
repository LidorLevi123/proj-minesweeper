'use strict'

function onCellClicked(elCell, i, j, event) {
    if (!gGame.isOn) return
    var cell = gBoard[i][j]

    if (event.button === 2) {
        onCellMarked(cell)
    } else {

        if (!gGame.isClickedOnce && !gGame.isManualMode && !gGame.isMinesPlaced) {
            gGame.isClickedOnce = true
            setRandomMines()
            setMinesNegsCount()
        } else if (gGame.isManualMode) {
            placeMine(elCell, i, j)
            return
        }

        if (cell.isShown || cell.isMarked) return

        if (gGame.isHintMode) {
            gGame.isHintMode = false
            revealNearbyCells(i, j)

        } else {
            gGame.cellStack.push({ element: elCell, cell, i, j })
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
    var elSlider = document.querySelector('#slider')

    switch (diff) {
        case 1: gLevel = BEGINNER; break
        case 2: gLevel = MEDIUM; break
        case 3: gLevel = EXPERT; break
    }

    console.log(gLevel.mines);
    elSlider.max = gLevel.size ** 2

    onInit()
}

function onSafeClick() {

    if (gGame.safeCount <= 0) return
    if (onSafeClick.callCount >= 10) return

    onSafeClick.callCount = (onSafeClick.callCount || 0) + 1

    const randI = getRandomInt(0, gBoard.length)
    const randJ = getRandomInt(0, gBoard.length)
    const cell = gBoard[randI][randJ]

    if (cell.isMine || cell.isShown) onSafeClick()
    else {
        const selector = getSelector({ i: randI, j: randJ })
        const elCell = document.querySelector(selector)

        gGame.safeCount--

        elCell.style.backgroundColor = 'white'
        setTimeout(() => {
            elCell.style.backgroundColor = 'rgb(105, 105, 105)'
        }, 3000)
    }
}

function onSwitchToSlider(elBtn) {
    var elSlider = document.querySelector('#slider')
    var elSquare = document.querySelector('.square')

    elBtn.style.display = 'none'
    elSlider.style.display = 'inline-block'
    elSquare.style.display = 'inline-block'
}

function onChangeSliderValue(elSlider) {

    var elSelectedValue = document.querySelector('.amount')

    elSelectedValue.innerText = elSlider.value
}

function onManualMode(elValue) {
    gGame.isManualMode = true
    gGame.minesToPlace = +elValue.innerText
}

function onUndo() {
    if (gGame.cellStack.length <= 0) return

    const prevCell = gGame.cellStack.pop()

    if (prevCell.isMine) {
        prevCell.element.style.backgroundColor = 'rgb(105, 105, 105)'
        gGame.liveCount++
        gGame.markedCount--
    }
    gGame.shownCount--
    gBoard[prevCell.i][prevCell.j] = prevCell
    renderBoard()
}

function onMoveCircle() {
    gGame.isDarkMode = !gGame.isDarkMode
    const elSlider = document.querySelector('.dark-slider')
    const elCircle = document.querySelector('.circle')
    const elBody = document.querySelector('body')
    const elAll = document.querySelector('*')

    if(gGame.isDarkMode) {
        elCircle.style.left = '57px'
        elCircle.style.backgroundColor = 'rgb(105, 105, 105)'
        elSlider.style.backgroundColor = 'rgb(235, 235, 235)'
        elBody.style.backgroundColor = '#111'
        elAll.style.color = 'white'
    } else {
        elCircle.style.left = '3px'
        elCircle.style.backgroundColor = 'rgb(235, 235, 235)'
        elSlider.style.backgroundColor = 'rgb(105, 105, 105)'
        elBody.style.backgroundColor = 'white'
        elAll.style.color = 'black'
    }
}