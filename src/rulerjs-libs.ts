import { Ruler, GuideLine, Corner, IOptions, Options, GuideLineInfo } from './models'
import * as UTILS from './utils'

export * from './utils'
export * from './models'

export class RulerjsLib {
  public rulers: Array<Ruler>
  public guides: Array<GuideLine>
  public corners: Array<Corner>

  private options: IOptions
  private curDeltaX: number
  private curDeltaY: number
  private curScale: number
  private rulerEle: HTMLElement

  constructor(options?: Partial<IOptions>) {
    this.rulers = new Array<Ruler>()
    this.guides = new Array<GuideLine>()
    this.corners = new Array<Corner>()

    this.options = new Options(options)
    this.curDeltaX = 0
    this.curDeltaY = 0
    this.curScale = 1
    this.rulerEle = document.createElement('div')

    this.generateRulers()
  }

  public getGuideLines(): Array<GuideLineInfo> {
    return this.guides.map((guide: GuideLine) => {
      return {
        point: {
          x: Math.round(
            (parseInt(guide.line.style.left || '0', 10) -
              this.curDeltaX -
              this.options.rulerHeight) *
              this.curScale
          ),
          y: Math.round(
            (parseInt(guide.line.style.top || '0', 10) -
              this.curDeltaY -
              this.options.rulerHeight) *
              this.curScale
          ),
        },
        direction: guide.direction,
      }
    })
  }

  public setGuides(guides: Array<GuideLineInfo>) {
    if (!guides) return

    for (const guide of guides) {
      this.createGuideLine(guide.direction, guide.point.x, guide.point.y, undefined, true)
    }
  }

  public setTheme(theme: UTILS.RulerTheme = UTILS.RulerTheme.LIGHT_THEME) {
    const rulerWrappers = document.getElementsByClassName('rulerjs_wrapper')

    for (let i = 0; i < rulerWrappers.length; i++) {
      const rulerWrapper = rulerWrappers[i] as HTMLElement
      if (theme && theme !== UTILS.RulerTheme.LIGHT_THEME) {
        UTILS.addClasses(rulerWrapper, 'dark-theme')
      } else {
        UTILS.removeClasses(rulerWrapper, 'dark-theme')
      }
    }

    for (const ruler of this.rulers) {
      const color = theme && theme !== UTILS.RulerTheme.LIGHT_THEME ? '#fcfcfc' : '#333'
      ruler.context.clearRect(0, 0, ruler.canvas.width, ruler.canvas.height)
      ruler.context.beginPath()
      ruler.setColor(color)
    }
  }

  public setUnit(unit: UTILS.RulerUnitType): void {
    for (const ruler of this.rulers) {
      ruler.context.clearRect(0, 0, ruler.canvas.width, ruler.canvas.height)
      ruler.context.beginPath()
      ruler.setUnit(unit)
    }
  }

  public setScale(scale: number): void {
    let curPos = 0
    let origDelta = 0
    let curScaleFactor = 0

    for (const ruler of this.rulers) {
      ruler.context.clearRect(0, 0, ruler.canvas.width, ruler.canvas.height)
      ruler.context.beginPath()
      ruler.setScale(scale)
      this.curScale = scale
    }

    for (const guide of this.guides) {
      origDelta = this.options.rulerHeight + 1
      curScaleFactor = scale / guide.curScale
      if (guide.direction === UTILS.RulerDirection.HORIZONTAL) {
        curPos = parseInt(guide.line.style.top || '0', 10)
        guide.line.style.top = UTILS.pixelize(
          (curPos - origDelta - this.curDeltaY) / curScaleFactor + origDelta + this.curDeltaY
        )
      } else {
        curPos = parseInt(guide.line.style.left || '0', 10)
        guide.line.style.left = UTILS.pixelize(
          (curPos - origDelta - this.curDeltaX) / curScaleFactor + origDelta + this.curDeltaX
        )
      }
      guide.curScale = scale
    }
  }

  public destroy() {
    this.clearGuideLines()
    for (const ruler of this.rulers) {
      this.options.container.removeEventListener('mousemove', (ev: MouseEvent) =>
        this.rulerMouseMove(ev, ruler)
      )
      this.options.container.removeEventListener('mousedown', (ev: MouseEvent) =>
        this.rulerMouseDown(ev, ruler)
      )
      ruler.tracker.parentNode && ruler.tracker.parentNode.removeChild(ruler.tracker)
    }
    for (const corner of this.corners) {
      corner.destroy()
    }
    this.options.container.removeEventListener('mouseup', (ev: MouseEvent) =>
      this.containerMouseUp(ev, this)
    )

    if (this.options.measuringTarget !== null) {
      this.rulerEle.parentNode && this.rulerEle.parentNode.removeChild(this.rulerEle)
    }
  }

