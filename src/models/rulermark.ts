import { RulerUnitType } from '../utils'

export class RulerMark {
  static RULER_WHOLE_INTERVAL_OFFSET = 2
  static RULER_HALF_INTERVAL_OFFSET = 10
  static RULER_QUARTER_INTERVAL_OFFSET = 13
  static RULER_EIGHTH_INTERVAL_OFFSET = 15
  static RULER_TENTH_INTERVAL_OFFSET = 15

  static BASE_2_MARK_OFFSETS = [
    {
      firstValue: 0,
      secondValue: RulerMark.RULER_WHOLE_INTERVAL_OFFSET,
    },
    {
      firstValue: 1.0 / 8,
      secondValue: RulerMark.RULER_EIGHTH_INTERVAL_OFFSET,
    },
    {
      firstValue: 2.0 / 8,
      secondValue: RulerMark.RULER_QUARTER_INTERVAL_OFFSET,
    },
    {
      firstValue: 3.0 / 8,
      secondValue: RulerMark.RULER_EIGHTH_INTERVAL_OFFSET,
    },
    {
      firstValue: 4.0 / 8,
      secondValue: RulerMark.RULER_HALF_INTERVAL_OFFSET,
    },
    {
      firstValue: 5.0 / 8,
      secondValue: RulerMark.RULER_EIGHTH_INTERVAL_OFFSET,
    },
    {
      firstValue: 6.0 / 8,
      secondValue: RulerMark.RULER_QUARTER_INTERVAL_OFFSET,
    },
    {
      firstValue: 7.0 / 8,
      secondValue: RulerMark.RULER_EIGHTH_INTERVAL_OFFSET,
    },
  ]

  static TENTH_MARK_OFFSETS = [
    {
      firstValue: 0,
      secondValue: RulerMark.RULER_WHOLE_INTERVAL_OFFSET,
    },
    {
      firstValue: 0.1,
      secondValue: RulerMark.RULER_TENTH_INTERVAL_OFFSET,
    },
    {
      firstValue: 0.2,
      secondValue: RulerMark.RULER_TENTH_INTERVAL_OFFSET,
    },
    {
      firstValue: 0.3,
      secondValue: RulerMark.RULER_TENTH_INTERVAL_OFFSET,
    },
    {
      firstValue: 0.4,
      secondValue: RulerMark.RULER_TENTH_INTERVAL_OFFSET,
    },
    {
      firstValue: 0.5,
      secondValue: RulerMark.RULER_HALF_INTERVAL_OFFSET,
    },
    {
      firstValue: 0.6,
      secondValue: RulerMark.RULER_TENTH_INTERVAL_OFFSET,
    },
    {
      firstValue: 0.7,
      secondValue: RulerMark.RULER_TENTH_INTERVAL_OFFSET,
    },
    {
      firstValue: 0.8,
      secondValue: RulerMark.RULER_TENTH_INTERVAL_OFFSET,
    },
    {
      firstValue: 0.9,
      secondValue: RulerMark.RULER_TENTH_INTERVAL_OFFSET,
    },
  ]

  static getMarkOffsetsByUnit(unit: RulerUnitType | string): Array<any> {
    const tmpUnitType = typeof unit === 'string' ? (RulerUnitType as any)[unit] : unit

    switch (tmpUnitType) {
      case RulerUnitType.POINTS:
      case RulerUnitType.INCHES:
      case 'POINTS':
      case 'INCHES':
        return this.BASE_2_MARK_OFFSETS

      case RulerUnitType.PIXELS:
      case RulerUnitType.CENTIMETERS:
      case RulerUnitType.MILLIMETERS:
      default:
        return this.TENTH_MARK_OFFSETS
    }
  }
}
