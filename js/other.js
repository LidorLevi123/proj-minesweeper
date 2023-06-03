'use strict'

function updateLives() {
    const elLives = document.querySelector('.lives-container')
    var spanHTML = '<span>'

    for (var i = 0; i < gGame.liveCount; i++) {
        spanHTML += HEART
    }
    spanHTML += '</span>'
    elLives.innerHTML = spanHTML
}

function updateHints() {
    const elHints = document.querySelector('.hints-container')
    var spanHTML = ''

    for (var i = 0; i < gGame.hintCount; i++) {
        spanHTML += `<span class="hint" onclick="onHandleHint(this)">${HINT}</span>`
    }
    elHints.innerHTML = spanHTML
}

function updateSmiley(smiley) {
    clearTimeout(gGame.timeoutID)
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = smiley

    if (!gGame.isOn) return
    
    gGame.timeoutID = setTimeout(() => {
        elSmiley.innerText = SMILEY_NORMAL
    }, 1000)
}

function updateMinesLeft() {
    const elMinesLeft = document.querySelector('.total-mines')
    var minesLeft = gGame.isManualUsed ? gGame.minesToPlace - gGame.markedCount : gLevel.mines - gGame.markedCount
    minesLeft = minesLeft < 0 ? 0 : minesLeft
    elMinesLeft.innerText = minesLeft
}

function updateLeaderBoard() {
    if(localStorage.length <= 0) return
    var strHTML = ''

    for (var i = 0; i < localStorage.length; i++) {
        var name = localStorage.key(i);
        var nameStats = localStorage.getItem(name).split(',')
        var level = nameStats[0]
        var time = nameStats[1]

        strHTML += '<tr>'
        
        strHTML += `<td>${name}</td>`
        strHTML += `<td>${level}</td>`
        strHTML += `<td>${time}</td>`

        strHTML += '</tr>'
    }
    const elLeaderBoard = document.querySelector('.leader-board')
    elLeaderBoard.innerHTML = strHTML
}

function openLeaderboard(isOpen) {
    const elLeaderBoard = document.querySelector('.leaderboard-container')
    elLeaderBoard.style.display = isOpen ? 'inline-block' : 'none'
}

function addToLeaderBoard() {
    if(gGame.isManualUsed) return
    setTimeout(()=> {
        const isInterested = confirm('You won! Are you interested in being displayed on the leaderboards?')
        if(!isInterested || !gGame.secsPassed) return
    
        const name = prompt('I knew you got that winner sense inside you ;)\nPlease enter your name.')
        const statsStr = `${gLevel.level}, ${gGame.secsPassed-1}`
        localStorage.setItem(name, statsStr)
        updateLeaderBoard()
    },50)
}
