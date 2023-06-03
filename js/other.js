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
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = smiley

    if (smiley === SMILEY_DEAD || smiley === SMILEY_WIN) return

    setTimeout(() => {
        elSmiley.innerText = SMILEY_NORMAL
    }, 1200)
}

function updateMinesLeft() {
    const elMinesLeft = document.querySelector('.total-mines')
    var minesLeft = gGame.isManualUsed ? gGame.minesToPlace - gGame.markedCount : gLevel.mines - gGame.markedCount
    minesLeft = minesLeft < 0 ? 0 : minesLeft
    elMinesLeft.innerText = minesLeft
}

function openLeaderboard(isOpen) {
    const elLeaderBoard = document.querySelector('.leaderboard-container')
    elLeaderBoard.style.display = isOpen ? 'inline-block' : 'none'
}

function addToLeaderBoard() {
    const isInterested = confirm('You won! Are you interested in being displayed on the leaderboards?')
    if(!isInterested || !gGame.secsPassed) return

    const name = prompt('I knew you got that winner sense inside you ;)\nPlease enter your name.')
    localStorage.setItem(name, gGame.secsPassed)
    updateLeaderBoard()
}

function updateLeaderBoard() {
    if(localStorage.length <= 0) return
    var strHTML = ''

    for (var i = 0; i < localStorage.length; i++) {
        var name = localStorage.key(i);
        var time = localStorage.getItem(name)-1;
        strHTML += '<tr>'
        
        strHTML += `<td>${name}</td>`
        strHTML += `<td>${time}</td>`

        strHTML += '</tr>'
    }
    const elLeaderBoard = document.querySelector('.leader-board')
    elLeaderBoard.innerHTML = strHTML
}

