/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function setup () {
  createCanvas(600, 600)
  background(0)
  N_CITIES = 20
  cities = []
  for (let i = 0; i < N_CITIES; i++) {
    cities.push(new City(random(50, width - 50), random(50, height - 50), i))
  }
  bestRoute = new Route()
}

function draw () {
  background(0)
  noStroke()
  bestRoute.display()
  cities.forEach((city) => city.display())

  for (let i = 2; i < 6; i++) {
    mutated = bestRoute.mutated(i)
    if (mutated.distance() < bestRoute.distance()) {
      bestRoute = mutated
    }
  }
}

class City {
  constructor (x, y, id) {
    this.x = x
    this.y = y
    this.id = id
  }

  display () {
    noStroke()
    fill(0, 255, 255)
    ellipse(this.x, this.y, 10, 10)
    textSize(20)
    text(this.id, this.x - 10, this.y - 10)
    noFill()
  }
}

class Route {
  constructor () {
    this.cityNums = _.sampleSize(_.range(N_CITIES), N_CITIES)
  }

  display () {
    strokeWeight(3)
    stroke(255, 0, 255)
    beginShape()
    this.cityNums.forEach((cityNum) => {
      vertex(cities[cityNum].x, cities[cityNum].y)
    })
    endShape(CLOSE)
  }

  distance () {
    let distance = 0
    this.cityNums.forEach((num, i, array) => {
      const before = (i === 0) ? (N_CITIES - 1) : (i - 1)
      distance += dist(
        cities[num].x,
        cities[num].y,
        cities[array[before]].x,
        cities[array[before]].y
      )
    })
    return distance
  }

  mutated (num) {
    const indexes = _.sampleSize(_.range(N_CITIES), num)
    const mutated = new Route()
    mutated.cityNums = this.cityNums.concat()
    for (let i = 0; i < num - 1; i++) {
      [
        mutated.cityNums[indexes[i]],
        mutated.cityNums[indexes[(i + 1) % num]]
      ] = [
        mutated.cityNums[indexes[(i + 1) % num]],
        mutated.cityNums[indexes[i]]
      ]
    }
    return mutated
  }
}
