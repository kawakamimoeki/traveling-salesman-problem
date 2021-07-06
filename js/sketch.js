/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function setup () {
  createCanvas(windowWidth, windowHeight)
  background(0)
  N_CITIES = 100
  POP_N = 1000
  cities = []
  population = []
  evolutaion = 1
  for (let i = 0; i < N_CITIES; i++) {
    cities.push(new City(random(100, width - 100), random(100, height - 100), i))
  }
  for (let i = 0; i < POP_N; i++) {
    population.push(new Route())
  }
  bestRoute = _.sample(population)
}

function draw () {
  background(0)
  noStroke()
  bestRoute.display()
  cities.forEach((city) => city.display())
  fill(255)
  text(`Evolutaion: ${evolutaion}`, 30, 40)
  text(`Distance: ${parseInt(bestRoute.distance())}`, 30, 70)
  noFill()

  population = _.sortBy(population, [(p) => p.distance()])
  population = population.slice(0, POP_N)

  if (population[0].distance() < bestRoute.distance()) {
    bestRoute = population[0]
  }

  for (let i = 0; i < POP_N; i++) {
    const [mother, father] = _.sampleSize(population, 2)
    const child = Route.crossover(mother, father)
    population.push(child)
  }

  evolutaion++
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

  static crossover (mother, father) {
    const child = new Route()
    const index = _.random(1, N_CITIES - 2)
    child.cityNums = mother.cityNums.concat().slice(0, index)
    if (_.random(1, true) < 0.5) {
      child.cityNums = child.cityNums.reverse()
    }
    const nonslice = _.filter(father.cityNums, (cityNum) => {
      return !child.cityNums.includes(cityNum)
    })
    child.cityNums = child.cityNums.concat(nonslice)
    return child
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
