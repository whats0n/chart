import { BaseLayer } from '../BaseLayer'

export class LayerBackground extends BaseLayer {
  public draw = (progress: number): this => {
    this.clear()

    const background = this.dependencies.parameters.getStyle('background')

    if (!background || background === 'transparent') return this

    const square = new Path2D()

    square.rect(0, 0, this.width, this.height)

    this.context.beginPath()

    this.context.globalAlpha = progress

    this.context.fillStyle = background

    this.context.fill(square)

    this.context.closePath()

    return this
  }
}
