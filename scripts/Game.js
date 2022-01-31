import Food from "./Food.js"
import Snake from "./Snake.js"

const getRandomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min)) + min
}

export default class Game {
  constructor() {
    this.entity = "Game"
    this.playing = false

    const canvas = document.querySelector("#game")
    this.context = canvas.getContext("2d") //dire quale tecnologia usare per disegnare sul canvas, quindi contesto 2d

    this.cellSize = 30
    // this.height = 30

    this.cellCount = Math.floor(canvas.width / this.cellSize) // sappiamo di avere una griglia di 18 colonne e 18 righe
    this.generateGrid()

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
  }

  //  metodo per creare nuovo cibo ogni volta che il serpente ne mangia uno
  spawnFood() {
    const randomX = getRandomNumber(0, this.cellCount - 1)
    const randomY = getRandomNumber(0, this.cellCount - 1)

    this.food = new Food(randomX, randomY, "#000")
    this.renderFood()
  }

  renderFood() {
    this.context.fillStyle = this.food.color
    const posX = this.food.x * this.cellSize
    const posY = this.food.y * this.cellSize
    this.context.fillRect(posX, posY, this.cellSize, this.cellSize)
  }

  spawnSnake() {
    const initialLength = 6

    const headX = getRandomNumber(0, this.cellCount - 1)
    const headY = getRandomNumber(0, this.cellCount - 1)
    const tailX = headX + (initialLength - 1)
    const tailY = headY + (initialLength - 1)

    // console.log("HEAD:", headX, headY, "TAIL:", tailX, tailY)

    this.snake = new Snake()
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

  generateGrid() {
    this.context.fillStyle = "#2E4539"
    this.context.fillRect(0, 0, 540, 540)
    this.context.strokeStyle = "#EA6521"
    for (let row = 0; row < this.cellCount; row++) {
      this.context.beginPath() // inizio a disegnare il path
      this.context.moveTo(0, row * this.cellSize) // mi sposto in un punto
      this.context.lineTo(540, row * this.cellSize)
      this.context.stroke()
    }

    this.context.strokeStyle = "#EA6521"
    for (let column = 0; column < this.cellCount; column++) {
      this.context.beginPath() // inizio a disegnare il path
      this.context.moveTo(column * this.cellSize, 0) // mi sposto in un punto
      this.context.lineTo(column * this.cellSize, 540)
      this.context.stroke()
    }
  }

  play() {
    this.playing = true
    this.spawnFood()
    this.spawnSnake()

    this.speed = 200
    this.updateAttachedToContext = this.update.bind(this)
    this.interval = this.createInterval()
  }

  createInterval() {
    window.clearInterval(this.interval)
    return window.setInterval(this.updateAttachedToContext, this.speed)
  }

  update() {
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

    this.renderAnimation()
  }

  endGame() {
    clearInterval(this.interval)
    this.context.clearRect(0, 0, 540, 540)
    this.generateGrid()
  }

  renderAnimation() {
    this.context.clearRect(0, 0, 540, 540)
    this.generateGrid()
    this.renderSnake()
    this.renderFood()
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
