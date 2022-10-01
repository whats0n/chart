import { Dependencies } from '../../../types/common'
import { AnimationType } from '../../../types/parameters'
import { PointStyle } from '../../../types/styles'
import { MathPoint } from '../../math'
import { Motion } from '../../motion'
import { BaseLayer } from '../BaseLayer'
import { ShapePoint } from '../shapes/point'

export type LayerPointsParameters = Partial<
  Record<'hover' | 'selected', PointStyle>
>

export class LayerPoints extends BaseLayer {
  #index: number

  #points: ShapePoint[] = []

  constructor(
    canvas: HTMLCanvasElement,
    dependencies: Dependencies,
    index: number
  ) {
    super(canvas, dependencies)
    this.#index = index
  }

  public set = (points: MathPoint[]): this => {
    this.#points = points.map(({ position: { x, y }, value }) =>
      new ShapePoint(this.canvas, {
        value,
        style: this.dependencies.parameters.getPointStyle(this.#index, 'point'),
        parent: this,
      })
        .setValue(value)
        .setCoordinates(x, y)
    )

    return this
  }

  public getParameters = (): LayerPointsParameters => ({
    hover: this.dependencies.parameters.getPointStyle(
      this.#index,
      'pointHover'
    ),
    selected: this.dependencies.parameters.getPointStyle(
      this.#index,
      'pointSelected'
    ),
  })

  public draw = (progress: number): this => {
    const animationType = this.dependencies.parameters.getAnimation().type

    this.clear()

    this.context.globalAlpha = progress

    this.#points.forEach((point) => {
      const { x, y } = point.getCoordinates()

      if (animationType === AnimationType.GROW_Y) {
        point.draw(x, Motion.growY(y, this.height, progress))
      } else if (animationType === AnimationType.TRANSLATE_Y) {
        point.draw(x, Motion.translateY(y, this.height, progress))
      } else {
        point.draw()
      }
    })

    this.context.globalAlpha = 1

    return this
  }

  public over = (x: number, y: number): ShapePoint | null =>
    this.#points.find((point) => point.isInShape(x, y)) || null
}
