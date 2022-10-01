import {
  AnimationDetails,
  AnimationType,
  Padding,
} from '../../types/parameters'
import { GridStyle, PathStyle, PointStyle } from '../../types/styles'
import { Motion } from '../motion'

export const initialPathStyle: PathStyle = {
  lineCap: 'round',
  lineJoin: 'round',
  lineWidth: 0,
  fillStyle: 'transparent',
  strokeStyle: 'transparent',
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowBlur: 0,
  shadowColor: 'transparent',
}

export const initialPointStyle: PointStyle = {
  lineWidth: 0,
  size: 0,
  fillStyle: 'transparent',
  strokeStyle: 'transparent',
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowBlur: 0,
  shadowColor: 'transparent',
}

export const initialGridStyle: GridStyle = {
  gap: 0,
  lineWidth: 0,
  strokeStyle: 'transparent',
}

export const initialAnimation: AnimationDetails = {
  type: AnimationType.GROW_Y,
  duration: 3000,
  timingFunction: Motion.timingFunction.linear,
}

export const initialStyle = {
  background: 'transparent',
  path: initialPathStyle,
  point: initialPointStyle,
  pointHover: initialPointStyle,
  pointSelected: initialPointStyle,
  grid: initialGridStyle,
}

export const initialSize: {
  width: number
  height: number
  padding: Padding
} = {
  width: 500,
  height: 300,
  padding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
}

export const initialHighest = { x: 100, y: 100 }
