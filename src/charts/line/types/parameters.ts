import { DeepPartial } from '../../utility-types/DeepPartial'
import { BackgroundStyle, GridStyle, PathStyle, PointStyle } from './styles'

export type PointData = { x: number; y: number }

export type DatasetData = PointData[] | number[]

export interface DatasetStyle {
  path: PathStyle
  point: PointStyle
  pointHover: PointStyle
  pointSelected: PointStyle
}

export interface Dataset {
  data: DatasetData
  style?: DeepPartial<DatasetStyle>
}

export enum AnimationType {
  GROW_Y = 'growY',
  TRANSLATE_Y = 'translateY',
  CROP_X = 'cropX',
}

export type Padding = Record<
  'top' | 'right' | 'bottom' | 'left',
  number | string
>

export type AnimationDetails = {
  type: AnimationType
  duration: number
  timingFunction: (t: number) => number
}

export interface ParametersHighest {
  x: number
  y: number
}

export interface ParametersSize {
  width: number
  height: number
  padding: Padding
}

export type ParametersStyle = {
  background: BackgroundStyle
  grid: GridStyle
} & DatasetStyle

export interface Parameters {
  datasets: Dataset[]
  withStartPoint?: boolean
  withFinishPoint?: boolean
  highest?: Partial<ParametersHighest>
  size?: DeepPartial<ParametersSize>
  animation?: Partial<AnimationDetails>
  style?: DeepPartial<ParametersStyle>
}
