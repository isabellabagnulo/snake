// serpentello

export default class Snake {
  constructor() {
    this.entity = "Snake"
    this.color = "#991199"
    this.segments = []
    this.direction = "left"
  }

  createSegments(minX, minY, maxX, maxY) {
    for (let i = minX; i <= maxX; i++) {
      this.segments.push({ x: i, y: minY })
    }
  }

  setDirection(dir) {
    if (dir === "left" || dir === "down" || dir === "right" || dir === "up") {
      this.direction = dir
    }
  }

  move(head, hasEaten) {
    if (!hasEaten) {
      this.segments.pop()
    }
    this.segments.unshift(head)
  }
}
