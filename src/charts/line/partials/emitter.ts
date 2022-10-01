import { PointData } from '../types/parameters'

type Events = 'pointEnter' | 'pointLeave' | 'pointSelect' | 'pointUnselect'

export interface EmitterEventOptions {
  value: PointData | number
  position: { top: number; left: number }
}

export interface EmitterEventListener {
  (e: EmitterEventOptions): void
}

export class Emitter {
  #events: Record<Events, EmitterEventListener[]> = {
    pointEnter: [],
    pointLeave: [],
    pointSelect: [],
    pointUnselect: [],
  }

  public on = (event: Events, listener: EmitterEventListener): this => {
    this.#events[event].push(listener)
    return this
  }

  public off = (event: Events, listener: EmitterEventListener): this => {
    this.#events[event] = this.#events[event].filter((cb) => cb !== listener)
    return this
  }

  public emit = (event: Events, options: EmitterEventOptions): this => {
    this.#events[event].forEach((listener) => listener(options))
    return this
  }
}
