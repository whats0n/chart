import { resolveDeviceRatio } from '../utilities/resolveDeviceRatio'
import { isParameterPoints } from '../type-guards/isParameterPoint'
import { PointData } from '../types/parameters'
import { Dependencies } from '../types/common'

export interface MathViewBox {
  padding: {
    top: number
    right: number
    bottom: number
    left: number
  }
  width: number
  height: number
}

export interface MathPoint {
  position: Record<'x' | 'y', number>
  value: PointData | number
}

export class LineChartMath {
  #canvas: HTMLCanvasElement

  #dependencies: Dependencies

  #viewBox: MathViewBox

  #paths: MathPoint[][]

  get #width(): number {
    return this.#canvas.width
  }

  get #height(): number {
    return this.#canvas.height
  }

  constructor(canvas: HTMLCanvasElement, dependencies: Dependencies) {
    this.#canvas = canvas
    this.#dependencies = dependencies
    this.#viewBox = this.calculateViewBox()
    this.#paths = this.calculatePaths()
  }

  private calculateViewBox = (): MathViewBox => {
    const size = this.#dependencies.parameters.getSize()

    const padding = {
      top: this.calculatePaddingBy(this.#height, size.padding.top),
      right: this.calculatePaddingBy(this.#width, size.padding.right),
      bottom: this.calculatePaddingBy(this.#height, size.padding.bottom),
      left: this.calculatePaddingBy(this.#width, size.padding.left),
    }

    return {
      padding,
      width: this.#width - padding.left - padding.right,
      height: this.#height - padding.top - padding.bottom,
    }
  }

  private calculatePaddingBy = (
    size: number,
    padding?: string | number
  ): number => {
    if (!padding) return 0

    const isString = typeof padding === 'string'

    if (isString && padding.length > 1 && padding.endsWith('%')) {
      const value = parseFloat(padding)

      if (isNaN(value)) return 0

      const percent = size / 100

      return value * Math.max(Math.min(percent, 100), 0)
    }

    if (isString) {
      const value = parseFloat(padding)

      return isNaN(value) ? 0 : resolveDeviceRatio.increment(value)
    }

    return isNaN(padding) || !isFinite(padding)
      ? 0
      : resolveDeviceRatio.increment(Math.max(0, padding))
  }

  private calculatePath = (data: PointData[] | number[]): MathPoint[] => {
    const meta = this.#dependencies.parameters.getMeta()

    const getY = (y: number): number =>
      this.#viewBox.padding.top +
      ((meta.highest.y - y) / meta.highest.y) * this.#viewBox.height

    const highestX = meta.highest.x || 100

    return isParameterPoints(data)
      ? data
          .sort((prev, next) => prev.x - next.x)
          .map<MathPoint>((point) => ({
            position: {
              x:
                this.#viewBox.padding.left +
                (point.x / highestX) * this.#viewBox.width,
              y: getY(point.y),
            },
            value: point,
          }))
      : data.map<MathPoint>((y, i) => ({
          position: {
            x:
              this.#viewBox.padding.left +
              (this.#viewBox.width / (data.length - 1)) * i,
            y: getY(y),
          },
          value: y,
        }))
  }

  private calculatePaths = (): MathPoint[][] =>
    this.#dependencies.parameters
      .getData()
      .map((dataset) => this.calculatePath(dataset.data))

  public getViewBox = (): MathViewBox => this.#viewBox

  public getPaths = (): MathPoint[][] => this.#paths

  public reCalculate = (): this => {
    this.#viewBox = this.calculateViewBox()
    this.#paths = this.calculatePaths()
    return this
  }
}
