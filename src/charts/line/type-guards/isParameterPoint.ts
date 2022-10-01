import { PointData } from '../types/parameters'

export const isParameterPoint = (point: unknown): point is PointData =>
  typeof point === 'object' &&
  Object.prototype.hasOwnProperty.call(point, 'x') &&
  Object.prototype.hasOwnProperty.call(point, 'y')

export const isParameterPoints = (points: unknown[]): points is PointData[] =>
  points.every(isParameterPoint)
