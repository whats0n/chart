import { Designer } from './partials/designer'
import { LineChartMath } from './partials/math'
import { Architect } from './partials/architect'
import { Motion } from './partials/motion'
import { Emitter } from './partials/emitter'
import { Dataset, Parameters } from './types/parameters'
import { ParametersStore } from './partials/parameters'
import { Dependencies } from './types/common'

export class LineChart {
  #parameters: ParametersStore

  #architect: Architect

  #designer: Designer

  #math: LineChartMath

  #progress = 0

  #canvas: Record<'background' | 'grid' | 'selectedPoints', HTMLCanvasElement> &
    Record<'paths' | 'points', HTMLCanvasElement[]>

  get #data(): Dataset[] {
    return this.#parameters.getData()
  }

  public emitter = new Emitter()

  static animationTimingFunction = Motion.timingFunction

  constructor(el: HTMLElement, parameters: Parameters) {
    this.#parameters = new ParametersStore(parameters)

    const dependencies: Dependencies = {
      emitter: this.emitter,
      parameters: this.#parameters,
    }

    this.#architect = new Architect(
      el,
      { onResize: this.onResize },
      dependencies
    )

    this.#canvas = {
      background: this.#architect.createCanvas(),
      points: this.#data.map(this.#architect.createCanvas),
      grid: this.#architect.createCanvas(),
      paths: this.#data.map(this.#architect.createCanvas),
      selectedPoints: this.#architect.createCanvas(),
    }

    this.#math = new LineChartMath(this.#canvas.background, dependencies)

    this.#architect.appendDOM(this.#canvas.background)

    this.#data.forEach((_, i) => {
      this.#architect.appendDOM(this.#canvas.paths[i])
      this.#architect.appendDOM(this.#canvas.points[i])
    })

    this.#architect.appendDOM(this.#canvas.grid)
    this.#architect.appendDOM(this.#canvas.selectedPoints)

    this.#designer = new Designer(this.#canvas, dependencies)

    this.#math.getPaths().forEach((path, i) => {
      this.#designer.layers.points[i].set(path)
      this.#designer.layers.paths[i].set(path)
    })

    document.addEventListener('mousemove', (e) => {
      if (this.#progress === 1) this.#designer.over(e.clientX, e.clientY)
    })

    document.addEventListener('click', (e) => {
      if (this.#progress === 1) this.#designer.select(e.clientX, e.clientY)
    })

    this.animate()
  }

  private draw = (progress: number): void => {
    this.#progress = progress

    this.#designer
      .clear()
      .drawBackground(progress * 2)
      .drawPath(progress)
      .drawPoints(progress)
      .drawGrid(progress * 2)
  }

  private animate = (): void => {
    const animation = this.#parameters.getAnimation()

    if (!animation.duration) {
      this.draw(1)
      return
    }

    Motion.animate({
      timingFunction: animation.timingFunction || Motion.timingFunction.linear,
      onUpdate: this.draw,
      onComplete: () => this.draw(1),
      duration: animation.duration,
    })
  }

  private onResize = (options: { width: number; height: number }): void => {
    Object.values(this.#canvas).forEach((canvas) => {
      if (Array.isArray(canvas)) {
        canvas.forEach((canvas) => {
          canvas.width = options.width
          canvas.height = options.height
        })
      } else {
        canvas.width = options.width
        canvas.height = options.height
      }
    })

    this.#math.reCalculate()

    this.#math.getPaths().forEach((path, i) => {
      this.#designer.layers.paths[i].set(path)
      this.#designer.layers.points[i].set(path)
    })

    this.draw(this.#progress)
  }

  public play = (): void => this.animate()

  public display = (): void => this.draw(1)

  public setParameters = (parameters: Omit<Parameters, 'datasets'>): this => {
    this.#parameters.set(parameters)

    this.#architect.reCalculate()
    this.#math.reCalculate()

    this.#math.getPaths().forEach((path, i) => {
      this.#designer.layers.paths[i].set(path)
      this.#designer.layers.points[i].set(path)
    })

    this.draw(this.#progress)

    return this
  }

  public updateParameters = (
    parameters: Omit<Parameters, 'datasets'>
  ): this => {
    this.#parameters.update(parameters)

    this.#architect.reCalculate()
    this.#math.reCalculate()

    this.#math.getPaths().forEach((path, i) => {
      this.#designer.layers.paths[i].set(path)
      this.#designer.layers.points[i].set(path)
    })

    this.draw(this.#progress)

    return this
  }

  public setDatasets = (datasets: Dataset[]): this => {
    this.#parameters.setData(datasets)
    return this
  }
}
