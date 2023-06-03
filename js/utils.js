'use strict'

// Return a random number between min - max(exclusive)
function getRandomInt(min, max) { 
    return Math.floor(Math.random()*(max-min) + min)
}

// Plays a sound effect
function playSound(name) {
	var audio = new Audio()
	audio.src = `sound/${name}.wav`
    audio.volume = 0.1
	audio.play()
}

function getSelector(coords) {
    return `.cell-${coords.i}-${coords.j}`
}

function getCellCoords(elCell) {
    const i = +elCell.className.split('-')[1]
    const j = +elCell.className.split('-')[2]
    return {i, j}
} 

function updateTimer() {
    const elTimer = document.querySelector('.timer')
    elTimer.innerText = gGame.secsPassed
    gGame.secsPassed++
}