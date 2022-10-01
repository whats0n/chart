export type BaseStyle = {
  shadowOffsetX: number
  shadowOffsetY: number
  shadowBlur: number
  shadowColor: string
} & Pick<CanvasFillStrokeStyles, 'fillStyle' | 'strokeStyle'>

export type PathStyle = BaseStyle & {
  lineCap: CanvasLineCap
  lineJoin: CanvasLineJoin
  lineWidth: number
}

export type PointStyle = BaseStyle & {
  lineWidth: number
  size: number
}

export type BackgroundStyle = string | CanvasGradient | CanvasPattern

export type GridStyle = {
  gap: number
  lineWidth: number
} & Pick<CanvasFillStrokeStyles, 'strokeStyle'>
