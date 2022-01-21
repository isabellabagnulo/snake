// serpentello

export default class Snake {
  constructor() {
    this.entity = "Snake"
    this.color = "#fff"
    this.segments = []
    this.direction = null
  }

  createSegments(headX, headY, tailX, tailY) {
    console.log(headX, headY, tailX, tailY)
  }
}
