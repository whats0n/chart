import { Dependencies } from '../../types/common'

export abstract class BaseLayer {
  public canvas: HTMLCanvasElement

  public dependencies: Dependencies

  public get context(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d') as CanvasRenderingContext2D
  }

  public get width(): number {
    return this.canvas.width
  }

  public get height(): number {
    return this.canvas.height
  }

  constructor(canvas: HTMLCanvasElement, dependencies: Dependencies) {
    this.canvas = canvas
    this.dependencies = dependencies
  }

  public clear = (): this => {
    this.context.clearRect(0, 0, this.width, this.height)
    return this
  }
}
