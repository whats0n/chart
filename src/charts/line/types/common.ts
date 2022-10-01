import { Emitter } from '../partials/emitter'
import { ParametersStore } from '../partials/parameters'

export interface Dependencies {
  emitter: Emitter
  parameters: ParametersStore
}
