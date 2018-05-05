import {TweenMax} from 'gsap'
import Bar from './Bar'

const canvas = document.getElementById('screen')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false

let barSettings = {
    width: 602,
    height: 100,
    lineWidth: 4,
    get x() {return (canvas.width/2) - (this.width/2)},
    get y() {return (canvas.height/2) - (this.height/2)}
}

let bar = new Bar(barSettings, ctx)

window.addEventListener('keydown', (event) => {
    if (event.keyCode === 32) {
        bar.damage(0.1)
    } else if (event.keyCode === 72) {
        bar.heal(0.1)
    }
} )

function drawBg(color) {
    ctx.fillStyle= `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)` 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function update() {
    drawBg([242, 218, 127])
    bar.draw(ctx)

    requestAnimationFrame(update);
}

update();
