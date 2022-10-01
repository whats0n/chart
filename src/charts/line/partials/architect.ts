import { Dependencies } from '../types/common'
import { resolveDeviceRatio } from '../utilities/resolveDeviceRatio'

interface ArchitectListeners {
  onResize(options: { width: number; height: number }): void
}

export class Architect {
  #el: HTMLElement
  #box: HTMLElement

  #dependencies: Dependencies

  #listeners: ArchitectListeners

  constructor(
    el: HTMLElement,
    listeners: ArchitectListeners,
    dependencies: Dependencies
  ) {
    this.#el = el
    this.#dependencies = dependencies
    this.#listeners = listeners

    this.#box = this.prepareDOM()
    this.observeResize()
  }

  private prepareDOM = (): HTMLElement => {
    const size = this.#dependencies.parameters.getSize()

    const box = document.createElement('div')

    box.style.width = '100%'
    box.style.height = '0'
    box.style.paddingTop = `${(size.height / size.width) * 100}%`
    box.style.position = 'relative'

    this.#el.appendChild(box)

    return box
  }

  private observeResize = (): ResizeObserver => {
    const observer = new ResizeObserver((entries) => {
      const { target } = entries[0]
      const { width, height } = target.getBoundingClientRect()

      this.#listeners.onResize({
        width: resolveDeviceRatio.increment(width),
        height: resolveDeviceRatio.increment(height),
      })
    })

    observer.observe(this.#box)

    return observer
  }

  public createCanvas = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas')

    canvas.style.position = 'absolute'
    canvas.style.inset = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'

    const { width, height } = this.#el.getBoundingClientRect()
    canvas.width = resolveDeviceRatio.increment(width)
    canvas.height = resolveDeviceRatio.increment(height)

    return canvas
  }

  public appendDOM = (canvas: HTMLCanvasElement): void => {
    this.#box.appendChild(canvas)
  }

  public reCalculate = (): this => {
    const size = this.#dependencies.parameters.getSize()

    this.#box.style.paddingTop = `${(size.height / size.width) * 100}%`

    const { width, height } = this.#box.getBoundingClientRect()

    this.#listeners.onResize({
      width: resolveDeviceRatio.increment(width),
      height: resolveDeviceRatio.increment(height),
    })

    return this
  }
}
