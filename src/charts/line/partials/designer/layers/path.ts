import { Dependencies } from '../../../types/common'
import { AnimationType } from '../../../types/parameters'
import { PathStyle } from '../../../types/styles'
import { resolveDeviceRatio } from '../../../utilities/resolveDeviceRatio'
import { MathPoint } from '../../math'
import { Motion } from '../../motion'
import { BaseLayer } from '../BaseLayer'

export class LayerPath extends BaseLayer {
  #points: MathPoint[] = []

  #index: number

  get #style(): PathStyle {
    return this.dependencies.parameters.getPathStyle(this.#index)
  }

  constructor(
    canvas: HTMLCanvasElement,
    dependencies: Dependencies,
    index: number
  ) {
    super(canvas, dependencies)
    this.#index = index
  }

  public set = (points: MathPoint[]): this => {
    this.#points = points
    return this
  }

  public draw = (progress: number): this => {
    this.clear()

    if (!this.#style.fillStyle && !this.#style.strokeStyle) return this

    this.context.save()

    this.context.beginPath()

    this.drawStyles().drawFill(progress).drawStroke(progress)

    this.context.closePath()

    if (progress !== 1) this.context.restore()

    return this
  }

  private drawStyles = (): this => {
    this.context.fillStyle = this.#style.fillStyle

    this.context.strokeStyle = this.#style.strokeStyle

    this.context.lineCap = this.#style.lineCap

    this.context.lineJoin = this.#style.lineJoin

    this.context.lineWidth = resolveDeviceRatio.increment(this.#style.lineWidth)

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
    return this
  }

  private drawFill = (progress: number): this => {
    this.context.beginPath()

    const meta = this.dependencies.parameters.getMeta()

    const animationType = this.dependencies.parameters.getAnimation().type

    if (!meta.withStartPoint) {
      this.context.moveTo(
        this.#points[0].position.x,
        animationType === AnimationType.TRANSLATE_Y
          ? Motion.translateY(this.height, this.height, progress)
          : this.height
      )
    }

    this.drawPath(progress)

    if (!meta.withFinishPoint) {
      this.context.lineTo(
        this.#points[this.#points.length - 1].position.x,
        animationType === AnimationType.TRANSLATE_Y
          ? Motion.translateY(this.height, this.height, progress)
          : this.height
      )
    }

    this.context.fill()
    return this
  }

  private drawStroke = (progress: number): this => {
    if (!this.#style.lineWidth) return this

    this.context.beginPath()
    this.drawPath(progress)
    this.context.stroke()
    this.context.closePath()
    return this
  }

  private drawPath = (progress: number): this => {
    const meta = this.dependencies.parameters.getMeta()

    const animationType = this.dependencies.parameters.getAnimation().type

    if (meta.withStartPoint) {
      this.context.moveTo(
        0,
        animationType === AnimationType.TRANSLATE_Y
          ? Motion.translateY(this.height, this.height, progress)
          : this.height
      )
    }

    if (animationType === AnimationType.CROP_X) {
      const square = new Path2D()

      square.rect(0, 0, this.width * progress, this.height)

      this.context.clip(square)

      this.#points.forEach(({ position: { x, y } }) => {
        this.context.lineTo(x, y)
      })
    } else {
      this.#points.forEach(({ position: { x, y } }) => {
        this.context.lineTo(
          x,
          animationType === AnimationType.GROW_Y
            ? Motion.growY(y, this.height, progress)
            : animationType === AnimationType.TRANSLATE_Y
            ? Motion.translateY(y, this.height, progress)
            : y
        )
      })
    }

    if (meta.withFinishPoint) {
      this.context.lineTo(
        this.width,
        animationType === AnimationType.TRANSLATE_Y
          ? Motion.translateY(this.height, this.height, progress)
          : this.height
      )
    }

    return this
  }
}