  private generateRulers(): void {
    const rulerEle = document.createElement('div')
    UTILS.addClasses(rulerEle, 'rulerjs_wrapper')
    this.rulerEle =
      this.options.measuringTarget !== null
        ? this.options.measuringTarget.appendChild(rulerEle)
        : this.options.container.appendChild(rulerEle)

    for (const ra of this.options.rulerAlignments) {
      this.rulers.push(this.createRuler(ra))
    }
    this.createCorners()

    this.options.container.addEventListener('mouseup', (ev: MouseEvent) =>
      this.containerMouseUp(ev, this)
    )
  }

  private createRuler(alignment: UTILS.RulerAlignment): Ruler {
    const direction =
      alignment === UTILS.RulerAlignment.LEFT || alignment === UTILS.RulerAlignment.RIGHT
        ? UTILS.RulerDirection.VERTICAL
        : UTILS.RulerDirection.HORIZONTAL
    const rulerStyle =
      direction === UTILS.RulerDirection.VERTICAL
        ? 'rulerjs_ruler_Vertical'
        : 'rulerjs_ruler_Horizontal'
    const canvasEle = document.createElement('canvas')

    UTILS.addClasses(canvasEle, ['rulerjs', rulerStyle, 'rulerjs_align_' + alignment.valueOf()])
    const newRuler = new Ruler(this.options, {
      direction: direction,
      canvas: this.rulerEle.appendChild(canvasEle),
    })

    this.options.container.addEventListener('mousemove', (ev: MouseEvent) =>
      this.rulerMouseMove(ev, newRuler)
    )
    newRuler.canvas.addEventListener('mousedown', (ev: MouseEvent) =>
      this.rulerMouseDown(ev, newRuler)
    )

    newRuler.drawRuler(
      Math.max(this.rulerEle.clientWidth, this.rulerEle.clientHeight),
      this.options.rulerHeight
    )
    this.positionRuler(newRuler, alignment)

    return newRuler
  }

  private createCorners(): void {
    if (!this.corners) {
      this.corners = new Array<Corner>()
    }
    for (const ca of this.options.conerAlignments) {
      const newCorner = new Corner(this.options)
      newCorner.corner.addEventListener('mousedown', this.cornerMouseDown)
      newCorner.drawCorner(this.rulerEle, ca)
      this.corners.push(newCorner)
    }
  }

  private createGuideLine(
    direction: UTILS.RulerDirection,
    x: number,
    y: number,
    ev?: MouseEvent,
    isSet: boolean = false
  ): void {
    const moveCB = (line: GuideLine, x: number, y: number) => {
      const coor = line.direction === UTILS.RulerDirection.VERTICAL ? x : y

      if (!line.assigned) {
        line.assigned = coor > this.options.rulerHeight
      } else if (coor < this.options.rulerHeight) {
        const index = this.guides.indexOf(line)
        line.destroy()
        this.guides.splice(index, 1)
      }
    }

    const tempGuide = document.createElement('div')
    const guideStyle =
      direction === UTILS.RulerDirection.VERTICAL
        ? 'rulerjs_lineVertical'
        : 'rulerjs_lineHorizontal'
    const curDelta = direction === UTILS.RulerDirection.VERTICAL ? this.curDeltaX : this.curDeltaY

    tempGuide.title = 'Double click to delete'
    UTILS.addClasses(tempGuide, ['rulerjs_line', guideStyle])
    const guide = this.rulerEle.appendChild(tempGuide)

    const boundingClientRect =
      this.options.measuringTarget !== null
        ? this.options.measuringTarget.getBoundingClientRect()
        : this.options.container.getBoundingClientRect()

    if (direction === UTILS.RulerDirection.VERTICAL) {
      guide.style.left = UTILS.pixelize(
        !isSet
          ? x - boundingClientRect.left
          : Math.round(x / this.curScale) + this.options.rulerHeight
      )
      guide.style.top = '0px'
      guide.style.height = UTILS.pixelize(boundingClientRect.height + this.options.rulerHeight + 2)
    } else {
      guide.style.top = UTILS.pixelize(
        !isSet
          ? y - boundingClientRect.top
          : Math.round(y / this.curScale) + this.options.rulerHeight
      )
      guide.style.left = '0px'
      guide.style.width = UTILS.pixelize(boundingClientRect.width + this.options.rulerHeight + 2)
    }

    const dragContainer =
      this.options.measuringTarget !== null
        ? this.options.measuringTarget
        : (this.options.container.querySelector('.rulerjs_wrapper') as HTMLElement)

    this.guides.push(
      new GuideLine(this.options, {
        line: guide,
        dragContainer: dragContainer,
        direction: direction,
        curPosDelta: curDelta,
        moveCB: moveCB,
        mouseEvent: ev,
      })
    )
  }

