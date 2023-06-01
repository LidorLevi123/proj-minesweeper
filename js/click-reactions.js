'use strict'

function onCellClicked(elCell, i, j, event) {
    if (!gGame.isOn) return
    var cell = gBoard[i][j]

    if (event.button === 2) {
        onCellMarked(cell)
    } else {
        if (cell.isShown || cell.isMarked) return

        if (!gGame.isClickedOnce && !gGame.isManualMode && !gGame.isManualUsed && !gGame.isMegaMode) {
            gGame.isClickedOnce = true
            gTimerInterval = setInterval(timer, 1000)
            setRandomMines()
            setMinesNegsCount()
        } else if (gGame.isManualMode) {
            placeMine(elCell, i, j)
            return
        } else if (gGame.isMegaMode && !gGame.isMegaUsed) {
            handleMegaMode(elCell, {i, j})
            return
        } 
        if (gGame.isHintMode) {
            gGame.isHintMode = false
            revealNearbyCells(i, j)
        } else {
            gGame.cellStack.push({ element: elCell, cell, i, j })
            if (!cell.isMine) expandShown(i, j)
            else handleMine(elCell, cell)
        }
    }
    renderBoard()
    checkGameOver()
}

function onHandleHint(elHint) {
    gGame.isHintMode = !gGame.isHintMode
    var elHints = document.querySelector('.hints-container')

    if (gGame.isHintMode) elHint.style.backgroundColor = 'yellow'
    else updateHints(elHints)
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

function onSwitchToSlider(isSlider) {
    if (isSlider) {
        const elManualBtn = document.querySelector('.manual-btn')
        const elSlider = document.querySelector('#slider')
        const elAmount = document.querySelector('.square')
        elManualBtn.style.display = 'none'
        elSlider.style.display = 'inline-block'
        elAmount.style.display = 'inline-block'
    } else {
        const elManualBtn = document.querySelector('.manual-btn')
        const elSlider = document.querySelector('#slider')
        const elAmount = document.querySelector('.square')
        elManualBtn.style.display = 'inline-block'
        elSlider.style.display = 'none'
        elAmount.style.display = 'none'
    }
}

function onChangeSliderValue(elSlider) {

    var elSelectedValue = document.querySelector('.amount')

    elSelectedValue.innerText = elSlider.value
}

function onManualMode(elValue) {
    onInit()
    gGame.isManualMode = true
    gGame.minesToPlace = +elValue.innerText
}

function onUndo() {
    if (gGame.cellStack.length <= 0 || !gGame.isOn) return

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

function onToggleDarkMode() {
    gGame.isDarkMode = !gGame.isDarkMode
    const elSlider = document.querySelector('.dark-slider')
    const elCircle = document.querySelector('.circle')
    const elBody = document.querySelector('body')
    const elAll = document.querySelector('*')
    const elDogImg = document.querySelector('.dog')

    if (gGame.isDarkMode) {
        elCircle.style.left = '57px'
        elCircle.style.backgroundColor = 'rgb(105, 105, 105)'
        elSlider.style.backgroundColor = 'rgb(235, 235, 235)'
        elBody.style.backgroundColor = '#111'
        elAll.style.color = 'white'
        elDogImg.style.filter = 'hue-rotate(1turn)'
    } else {
        elCircle.style.left = '3px'
        elCircle.style.backgroundColor = 'rgb(235, 235, 235)'
        elSlider.style.backgroundColor = 'rgb(105, 105, 105)'
        elBody.style.backgroundColor = 'rgb(235, 235, 235)'
        elAll.style.color = 'black'
    }
}

function onMegaHint() {
    gGame.isMegaMode = true
}

function onDestroyMines() {
    if(!gGame.isClickedOnce) return

    const mines = getAllMinesLocations()
    const blownMines = []

    if(!mines.length) return

    console.log(mines.length);
    for (var i = 0; i < 3; i++) {
        if(!mines.length) break
        var randIdx = getRandomInt(0, mines.length)

        blownMines.push(mines[randIdx])
        mines[randIdx].isShown = true
        mines.splice(randIdx, 1)
    }
    renderBoard()

    setTimeout(()=> {
        for (var i = 0; i < blownMines.length; i++) {
            blownMines[i].isBlown = true
            blownMines[i].isMine = false
            gGame.markedCount++
        }
        setMinesNegsCount()
        renderBoard()
    }, 600)
}