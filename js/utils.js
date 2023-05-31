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