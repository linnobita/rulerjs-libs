import { CornerAlignment, RulerAlignment, RulerDirection, RulerUnitType } from '../utils'
import { RulerUnit } from './unit';

export interface IOptions {
  container: HTMLElement
  measuringTarget: HTMLElement | null
  rulerHeight: number
  fontFamily: string
  fontSize: number
  fontColor: string
  strokeStyle: string
  rulerAlignments: Array<RulerAlignment>
  conerAlignments: Array<CornerAlignment>
  lineWidth: number
  enableMouseTracking: boolean
  enableTooltip: boolean
}

export interface IRuler {
  canvas: HTMLCanvasElement
  direction: RulerDirection,
  unit: RulerUnit;
}

export interface IGuideLine {
  line: HTMLElement
  dragContainer: HTMLElement
  direction: RulerDirection
  assigned: boolean
  curPosDelta: number
  curScale: number
  moveCB: Function
  mouseEvent?: MouseEvent
}

export interface IRulerUnit {
  name: RulerUnitType
  value: number
  dpi: number
}

export interface RulerPoint {
  x: number
  y: number
}

export interface GuideLineInfo {
  point: RulerPoint
  direction: RulerDirection
}
