import { IRuler, IOptions } from './interfaces'
import {
  RulerDirection,
  pixelize,
  addClasses,
  RulerUnitType,
  getDefaultIntervalLengthInPixel,
  getDefaultIntervalStep,
} from '../utils'
import { RulerMark } from './rulermark'
import { RulerUnit } from './unit'

export class Ruler implements IRuler {
  public canvas: HTMLCanvasElement
  public direction: RulerDirection
  public unit: RulerUnit;

  public context: CanvasRenderingContext2D
  public thickness: number
  public length: number
  public scale: number
  public origPos: number
  public tracker: HTMLDivElement

  private options: IOptions

  constructor(options: IOptions, ruler?: Partial<IRuler>) {
    this.canvas = document.createElement('canvas')
    this.direction = RulerDirection.HORIZONTAL;
    this.unit = new RulerUnit();

    this.options = options
    this.tracker = document.createElement('div')
    this.assign(ruler)

    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.thickness = 0
    this.length = 0
    this.scale = 1
    this.origPos = 0

    if (this.options.enableMouseTracking) {
      this.initTracker()
    }
  }

  public drawRuler(length: number, thickness: number, scale?: number): void {
    this.length = length * 2
    this.thickness = thickness
    this.scale = scale || this.scale
    this.canvas.width = length * 2
    this.canvas.height = thickness

    this.context.strokeStyle = this.options.strokeStyle
    this.context.font = pixelize(this.options.fontSize) + ' ' + this.options.fontFamily
    this.context.fillStyle = '#333'
    this.context.lineWidth = this.options.lineWidth
    this.context.beginPath()
    this.drawIntervals()
  }

  public setUnit(unit: RulerUnitType): void {
    this.unit.name = unit;
    this.drawIntervals()
  }

  public setScale(newScale: number): void {
    this.scale = newScale
    this.drawIntervals()
  }

  public setColor(color: string): void {
    this.context.fillStyle = color
    this.drawIntervals()
  }

  public setDPI(dpi: number): void {
    this.unit.dpi = dpi;
  }

  private drawIntervals(): void {
    const intervalLength = getDefaultIntervalLengthInPixel(this.unit.name, this.unit.dpi) * this.scale
    const interalsCount = Math.ceil(this.length / intervalLength)

    for (let i = 0; i < interalsCount; ++i) {
      const startPos = intervalLength * i
      const label = Math.round(i * getDefaultIntervalStep(this.unit.name) * this.scale).toFixed(0)
      this.context.moveTo(startPos + 0.5, this.thickness + 0.5)
      this.context.lineTo(startPos + 0.5, 0.5)
      this.context.fillText(label, startPos + 1.5, this.thickness / 2 + 1)

      this.drawMarkers(startPos, intervalLength)
    }

    this.context.stroke()
  }

  private drawMarkers(
    startPos: number,
    length: number
  ): void {
    for (const markOffset of RulerMark.getMarkOffsetsByUnit(this.unit.name)) {
      const pos = startPos + length * markOffset.firstValue
      if (markOffset.firstValue === 0.5 || markOffset.firstValue === 4.0 / 8) {
        this.context.moveTo(pos + 0.5, this.thickness + 0.5)
        this.context.lineTo(pos + 0.5, this.thickness / 4 + 0.5)
      } else {
        this.context.moveTo(pos + 0.5, markOffset.secondValue + 0.5)
        this.context.lineTo(pos + 0.5, this.thickness / 2 + 0.5)
      }
    }
  }

  private initTracker(): void {
    this.tracker =
      this.options.measuringTarget !== null
        ? this.options.measuringTarget.appendChild(this.tracker)
        : this.options.container.appendChild(this.tracker)
    addClasses(this.tracker, 'rulerjs_tracker')
    const length = pixelize(this.options.rulerHeight)
    if (this.direction === RulerDirection.HORIZONTAL) {
      this.tracker.style.height = length
    } else {
      this.tracker.style.width = length
    }
  }

  private assign(ruler: Partial<IRuler> = {}): void {
    for (const key in ruler) {
      ;(this[key as keyof Ruler] as any) = ruler[key as keyof IRuler]
    }
  }
}
