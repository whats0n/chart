import { resolveDeviceRatio } from '../../../utilities/resolveDeviceRatio'
import { BaseLayer } from '../BaseLayer'

export class LayerGrid extends BaseLayer {
  public draw = (progress: number): this => {
    this.clear()

    const style = this.dependencies.parameters.getStyle('grid')

    if (!style.lineWidth || !style.gap || !style.strokeStyle) return this

    this.context.globalAlpha = progress

    const square = new Path2D()

    const gap = resolveDeviceRatio.increment(style.gap)

    this.context.strokeStyle = style.strokeStyle

    this.context.lineWidth = resolveDeviceRatio.increment(style.lineWidth)

    for (let y = gap; y < this.height; y += gap) {
      square.moveTo(0, y)
      square.lineTo(this.width, y)
    }

    for (let x = gap; x < this.width; x += gap) {
      square.moveTo(x, 0)
      square.lineTo(x, this.height)
    }

    square.closePath()

    if (resolveDeviceRatio.increment(style.lineWidth))
      this.context.stroke(square)

    return this
  }
}
