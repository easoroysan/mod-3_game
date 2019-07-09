//these four are already in the index.js page
let s = (element) => document.querySelector(element)
let c = (element) => document.createElement(element)
const styleLink = './style.css'
const gameLink = './game.css'

//put these in index.js later
let gameArea

document.addEventListener('DOMContentLoaded',()=>{

    gameArea = new GameArea()
    gameArea.render()

    player = new PlayableCharacter(30,30)
    document.body.append(player.element)

})
 