import { DeepPartial } from '../../../utility-types/DeepPartial'
import {
  AnimationDetails,
  Dataset,
  Padding,
  Parameters,
  ParametersHighest,
  ParametersSize,
  ParametersStyle,
} from '../../types/parameters'
import { PathStyle, PointStyle } from '../../types/styles'
import {
  initialAnimation,
  initialHighest,
  initialSize,
  initialStyle,
} from './initialStyle'

export class ParametersStore {
  #animation: AnimationDetails = initialAnimation

  #style: ParametersStyle = initialStyle

  #size: ParametersSize = initialSize

  #highest: ParametersHighest = initialHighest

  #withStartPoint: boolean = true

  #withFinishPoint: boolean = true

  #datasets: Dataset[] = []

  constructor(parameters: Parameters) {
    this.update(parameters)
    this.setData(parameters.datasets)
  }

  public update = (parameters: Omit<Parameters, 'datasets'>): this => {
    this.#animation = this.mergeAnimation(this.#animation, parameters.animation)
    this.#style = this.mergeStyle(this.#style, parameters.style)
    this.#size = this.mergeSize(this.#size, parameters.size)
    this.#highest = this.mergeHighest(this.#highest, parameters.highest)

    this.#withStartPoint = parameters.withStartPoint ?? this.#withStartPoint
    this.#withFinishPoint = parameters.withFinishPoint ?? this.#withFinishPoint

    return this
  }

  public set = (parameters: Omit<Parameters, 'datasets'>): this => {
    this.#animation = this.mergeAnimation(
      initialAnimation,
      parameters.animation
    )
    this.#style = this.mergeStyle(initialStyle, parameters.style)
    this.#size = this.mergeSize(initialSize, parameters.size)
    this.#highest = this.mergeHighest(initialHighest, parameters.highest)

    this.#withStartPoint = parameters.withStartPoint ?? true
    this.#withFinishPoint = parameters.withFinishPoint ?? true

    return this
  }

  public setData = (datasets: Dataset[]): this => {
    this.#datasets = datasets
    return this
  }

  public getData = (): Dataset[] => this.#datasets

  public getStyle = <K extends keyof ParametersStyle>(
    field: K
  ): ParametersStyle[K] => this.#style[field]

  public getPathStyle = (i: number): PathStyle =>
    this.mergeStyle(this.#style, this.#datasets[i].style).path

  public getPointStyle = (
    i: number,
    field: 'point' | 'pointHover' | 'pointSelected'
  ): PointStyle => this.mergeStyle(this.#style, this.#datasets[i].style)[field]

  public getSize = (): ParametersSize => this.#size

  public getAnimation = (): AnimationDetails => this.#animation

  public getMeta = (): {
    withStartPoint: boolean
    withFinishPoint: boolean
    highest: ParametersHighest
  } => ({
    withStartPoint: this.#withStartPoint,
    withFinishPoint: this.#withFinishPoint,
    highest: this.#highest,
  })

  private mergeStyle = (
    prev: ParametersStyle,
    next?: DeepPartial<ParametersStyle>
  ): ParametersStyle => ({
    background: next?.background || prev?.background || initialStyle.background,
    grid: {
      ...initialStyle.grid,
      ...(prev?.grid || {}),
      ...(next?.grid || {}),
    },
    path: {
      ...initialStyle.path,
      ...(prev?.path || {}),
      ...(next?.path || {}),
    },
    point: {
      ...initialStyle.point,
      ...(prev?.point || {}),
      ...(next?.point || {}),
    },
    pointHover: {
      ...initialStyle.pointHover,
      ...(prev?.pointHover || {}),
      ...(next?.pointHover || {}),
    },
    pointSelected: {
      ...initialStyle.pointSelected,
      ...(prev?.pointSelected || {}),
      ...(next?.pointSelected || {}),
    },
  })

  private mergeSize = (
    prev: ParametersSize,
    next?: DeepPartial<ParametersSize>
  ): {
    width: number
    height: number
    padding: Padding
  } => ({
    ...initialSize,
    ...(prev || {}),
    ...(next || {}),
    padding: {
      ...initialSize.padding,
      ...(prev.padding || {}),
      ...(next?.padding || {}),
    },
  })

  private mergeAnimation = (
    prev: AnimationDetails,
    next?: Partial<AnimationDetails>
  ): Required<AnimationDetails> => ({
    ...initialAnimation,
    ...(prev || {}),
    ...(next || {}),
  })

  private mergeHighest = (
    prev: ParametersHighest,
    next?: Partial<ParametersHighest>
  ): ParametersHighest => ({
    ...initialHighest,
    ...(prev || {}),
    ...(next || {}),
  })
}
