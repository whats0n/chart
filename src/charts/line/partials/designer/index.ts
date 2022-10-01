import { Dependencies } from '../../types/common'
import { Parameters } from '../../types/parameters'
import { LayerBackground } from './layers/background'
import { LayerGrid } from './layers/grid'
import { LayerPath } from './layers/path'
import { LayerPoints } from './layers/points'
import { LayerSelectedPoints } from './layers/selectedPoints'
import { ShapePoint } from './shapes/point'

type SelectedPoints = Record<'hovered' | 'selected', ShapePoint | null>

export type DesignerParameters = Pick<
  Parameters,
  'style' | 'animation' | 'datasets' | 'withStartPoint' | 'withFinishPoint'
>

export class Designer {
  public layers: {
    background: LayerBackground
    paths: LayerPath[]
    points: LayerPoints[]
    grid: LayerGrid
    selectedPoints: LayerSelectedPoints
  }

  #dependencies: Dependencies

  #selectedPoints: SelectedPoints = {
    hovered: null,
    selected: null,
  }

  constructor(
    canvasLayers: Record<
      'background' | 'grid' | 'selectedPoints',
      HTMLCanvasElement
    > &
      Record<'paths' | 'points', HTMLCanvasElement[]>,
    dependencies: Dependencies
  ) {
    this.#dependencies = dependencies

    this.layers = {
      background: new LayerBackground(canvasLayers.background, dependencies),
      paths: canvasLayers.paths.map(
        (canvas, i) => new LayerPath(canvas, dependencies, i)
      ),
      points: canvasLayers.points.map(
        (canvas, i) => new LayerPoints(canvas, dependencies, i)
      ),
      grid: new LayerGrid(canvasLayers.grid, dependencies),
      selectedPoints: new LayerSelectedPoints(
        canvasLayers.selectedPoints,
        dependencies
      ),
    }
  }

  private drawSelectedPoints = (): this => {
    this.layers.selectedPoints.draw(
      {
        selected: this.#selectedPoints.selected?.getCoordinates(),
        hovered:
          this.#selectedPoints.selected !== this.#selectedPoints.hovered
            ? this.#selectedPoints.hovered?.getCoordinates()
            : undefined,
      },
      {
        selected: this.#selectedPoints.selected?.getParent().getParameters()
          ?.selected,
        hovered: this.#selectedPoints.hovered?.getParent().getParameters()
          .hover,
      }
    )

    return this
  }

  public setSelectedPoints = (
    state: keyof SelectedPoints,
    x: number,
    y: number
  ): this => {
    const prev = this.#selectedPoints[state]

    const next =
      this.layers.points
        .map((points) => points.over(x, y))
        .filter(ShapePoint.isShapePoint)
        .pop() || null

    if (prev === next) return this

    if (prev)
      this.#dependencies.emitter.emit(
        state === 'hovered' ? 'pointLeave' : 'pointUnselect',
        {
          position: prev.getPosition(),
          value: prev.getValue(),
        }
      )

    if (next)
      this.#dependencies.emitter.emit(
        state === 'hovered' ? 'pointEnter' : 'pointSelect',
        {
          position: next.getPosition(),
          value: next.getValue(),
        }
      )

    this.#selectedPoints[state] = next

    this.drawSelectedPoints()

    return this
  }

  public clear = (): this => {
    return this
  }

  public drawBackground = (progress: number): this => {
    this.layers.background.draw(progress)
    return this
  }

  public drawGrid = (progress: number): this => {
    this.layers.grid.draw(progress)
    return this
  }

  public drawPath = (progress: number): this => {
    this.layers.paths.forEach((path) => path.draw(progress))
    return this
  }

  public drawPoints = (progress: number): this => {
    this.layers.points.forEach((points) => points.draw(progress))
    return this
  }

  public over = (x: number, y: number): this =>
    this.setSelectedPoints('hovered', x, y)

  public select = (x: number, y: number): this =>
    this.setSelectedPoints('selected', x, y)
}