  private clearGuideLines(): void {
    for (const guide of this.guides) {
      guide.destroy()
    }

    this.guides = new Array<GuideLine>()
  }

  private positionRuler(ruler: Ruler, alignment: UTILS.RulerAlignment): void {
    switch (alignment) {
      case UTILS.RulerAlignment.BOTTOM:
        ruler.canvas.style.left = UTILS.pixelize(ruler.canvas.height + 1)
        ruler.canvas.style.top = UTILS.pixelize(this.options.container.clientHeight)
        ruler.origPos = parseInt(ruler.canvas.style.left, 10)
        break
      case UTILS.RulerAlignment.LEFT:
        ruler.canvas.style.left = UTILS.pixelize(0)
        ruler.canvas.style.top = UTILS.pixelize(0)
        ruler.origPos = parseInt(ruler.canvas.style.top, 10)
        this.rotateRuler(ruler, 90)
        break
      case UTILS.RulerAlignment.RIGHT:
        ruler.canvas.style.left = UTILS.pixelize(this.options.container.clientWidth)
        ruler.canvas.style.top = UTILS.pixelize(0)
        ruler.origPos = parseInt(ruler.canvas.style.top, 10)
        this.rotateRuler(ruler, 90)
        break
      case UTILS.RulerAlignment.TOP:
      default:
        ruler.canvas.style.left = UTILS.pixelize(ruler.canvas.height + 1)
        ruler.origPos = parseInt(ruler.canvas.style.left, 10)
        break
    }
  }

  private rotateRuler(ruler: Ruler, angle: number): void {
    const rotation = 'rotate(' + angle + 'deg)'
    const origin = UTILS.pixelize(Math.abs(parseInt(ruler.canvas.style.left || '0', 10))) + ' 100%'

    // @ts-ignore
    // tslint:disable-next-line: deprecation
    ruler.canvas.style.webkitTransform = rotation
    // @ts-ignore
    ruler.canvas.style.MozTransform = rotation
    // @ts-ignore
    ruler.canvas.style.OTransform = rotation
    // @ts-ignore
    ruler.canvas.style.msTransform = rotation
    ruler.canvas.style.transform = rotation
    // tslint:disable-next-line: deprecation
    ruler.canvas.style.webkitTransformOrigin = origin
    // @ts-ignore
    ruler.canvas.style.MozTransformOrigin = origin
    // @ts-ignore
    ruler.canvas.style.OTransformOrigin = origin
    // @ts-ignore
    ruler.canvas.style.msTransformOrigin = origin
    ruler.canvas.style.transformOrigin = origin
  }

  private cornerMouseDown(ev: MouseEvent): void {
    ev.stopPropagation()
    this.clearGuideLines()
  }
  private rulerMouseDown(ev: MouseEvent, ruler: Ruler): void {
    if (ev.buttons === 1) {
      this.createGuideLine(ruler.direction, ev.clientX, ev.clientY, ev)
    }
  }
  private rulerMouseMove(ev: MouseEvent, ruler: Ruler): void {
    const posX = ev.clientX
    const posY = ev.clientY

    const boundingClientRect =
      this.options.measuringTarget !== null
        ? this.options.measuringTarget.getBoundingClientRect()
        : this.options.container.getBoundingClientRect()

    if (ruler.direction === UTILS.RulerDirection.HORIZONTAL) {
      ruler.tracker.style.left = UTILS.pixelize(posX - boundingClientRect.left)
    } else {
      ruler.tracker.style.top = UTILS.pixelize(posY - boundingClientRect.top)
    }
  }

  private containerMouseUp(ev: MouseEvent, rl: RulerjsLib): void {
    for (const guide of rl.guides) {
      guide.stopMoving()
    }
  }
}
