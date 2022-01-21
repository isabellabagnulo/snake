import Food from "./Food.js"
import Snake from "./Snake.js"

const getRandomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min)) + min
}

export default class Game {
  constructor() {
    this.entity = "Game"

    const canvas = document.querySelector("#game")
    this.context = canvas.getContext("2d") //dire quale tecnologia usare per disegnare sul canvas, quindi contesto 2d
    this.context.fillRect(0, 0, 540, 540)

    this.cellSize = 30
    // this.height = 30

    this.cellCount = Math.floor(canvas.width / this.cellSize) // sappiamo di avere una griglia di 18 colonne e 18 righe
    this.generateGrid()

    const gameInputs = new Set([
      // Set è come un array ma con qualcosa in più
      "Space",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
    ])
  }

  //  metodo per creare nuovo cibo ogni volta che il serpente ne mangia uno
  spawnFood() {
    const randomX = getRandomNumber(0, this.cellCount - 1)
    const randomY = getRandomNumber(0, this.cellCount - 1)

    const cellX = randomX * this.cellSize
    const cellY = randomY * this.cellSize
    this.food = new Food(cellX, cellY, "#cfff04")
    this.renderFood()
  }

  renderFood() {
    this.context.fillStyle = this.food.color
    const posX = this.food.x
    const posY = this.food.y
    this.context.fillRect(posX, posY, this.cellSize, this.cellSize)
  }

  spawnSnake() {
    const initialLength = 3
    const headX = getRandomNumber(0, this.cellCount - 1) * this.cellSize
    const headY = getRandomNumber(0, this.cellCount - 1) * this.cellSize
    const tailX = headX + initialLength * this.cellSize
    const tailY = headY + initialLength * this.cellSize

    this.snake = new Snake()
    this.snake.createSegments(headX, headY, tailX, tailY)
    this.renderSnake()
  }

  renderSnake() {
    this.snake.segments.forEach((segment, index) => {
      this.context.fillStyle = this.snake.color
      const posX = segment.x
      const posY = segment.y
      this.context.fillRect(posX, posY, this.cellSize, this.cellSize)
    })
  }

  generateGrid() {
    this.context.strokeStyle = "#fff"
    for (let row = 0; row < this.cellCount; row++) {
      this.context.beginPath() // inizio a disegnare il path
      this.context.moveTo(0, row * this.cellSize) // mi sposto in un punto
      this.context.lineTo(540, row * this.cellSize)
      this.context.stroke()
    }

    this.context.strokeStyle = "#fff"
    for (let column = 0; column < this.cellCount; column++) {
      this.context.beginPath() // inizio a disegnare il path
      this.context.moveTo(column * this.cellSize, 0) // mi sposto in un punto
      this.context.lineTo(column * this.cellSize, 540)
      this.context.stroke()
    }
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
