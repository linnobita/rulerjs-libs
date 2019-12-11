import { IGuideLine, IOptions } from './interfaces'
import { RulerDirection, addClasses, removeClasses, pixelize } from '../utils'

export class GuideLine implements IGuideLine {
  public line: HTMLElement
  public dragContainer: HTMLElement
  public direction: RulerDirection

  public assigned: boolean
  public curPosDelta: number
  public curScale: number

  public moveCB: Function
  public mouseEvent?: MouseEvent

  private options: IOptions

  constructor(options: IOptions, guideLine?: Partial<IGuideLine>) {
    this.line = document.createElement('div')
    this.dragContainer = document.createElement('div')
    this.direction = RulerDirection.HORIZONTAL
    this.assigned = false
    this.curPosDelta = 0
    this.curScale = 1
    this.moveCB = () => void 0
    this.options = options
    this.mouseEvent = undefined

    this.assign(guideLine)

    this.addListeners()
  }

  public startMoving(ev: MouseEvent): void {
    addClasses(this.line, 'rulerjs_line_dragged')
    const posX = ev ? ev.clientX : 0
    const posY = ev ? ev.clientY : 0
    const divTop = parseInt(this.line.style.top || '0', 10)
    const divLeft = parseInt(this.line.style.left || '0', 10)
    const eWi = this.line.offsetWidth
    const eHe = this.line.offsetHeight
    const cWi = this.dragContainer.offsetWidth
    const cHe = this.dragContainer.offsetHeight
    const cursor = this.direction === RulerDirection.HORIZONTAL ? 'ns-resize' : 'ew-resize'

    this.options.container.style.cursor = cursor
    this.line.style.cursor = cursor
    const diffX = posX - divLeft
    const diffY = posY - divTop

    document.onmousemove = (event: MouseEvent) => {
      const posX = event.clientX
      const posY = event.clientY

      let aX = posX - diffX
      let aY = posY - diffY

      if (aX < 0) {
        aX = 0
      }

      if (aY < 0) {
        aY = 0
      }

      if (aX + eWi > cWi) {
        aX = cWi - eWi
      }
      if (aY + eHe > cHe) {
        aY = cHe - eHe
      }

      this.move(aX, aY)
    }

    this.showTooltip()
  }

  public stopMoving(): void {
    this.options.container.style.cursor = ''
    this.line.style.cursor = ''
    document.onmousemove = () => void 0
    this.hideTooltip()
    removeClasses(this.line, 'rulerjs_line_dragged')
  }

  public hide(): void {
    this.line.style.display = 'none'
  }

  public show(displayType: string = 'block'): void {
    this.line.style.display = displayType
  }

  public destroy(): void {
    this.stopMoving()
    this.moveCB = () => void 0
    this.line.removeEventListener('mousedown', (ev: MouseEvent) => this.mouseDown(ev, this))
    this.line.removeEventListener('mouseup', (ev: MouseEvent) => this.mouseUp(ev, this))
    this.line.removeEventListener('dblclick', (ev: MouseEvent) => this.dblClick(ev, this))
    this.line.parentNode && this.line.parentNode.removeChild(this.line)
  }

  public mouseDown(ev: MouseEvent, guideLine: GuideLine): void {
    if (ev.buttons === 1) {
      ev.stopPropagation()
      guideLine.startMoving(ev)
    }
  }

  public mouseUp(ev: MouseEvent, guideLine: GuideLine): void {
    ev.stopPropagation()
    guideLine.stopMoving()
  }

  public dblClick(ev: MouseEvent, guideLine: GuideLine): void {
    ev.stopPropagation()
    guideLine.destroy()
  }

  private addListeners() {
    this.line.addEventListener('mousedown', (ev: MouseEvent) => this.mouseDown(ev, this))
    this.line.addEventListener('mouseup', (ev: MouseEvent) => this.mouseUp(ev, this))
    this.line.addEventListener('dblclick', (ev: MouseEvent) => this.dblClick(ev, this))
    if (this.mouseEvent) {
      this.startMoving(this.mouseEvent)
    }
  }

  private move(xPos: number, yPos: number): void {
    this.line.style.left = pixelize(xPos)
    this.line.style.top = pixelize(yPos)
    this.updateTooltip(xPos, yPos)
    this.moveCB(this, xPos, yPos)
  }

  private showTooltip(): void {
    if (this.options.enableTooltip) {
      addClasses(this.line, 'rulerjs_tooltip')
    }
  }

  private updateTooltip(x: number, y: number): void {
    if (y > 0) {
      this.line.dataset.tip =
        'Y: ' +
        Math.round((y - this.options.rulerHeight - 1 - this.curPosDelta) * this.curScale) +
        ' px'
    } else {
      this.line.dataset.tip =
        'X: ' +
        Math.round((x - this.options.rulerHeight - 1 - this.curPosDelta) * this.curScale) +
        ' px'
    }
  }

  private hideTooltip() {
    removeClasses(this.line, 'rulerjs_tooltip')
  }

  private assign(guideLine: Partial<IGuideLine> = {}): void {
    for (const key in guideLine) {
      ;(this[key as keyof GuideLine] as any) = guideLine[key as keyof IGuideLine]
    }
  }
}
