import Food from "./Food.js"
import Snake from "./Snake.js"
import Marquee from "./Marquee.js"

export const getRandomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min)) + min
}

export default class Game {
  constructor(options) {
    this.entity = "Game"
    this.options = options

    this.speed = this.options.speed || 200

    this.playing = false

    const canvas = document.querySelector("#game")
    this.context = canvas.getContext("2d") //dire quale tecnologia usare per disegnare sul canvas, quindi contesto 2d

    this.cellSize = 30
    // this.height = 30

    this.cellCount = Math.floor(canvas.width / this.cellSize) // sappiamo di avere una griglia di 18 colonne e 18 righe
    this.resetCanvas()

    this.gameInputs = new Set([
      // Set è come un array ma con qualcosa in più
      "Space",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
    ])

    this.directions = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
    }
    this.initEventListeners()

    this.marquee = new Marquee(this.context, {
      text: "PLAY NOW!",
    })
    this.interval = this.createInterval()
    this.then = Date.now()
  }

  spawnFood() {
    let randomX = getRandomNumber(0, this.cellCount - 1)
    let randomY = getRandomNumber(0, this.cellCount - 1)

    // console.log("random", randomX, randomY)
    const isNotEmpty = this.snake.segments.some((segment) => {
      return segment.x === randomX && segment.y === randomY
    })

    if (isNotEmpty) {
      this.spawnFood()
      return false
    }
    // console.log("genero cibo", randomX, randomY)

    this.food = new Food(randomX, randomY, "#000")
    this.renderFood()
  }

  renderFood() {
    this.context.fillStyle = this.food.color
    const posX = this.food.x * this.cellSize
    const posY = this.food.y * this.cellSize

    // this.context.fillRect(posX, posY, this.cellSize, this.cellSize)

    this.context.drawImage(
      this.food.image,
      posX,
      posY,
      this.cellSize,
      this.cellSize
    )
  }

  spawnSnake() {
    const initialLength = 2

    const headX = getRandomNumber(0, this.cellCount - initialLength)
    const headY = getRandomNumber(0, this.cellCount - initialLength)
    const tailX = headX + (initialLength - 1)
    const tailY = headY + (initialLength - 1)

    // console.log("HEAD:", headX, headY, "TAIL:", tailX, tailY)

    const directions = ["up", "left", "down", "right"]
    const randomDirection = directions[getRandomNumber(0, 3)]
    this.snake = new Snake(randomDirection, this.options.colors.snake)
    this.snake.createSegments(headX, headY, tailX, tailY)

    this.renderSnake()
  }

  renderSnake() {
    this.snake.segments.forEach((segment, index) => {
      this.context.fillStyle = this.snake.color
      const posX = segment.x * this.cellSize
      const posY = segment.y * this.cellSize
      this.context.fillRect(posX, posY, this.cellSize, this.cellSize)
    })
  }

  resetCanvas() {
    this.context.fillStyle = this.options.colors.background
    this.context.fillRect(0, 0, 540, 540)
    this.context.strokeStyle = "#EA6521"
    for (let row = 0; row < this.cellCount; row++) {
      this.context.beginPath() // inizio a disegnare il path
      this.context.moveTo(0, row * this.cellSize) // mi sposto in un punto
      this.context.lineTo(540, row * this.cellSize)
      //   this.context.stroke()
    }

    this.context.strokeStyle = "#EA6521"
    for (let column = 0; column < this.cellCount; column++) {
      this.context.beginPath() // inizio a disegnare il path
      this.context.moveTo(column * this.cellSize, 0) // mi sposto in un punto
      this.context.lineTo(column * this.cellSize, 540)
      //   this.context.stroke()
    }
  }

  play() {
    this.playing = true
    this.spawnSnake()
    this.spawnFood()
  }

  createInterval() {
    window.cancelAnimationFrame(this.interval)
    this.updateAttachedToContext = this.update.bind(this)
    return window.requestAnimationFrame(this.updateAttachedToContext)
  }

  inGame() {
    this.now = Date.now()
    const delta = this.now - this.then
    const interval = 1000 / (5 * this.options.speed)

    if (delta > interval) {
      this.then = this.now - (delta % interval)
    } else {
      return
    }

    const head = { ...this.snake.segments[0] }
    const direction = this.snake.direction
    // console.log(head, direction)

    switch (direction) {
      case "left":
        // console.log(this.cellCount, head.x)
        if (head.x <= 0) {
          head.x = this.cellCount
        }
        head.x = head.x - 1
        break
      case "right":
        // console.log(this.cellCount, head.x)
        head.x = head.x + 1
        if (head.x >= this.cellCount) {
          head.x = 0
        }
        break
      case "up":
        if (head.y <= 0) {
          head.y = this.cellCount
        }
        head.y = head.y - 1
        break
      case "down":
        head.y = head.y + 1
        if (head.y >= this.cellCount) {
          head.y = 0
        }
        break
    }

    const hasEaten = head.x === this.food.x && head.y === this.food.y

    if (hasEaten) {
      // this.speed = this.speed - 50
      this.interval = this.createInterval()
      delete this.food
      this.spawnFood()
    }

    const tail = this.snake.segments.slice(1)
    const hasCollision = tail.some((segment) => {
      return head.x === segment.x && head.y === segment.y
    })

    if (hasCollision) {
      this.endGame()
      return false
    }

    this.snake.move(head, hasEaten)
  }

  update() {
    this.createInterval()
    // se non attacchiamo update al this, il contesto è undefined, per questo si usa bind, che forza update ad attaccarsi al contesto

    if (this.playing) {
      this.inGame()
    }

    this.context.clearRect(0, 0, 540, 540)
    this.resetCanvas()

    if (this.playing) {
      this.renderSnake()
      this.renderFood()
    } else {
      this.marquee.animate()
    }
  }

  endGame() {
    clearInterval(this.interval)
    this.playing = false
    // this.context.clearRect(0, 0, 540, 540)
    // this.resetCanvas()
    this.marquee.updateText("GAME OVER")
  }

  initEventListeners() {
    const handleInputs = (event) => {
      if (event.code === "Space") {
        this.play()
      }
      if (!this.playing) {
        return false
      }

      const direction = this.directions[event.code]
      // console.log(direction)
      this.snake.setDirection(direction)
    }

    document.addEventListener("keydown", handleInputs)
  }

  //   testCanvas() {
  //     // metto colore giallo
  //     this.context.fillStyle = "#fff000"
  //     // creo rettangolo che parte dalle posizioni x=0 e y=0 grande 540x540 px
  //     this.context.fillRect(0, 0, 540, 540) // (x, y, width, height)
  //     //metto colore nero
  //     this.context.fillStyle = "#ff99ff"
  //     this.context.fillRect(0, 0, 270, 270)
  //     // metto colore fucsia
  //     this.context.fillStyle = "#ff00ff"
  //     this.context.fillRect(270, 270, 270, 270)
  //   }
}
