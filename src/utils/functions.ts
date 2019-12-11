import { RulerUnitType } from './enums'
import {
  CENTIMETERS_PER_INCH,
  MILLIMETERS_PER_INCH,
  POINTS_PER_INCH,
  PICAS_PER_INCH,
  DEFAULT_INTERVAL_PT_STEP,
  DEFAULT_INTERVAL_IN_STEP,
  DEFAULT_INTERVAL_CM_STEP,
  DEFAULT_INTERVAL_MM_STEP,
  DEFAULT_INTERVAL_P_STEP,
  DEFAULT_INTERVAL_PX_STEP,
} from './constants'

/**
 * Check if the input value is a string
 * @param {*} input The input value
 * @returns {boolean} True if the input is a string
 */
export function isString(input: any): boolean {
  return typeof input === 'string' || input instanceof String
}

/**
 * Convert numbner to pixel string
 * @param {number} val  The value to convert to pixel string
 * @returns {number} The pixel string
 */
export function pixelize(val: number): string {
  return val + 'px'
}

/**
 * Add class or classes to target element
 * @param {HTMLElement} element The target element
 * @param {string | Array<string>} classNames Class name(s) to add to the element
 */
export function addClasses(element: HTMLElement, classNames: string | Array<string>): void {
  let names = new Array<string>()

  if (isString(classNames)) {
    names.push(classNames as string)
  } else {
    names.push(...(classNames as Array<string>))
  }

  element.classList.add(...names)
}

/**
 * Remove class or classes to target element
 * @param {HTMLElement} element The target element
 * @param {string | Array<string>} classNames Class name(s) to remove to the element
 */
export function removeClasses(element: HTMLElement, classNames: string | Array<string>): void {
  let names = new Array<string>()

  if (isString(classNames)) {
    names.push(classNames as string)
  } else {
    names.push(...(classNames as Array<string>))
  }

  element.classList.remove(...names)
}

/**
 * Get the default interval length in pixels
 * @param {RulerUnitType | string} unit Current unit for the ruler
 * @param {number} dpi The DPI for unit converter. Default is 300
 * @returns {number} The default interval length
 */
export function getDefaultIntervalLengthInPixel(
  unit: RulerUnitType | string,
  dpi: number = 300
): number {
  const tmpUnitType = typeof unit === 'string' ? (RulerUnitType as any)[unit] : unit
  switch (tmpUnitType) {
    case RulerUnitType.POINTS:
    case 'POINTS':
      return toPixel(DEFAULT_INTERVAL_PT_STEP, dpi, RulerUnitType.POINTS)

    case RulerUnitType.INCHES:
    case 'INCHES':
      return toPixel(DEFAULT_INTERVAL_IN_STEP, dpi, RulerUnitType.INCHES)

    case RulerUnitType.CENTIMETERS:
    case 'CENTIMETERS':
      return toPixel(DEFAULT_INTERVAL_CM_STEP, dpi, RulerUnitType.CENTIMETERS)

    case RulerUnitType.MILLIMETERS:
    case 'MILLIMETERS':
      return toPixel(DEFAULT_INTERVAL_MM_STEP, dpi, RulerUnitType.MILLIMETERS)

    case RulerUnitType.PICAS:
    case 'PICAS':
      return toPixel(DEFAULT_INTERVAL_P_STEP, dpi, RulerUnitType.PICAS)

    case RulerUnitType.PIXELS:
    default:
      return DEFAULT_INTERVAL_PX_STEP
  }
}

/**
 * Get the default interval step
 * @param {RulerUnitType | string} unit Current unit for the ruler
 * @returns {number} The default interval step
 */
export function getDefaultIntervalStep(unit: RulerUnitType | string): number {
  const tmpUnitType = typeof unit === 'string' ? (RulerUnitType as any)[unit] : unit

  switch (tmpUnitType) {
    case RulerUnitType.POINTS:
    case 'POINTS':
      return DEFAULT_INTERVAL_PT_STEP

    case RulerUnitType.INCHES:
    case 'INCHES':
      return DEFAULT_INTERVAL_IN_STEP

    case RulerUnitType.CENTIMETERS:
    case 'CENTIMETERS':
      return DEFAULT_INTERVAL_CM_STEP

    case RulerUnitType.MILLIMETERS:
    case 'MILLIMETERS':
      return DEFAULT_INTERVAL_MM_STEP

    case RulerUnitType.PICAS:
    case 'PICAS':
      return DEFAULT_INTERVAL_P_STEP

    case RulerUnitType.PIXELS:
    default:
      return DEFAULT_INTERVAL_PX_STEP
  }
}

/**
 * Convert a value from source unit to pixels
 * @param {number} value The value to convert
 * @param {number} dpi The DPI for converting
 * @param {(RulerUnitType | string)} scrUnit The source unit
 * @returns The converted value in pixels
 */
export function toPixel(value: number, dpi: number, scrUnit: RulerUnitType | string) {
  const tmpUnitType = typeof scrUnit === 'string' ? (RulerUnitType as any)[scrUnit] : scrUnit

  switch (tmpUnitType) {
    case RulerUnitType.INCHES:
    case 'INCHES':
      return value * dpi

    case RulerUnitType.CENTIMETERS:
    case 'CENTIMETERS':
      return (value * dpi) / CENTIMETERS_PER_INCH

    case RulerUnitType.MILLIMETERS:
    case 'MILLIMETERS':
      return (value * dpi) / MILLIMETERS_PER_INCH

    case RulerUnitType.POINTS:
    case 'POINTS':
      return (value * dpi) / POINTS_PER_INCH

    case RulerUnitType.PICAS:
    case 'PICAS':
      return (value * dpi) / PICAS_PER_INCH

    case RulerUnitType.PIXELS:
    case 'PIXELS':
    default:
      return value
  }
}

/**
 * Convert a value in pixels to target unit
 * @param {number} value The value to convert
 * @param {number} dpi The DPI for converting
 * @param {(RulerUnitType | string)} targetUnit The target unit
 * @returns The converted value in target unit
 */
export function pixelsToUnit(value: number, dpi: number, targetUnit: RulerUnitType | string) {
  const tmpUnitType =
    typeof targetUnit === 'string' ? (RulerUnitType as any)[targetUnit] : targetUnit
  const inchesPerPixel = 1 / dpi

  switch (tmpUnitType) {
    case RulerUnitType.INCHES:
    case 'INCHES':
      return value * inchesPerPixel

    case RulerUnitType.CENTIMETERS:
    case 'CENTIMETERS':
      return value * inchesPerPixel * CENTIMETERS_PER_INCH

    case RulerUnitType.MILLIMETERS:
    case 'MILLIMETERS':
      return value * inchesPerPixel * MILLIMETERS_PER_INCH

    case RulerUnitType.POINTS:
    case 'POINTS':
      return value * inchesPerPixel * POINTS_PER_INCH

    case RulerUnitType.PICAS:
    case 'PICAS':
      return value * inchesPerPixel * PICAS_PER_INCH

    case RulerUnitType.PIXELS:
    case 'PIXELS':
    default:
      return value
  }
}
