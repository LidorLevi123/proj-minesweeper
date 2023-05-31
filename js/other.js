'use strict'

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

    for (var i = 0; i < gGame.hintCount; i++) {
        spanHTML += `<span class="hint" onclick="onHandleHint(this)">${HINT}</span>`
    }
    elHints.innerHTML = spanHTML
}

function updateSmiley(smiley, isSetTimeout) {
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = smiley

    if(!isSetTimeout) return

    setTimeout(() => {
        elSmiley.innerText = SMILEY_NORMAL
    }, 1500)
}