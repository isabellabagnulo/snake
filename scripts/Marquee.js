export default class Marquee {
  constructor(context, options) {
    this.entity = "marquee"
    this.context = context
    this.opts = Object.assign({}, this.getDefaultOptions(), options)

    this.init()
    this.animate()
  }

  getDefaultOptions() {
    return {
      text: "Welcome to snake",
      color: "#ff00ff",
      speed: "2",
      padding: 20,
    }
  }

  init() {
    this.context.fillStyle = this.opts.color
    this.context.font = "3rem Arial"

    this.textSize = this.context.measureText(this.opts.text).width

    this.duplicator = Math.ceil(this.context.canvas.width / this.textSize) + 1
    this.positionX = []
    for (let i = 0; i < this.duplicator; i++) {
      this.positionX.push({ x: this.textSize * i + this.opts.padding * i })
    }
  }

  animate() {
    this.context.fillStyle = this.opts.color

    this.positionX.forEach((position, i) => {
      if (this.textSize + position.x < 0) {
        position.x =
          this.textSize * (this.duplicator - 1) +
          this.opts.padding * this.duplicator
      } else {
        position.x -= this.opts.speed
      }
    })

    for (let i = 0; i < this.duplicator; i++) {
      this.context.fillText(
        this.opts.text,
        this.positionX[i].x,
        this.context.canvas.height / 2
      )
    }
  }

  updateText(testo) {
    this.opts.text = testo
    this.init()
  }
}
