var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 10
canvas.height = window.innerHeight - 10

const TEXTURES = {
	earth: "earth.png",
	grass: "grass.png",
}
const srcToImg = src => {
	var i = new Image();
	i.src = src;
	return i
}

for (var key in TEXTURES) {
	if (TEXTURES.hasOwnProperty(key)) {
		TEXTURES[key] = srcToImg(TEXTURES[key])
	}
}


canvas.width = 1000
canvas.height = 1000
ctx.clearRect(0, 0, canvas.width, canvas.height);

const BLOCK_SIZE = 15

const pointToPx = (p) => p * BLOCK_SIZE


class Grid {
	constructor() {
		this.height = Math.floor(canvas.height / BLOCK_SIZE)
		this.width = Math.floor(canvas.width / BLOCK_SIZE)

		const i2xy = (i) => {return {x: ~~(i / this.width), y: i % this.height}}
		this.blocks = Array.apply(null, Array(this.width * this.height)).map((b,i) => i2xy(i))

		this.x = this.blocks.reduce((acc, c, i) => {
			var {x,y} = i2xy(i)
			acc[x][y] = c
			return acc
		}, Array.apply(null, Array(this.width)).map(() => []))

		this.y = this.blocks.reduce((acc, c, i) => {
			var {x,y} = i2xy(i)
			acc[y][x] = c
			return acc
		}, Array.apply(null, Array(this.height)).map(() => []))

		this.randomiseBloks()
	}

	randomiseBloks() {
		this.blocks.map(b => b.link = new AirBlock(b))


		var lvl = ~~(Math.random() * 20) + 5
		this.x.filter(c => {
			lvl += ~~(Math.random() * 5 - 2.5)

			lvl = lvl > 0? lvl < this.height? lvl : this.height : 0
			let top = c[lvl]
			top.link = new GrassBlock(top)
		})

		const putDirtUnderGrass = () => {
			this.x.map(c => c.reverse().reduce((e,b) => {
				if (e) {
					b.link = new EarthBlock(b)
				}
				return e || b.link instanceof GrassBlock
			}, false))
		}

		putDirtUnderGrass()

	}

	draw() {
		this.blocks.map((b) => b.link.draw())
	}
}

class Block {
	constructor({x, y}) {
		this.x = x
		this.y = y

		this.px = pointToPx(this.x)
		this.py = canvas.height - pointToPx(this.y)

		this.fillStyle = "black"
	}

	drawSqure() {
		ctx.beginPath();
		ctx.rect(this.px, this.py, BLOCK_SIZE, BLOCK_SIZE);
		ctx.fillStyle = this.fillStyle;
		ctx.fill();
		ctx.closePath();
	}

	draw() {
		this.drawSqure()
	}
}

class AirBlock extends Block {
	constructor(args) {
		super(args)
		this.fillStyle = "blue";
	}
}

class ImgBlock extends Block {
	drawSqure() {
		ctx.drawImage(this.fillStyle, this.px, this.py, BLOCK_SIZE, BLOCK_SIZE);
	}
}

class EarthBlock extends ImgBlock {
	constructor(args) {
		super(args)
		this.fillStyle = TEXTURES.earth;
	}
}

class GrassBlock extends ImgBlock {
	constructor(args) {
		super(args)
		this.fillStyle = TEXTURES.grass;
	}
}

var world = new Grid()

window.requestAnimationFrame(() => world.draw())