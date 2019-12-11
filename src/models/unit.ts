import { RulerUnitType, toPixel, pixelsToUnit } from '../utils'
import { IRulerUnit } from './interfaces'

export class RulerUnit implements IRulerUnit {
  public name: RulerUnitType
  public value: number
  public dpi: number

  constructor(unit?: Partial<IRulerUnit>) {
    this.name = RulerUnitType.PIXELS
    this.value = 0
    this.dpi = 300

    this.assign(unit)
  }

  public setUnit(unit: RulerUnitType) {
    this.name = unit
  }

  public getFormattedName(isShort: boolean = false): string {
    switch (this.name) {
      case RulerUnitType.INCHES:
        return isShort ? 'in' : 'Inches'

      case RulerUnitType.CENTIMETERS:
        return isShort ? 'cm' : 'Centimeters'

      case RulerUnitType.MILLIMETERS:
        return isShort ? 'mm' : 'Millimeters'

      case RulerUnitType.POINTS:
        return isShort ? 'pt' : 'Points'

      case RulerUnitType.PICAS:
        return isShort ? 'p' : 'Picas'

      case RulerUnitType.PIXELS:
      default:
        return isShort ? 'px' : 'Pixels'
    }
  }

  public toUnit(unit: RulerUnitType): number {
    return this.unitConverter(this.name, unit)
  }

  private assign(unit: Partial<IRulerUnit> = {}): void {
    for (const key in unit) {
      (this[key as keyof RulerUnit] as any) = unit[key as keyof IRulerUnit]
    }
  }

  private unitConverter(from: RulerUnitType, to: RulerUnitType): number {
    if (from <= RulerUnitType.UNKNOWN || to <= RulerUnitType.UNKNOWN) {
      return this.value
    }

    const pixels = toPixel(this.value, this.dpi, from)

    return pixelsToUnit(pixels, this.dpi, to)
  }
}
