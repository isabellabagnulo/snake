// pallino

// nel costruttore si inseriscono delle proprietà, a seguire tutti i metodi
// il costruttore è il metodo della classe che parte ogni volta che istanzio la classe
// i metodi invece vengono elencati, ma non partono fino a quando non vengono chiamati
// this è il contesto, quindi tutte le proprietà che metto dentro al this, sono proprietà che vengono aggiunge alla classe dentro la quale si trovano
import { getRandomNumber } from "./Game.js"

export default class Food {
  constructor(x, y, color) {
    this.entity = "Food"
    this.x = x
    this.y = y
    this.color = color

    // this.image = new Image()
    // this.image.src = "/images/beer.png"
    const images = [
      "/images/beer.png",
      "/images/chris.png",
      "/images/drink.png",
      "/images/gio.png",
    ]
    this.image = new Image()
    this.image.src = images[getRandomNumber(0, images.length - 1)]
  }

  logPosition() {
    console.log(this.x)
    console.log(this.y)
  }
}
