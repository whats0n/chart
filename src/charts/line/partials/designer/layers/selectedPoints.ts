import { PointStyle } from '../../../types/styles'
import { resolveDeviceRatio } from '../../../utilities/resolveDeviceRatio'
import { BaseLayer } from '../BaseLayer'

type Points = 'hovered' | 'selected'

export class LayerSelectedPoints extends BaseLayer {
  public draw = (
    coordinates: Partial<Record<Points, { x: number; y: number }>>,
    style: Partial<Record<Points, PointStyle>>
  ): this => {
    this.clear()

    if (coordinates.selected && style.selected)
      this.drawPoint(coordinates.selected, style.selected)

    if (coordinates.hovered && style.hovered)
      this.drawPoint(coordinates.hovered, style.hovered)

    return this
  }

  private drawPoint = (
    coordinates: { x: number; y: number },
    style: PointStyle
  ): this => {
    if (!coordinates || !style?.size) return this

    this.context.beginPath()

    this.context.fillStyle = style.fillStyle

    this.context.lineWidth = resolveDeviceRatio.increment(style.lineWidth)

    this.context.strokeStyle = style.strokeStyle

    this.context.shadowOffsetX = resolveDeviceRatio.increment(
      style.shadowOffsetX
    )

    this.context.shadowOffsetY = resolveDeviceRatio.increment(
      style.shadowOffsetY
    )

    this.context.shadowBlur = resolveDeviceRatio.increment(style.shadowBlur)

    this.context.shadowColor = style.shadowColor

    this.context.arc(
      coordinates.x,
      coordinates.y,
      resolveDeviceRatio.increment(style.size) / 2,
      0,
      Math.PI * 2,
      true
    )

    if (resolveDeviceRatio.increment(style.lineWidth)) this.context.stroke()

    this.context.fill()

    return this
  }
}
