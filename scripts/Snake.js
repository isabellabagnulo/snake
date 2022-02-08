// serpentello

export default class Snake {
  constructor(direction) {
    this.entity = "Snake"
    this.color = "#991199"
    this.segments = []
    this.direction = direction
  }

  createSegments(minX, minY, maxX, maxY) {
    console.log(this.direction)
    switch (this.direction) {
      case "left":
        for (let i = minX; i <= maxX; i++) {
          this.segments.push({ x: i, y: minY })
        }
        break
      case "right":
        for (let i = maxX; i >= minX; i--) {
          this.segments.push({ x: i, y: minY })
        }
        break
      case "up":
        for (let i = minY; i <= maxY; i++) {
          this.segments.push({ x: minX, y: i })
        }
        break
      case "down":
        for (let i = maxY; i >= minY; i--) {
          this.segments.push({ x: minX, y: i })
        }
        break
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
