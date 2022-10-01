import { PointData } from '../../../types/parameters'
import { PointStyle } from '../../../types/styles'
import { resolveDeviceRatio } from '../../../utilities/resolveDeviceRatio'
import { LayerPoints } from '../layers/points'

export class ShapePoint {
  public static isShapePoint = (point: unknown): point is ShapePoint =>
    point instanceof ShapePoint

  #style: PointStyle

  #canvas: HTMLCanvasElement

  #coordinates = { x: 0, y: 0 }

  #path = new Path2D()

  #value: PointData | number

  #parent: LayerPoints

  private get context(): CanvasRenderingContext2D {
    return this.#canvas.getContext('2d') as CanvasRenderingContext2D
  }

  private get position(): { top: number; left: number } {
    const rect = this.#canvas.getBoundingClientRect()

    const top = rect.top + resolveDeviceRatio.decrement(this.#coordinates.y)
    const left = rect.left + resolveDeviceRatio.decrement(this.#coordinates.x)

    return { top, left }
  }

  constructor(
    canvas: HTMLCanvasElement,
    parameters: {
      parent: LayerPoints
      value: PointData | number
      style: PointStyle
    }
  ) {
    this.#canvas = canvas
    this.#style = parameters.style
    this.#value = parameters.value
    this.#parent = parameters.parent
  }

  public isInShape = (x: number, y: number): boolean => {
    const { top, left } = this.#canvas.getBoundingClientRect()

    x = resolveDeviceRatio.increment(x - left)
    y = resolveDeviceRatio.increment(y - top)

    return (
      this.context.isPointInPath(this.#path, x, y) ||
      this.context.isPointInStroke(this.#path, x, y)
    )
  }

  public getParent = (): LayerPoints => this.#parent

  public setCoordinates = (x: number, y: number): this => {
    this.#coordinates.x = x
    this.#coordinates.y = y
    return this
  }

  public getCoordinates = (): { x: number; y: number } => {
    return this.#coordinates
  }

  public getPosition = (): { top: number; left: number } => {
    return this.position
  }

  public getValue = (): PointData | number => {
    return this.#value
  }

  public setValue = (value: PointData | number): this => {
    this.#value = value
    return this
  }

  public draw = (x?: number, y?: number): this => {
    if (!this.#style.size) return this

    this.context.beginPath()

    this.context.fillStyle = this.#style.fillStyle

    this.context.lineWidth = resolveDeviceRatio.increment(this.#style.lineWidth)

    this.context.strokeStyle = this.#style.strokeStyle

    this.context.shadowOffsetX = resolveDeviceRatio.increment(
      this.#style.shadowOffsetX
    )

    this.context.shadowOffsetY = resolveDeviceRatio.increment(
      this.#style.shadowOffsetY
    )

    this.context.shadowBlur = resolveDeviceRatio.increment(
      this.#style.shadowBlur
    )

    this.context.shadowColor = this.#style.shadowColor

    this.#path = new Path2D()

    this.#path.arc(
      x ?? this.#coordinates.x,
      y ?? this.#coordinates.y,
      resolveDeviceRatio.increment(this.#style.size) / 2,
      0,
      Math.PI * 2,
      true
    )

    if (resolveDeviceRatio.increment(this.#style.lineWidth))
      this.context.stroke(this.#path)

    this.context.fill(this.#path)

    return this
  }
}
