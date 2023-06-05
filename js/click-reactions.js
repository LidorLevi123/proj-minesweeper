'use strict'

function onCellClicked(elCell, i, j, event) {
    if (!gGame.isOn) return
    if (event.button === 2) {
        onCellMarked(gBoard[i][j])
    } else {
        const cell = gBoard[i][j]

        if (cell.isShown || cell.isMarked) return

        if (gGame.isHintMode) {
            revealNearbyCells(i, j)
            return
        } else if (gGame.isManualMode) {
            placeMine(elCell, i, j)
            return
        } else if (gGame.isMegaMode && !gGame.isMegaUsed) {
            handleMegaMode(elCell, { i, j })
            return
        } else if (!gGame.isClickedOnce && !gGame.isManualUsed) {
            gTimerInterval = setInterval(updateTimer, 1000)
            gGame.cellStack.push([cell, { i, j }])
            gGame.isClickedOnce = true
            cell.isShown = true
            renderBoard()
            setRandomMines()
            setMinesNegsCount()
            return
        } else {
            handleMine(cell, i, j)
            expandShown(i, j)
        }
    }
    renderBoard()
    checkGameOver()
}

function onHandleHint(elHint) {
    gGame.isHintMode = !gGame.isHintMode
    elHint.style.backgroundColor = gGame.isHintMode ? 'yellow' : updateHints()
}

function onCellMarked(cell) {
    cell.isMarked = !cell.isMarked
    gGame.markedCount += cell.isMarked ? 1 : -1
}

function onChangeLevel(diff) {
    var elSlider = document.querySelector('#slider')

    switch (diff) {
        case 1: gLevel = BEGINNER; break
        case 2: gLevel = MEDIUM; break
        case 3: gLevel = EXPERT; break
    }

    elSlider.max = gLevel.size ** 2

    onInit()
}

function onSafeClick() {

    if (!gGame.isClickedOnce) return
    if (gGame.safeCount <= 0) return
    if (!isEmptyCellsLeft()) return

    const randI = getRandomInt(0, gBoard.length)
    const randJ = getRandomInt(0, gBoard.length)
    const cell = gBoard[randI][randJ]

    if (cell.isMine || cell.isShown || cell.isMarked) onSafeClick()
    else {
        const selector = getSelector({ i: randI, j: randJ })
        const elCell = document.querySelector(selector)

        gGame.safeCount--

        elCell.style.backgroundColor = 'white'
        setTimeout(() => {
            elCell.style.backgroundColor = 'rgb(105, 105, 105)'
        }, 2000)
    }
}

function onSwitchToSlider(isSlider) {
    const elManualBtn = document.querySelector('.manual-btn')
    const elSlider = document.querySelector('#slider')
    const elAmount = document.querySelector('.square')

    if (isSlider) {
        elManualBtn.style.display = 'none'
        elSlider.style.display = 'inline-block'
        elAmount.style.display = 'inline-block'
    } else {
        elManualBtn.style.display = 'inline-block'
        elSlider.style.display = 'none'
        elAmount.style.display = 'none'
    }
}

function onChangeSliderValue(elSlider) {
    const elSelectedValue = document.querySelector('.amount')
    elSelectedValue.innerText = elSlider.value
}

function onManualMode(elValue) {
    onInit()
    gGame.isManualMode = true
    gGame.minesToPlace = +elValue.innerText
}

function onUndo() {
    if (gGame.cellStack.length <= 0 || !gGame.isOn) return

    const prevDetails = gGame.cellStack.pop()

    const prevCell = prevDetails[0]
    const prevCellCoords = { i: prevDetails[1].i, j: prevDetails[1].j }

    if (prevCell.isMine) {
        gGame.liveCount++
        gGame.markedCount--
    }
    prevCell.isShown = false
    gGame.shownCount--
    gBoard[prevCellCoords.i][prevCellCoords.j] = prevCell
    renderBoard()
}

function onToggleDarkMode() {
    gGame.isDarkMode = !gGame.isDarkMode
    const elSlider = document.querySelector('.dark-slider')
    const elCircle = document.querySelector('.circle')
    const elBody = document.querySelector('body')
    const elFooter = document.querySelector('h2')
    const elDogImg = document.querySelector('.dog')

    if (gGame.isDarkMode) {
        elCircle.style.left = '57px'
        elCircle.style.backgroundColor = 'rgb(105, 105, 105)'
        elSlider.style.backgroundColor = 'rgb(235, 235, 235)'
        elBody.style.backgroundColor = '#111'
        elFooter.style.color = 'white'
        elDogImg.style.filter = 'hue-rotate(0turn)'
    } else {
        elCircle.style.left = '3px'
        elCircle.style.backgroundColor = 'rgb(235, 235, 235)'
        elSlider.style.backgroundColor = 'rgb(105, 105, 105)'
        elBody.style.backgroundColor = 'rgb(235, 235, 235)'
        elFooter.style.color = 'black'
    }
}

function onMegaHint() {
    gGame.isMegaMode = true
}

function onDestroyMines() {
    // if (!gGame.isClickedOnce) return

    const mines = getAllMinesLocations()
    const blownMines = []

    if (!mines.length) return

    for (var i = 0; i < 3; i++) {
        if (!mines.length) break
        var randIdx = getRandomInt(0, mines.length)
        blownMines.push(mines[randIdx])

        mines[randIdx].isShown = true
        mines.splice(randIdx, 1)
    }
    renderBoard()

    setTimeout(() => {
        for (var i = 0; i < blownMines.length; i++) {
            blownMines[i].isBlown = true
            blownMines[i].isMine = false
            gGame.markedCount++
        }
        setMinesNegsCount()
        renderBoard()
    }, 600)
}